from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, Distance, VectorParams

app = Flask(__name__)
client = QdrantClient(url="http://localhost:6333")
collection_name = "symptom_collection"
model = SentenceTransformer('paraphrase-multilingual-mpnet-base-v2')

def initialize_collection():
    collections = client.get_collections().collections
    collection_names = [collection.name for collection in collections]

    if collection_name in collection_names:
        client.delete_collection(collection_name=collection_name)

    client.create_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(size=768, distance=Distance.COSINE),
    )

    sentences = [
        "Cold: Runny nose, sore throat, cough, mild fever, headache",
        "Flu: Cough, high fever, muscle aches, headache, severe fatigue",
        "Gastrointestinal infection: Diarrhea, abdominal pain, nausea, vomiting, mild fever",
        "Allergy: Sneezing, itching, watery eyes, runny nose, rash",
        "Depression: Persistent sadness, loss of interest in activities, severe fatigue, sleep disturbances, loss of appetite",
        "Asthma: Shortness of breath, cough, wheezing, chest tightness, nighttime coughing fits",
        "Urinary tract infection: Painful urination, frequent urination, blood in urine, abdominal pain, mild fever",
        "Migraine: Severe headache, nausea, light sensitivity, sound sensitivity, vision disturbances",
        "Conjunctivitis: Red, itchy eyes, increased tearing, eye burning, discharge, eyelid swelling",
        "Arthritis: Pain in the affected joint, swelling, redness, warmth, limited mobility",
        "Gastritis: Stomach pain, nausea, vomiting, belching, feeling of fullness",
        "Kidney stones: Severe back pain, blood in urine, nausea, frequent urination, burning sensation when urinating",
        "Heuschnupfen: Niesen, laufende Nase, juckende Augen, tränende Augen, verstopfte Nase",
        "Bronchitis: Cough with sputum, chest pain, fatigue, shortness of breath, mild fever",
        "Otitis media (Middle ear infection): Ear pain, fever, hearing loss, ear discharge, sleep disturbances"
    ]

    embeddings = model.encode(sentences)

    points = [
        PointStruct(id=i, vector=embedding.tolist(), payload={"sentence": sentence})
        for i, (sentence, embedding) in enumerate(zip(sentences, embeddings))
    ]

    client.upsert(
        collection_name=collection_name,
        points=points
    )

@app.route("/initialize_database/", methods=["POST"])
def initialize_database():
    initialize_collection()
    return jsonify({"message": "Database initialized and populated"})

@app.route("/find_similar_symptom/", methods=["POST"])
def find_similar_symptom():
    data = request.json
    if "sentence" not in data:
        return jsonify({"error": "No sentence provided"}), 400

    input_sentence = data["sentence"]
    input_embedding = model.encode(input_sentence).tolist()

    search_result = client.search(
        collection_name=collection_name,
        query_vector=input_embedding,
        limit=4
    )

    threshold = 0.65
    similar_sicknesses = []

    for result in search_result:
        if result.score >= threshold:
            most_similar_sentence = result.payload["sentence"]
            colon_index = most_similar_sentence.find(':')
            if colon_index != -1:
                most_similar_sickness = most_similar_sentence[:colon_index].strip()
                if most_similar_sickness not in similar_sicknesses:
                    similar_sicknesses.append(most_similar_sickness)
                    if len(similar_sicknesses) >= 2:
                        break

    if len(similar_sicknesses) < 2:
        similar_sicknesses.append("No further diseases found")

    return jsonify({"Sicknesses": similar_sicknesses[:2]})

if __name__ == "__main__":
    app.run(debug=True)