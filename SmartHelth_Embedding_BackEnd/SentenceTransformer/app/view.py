from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, Distance, VectorParams
from flask import Flask, request, jsonify
from flask_cors import CORS

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
    "Erkältung: Schnupfen, Halsschmerzen, Husten, leichtes Fieber, Kopfschmerzen",
    "Grippe: Husten, hohes Fieber, Muskelschmerzen, Kopfschmerzen, starke Müdigkeit",
    "Magen-Darm-Infektion: Durchfall, Bauchschmerzen, Übelkeit, Erbrechen, leichtes Fieber",
    "Allergie: Niesen, Juckreiz, tränende Augen, laufende Nase, Hautausschlag",
    "Depression: Anhaltende Traurigkeit, Verlust des Interesses an Aktivitäten, starke Müdigkeit, Schlafstörungen, Appetitlosigkeit",
    "Asthma: Atemnot, Husten, Keuchen, Engegefühl in der Brust, nächtliche Hustenanfälle",
    "Blasenentzündung: Schmerzen beim Wasserlassen, häufiger Harndrang, Blut im Urin, Bauchschmerzen, leichtes Fieber",
    "Migräne: Starke Kopfschmerzen, Übelkeit, Lichtempfindlichkeit, Geräuschempfindlichkeit, Sehstörungen",
    "Bindehautentzündung: Rote, juckende Augen, vermehrter Tränenfluss, Augenbrennen, Ausfluss, Schwellung der Augenlider",
    "Gelenkentzündung: Schmerzen im betroffenen Gelenk, Schwellung, Rötung, Wärme, eingeschränkte Beweglichkeit",
    "Gastritis: Magenschmerzen, Übelkeit, Erbrechen, Aufstoßen, Völlegefühl",
    "Nierensteine: Starke Rückenschmerzen, Blut im Urin, Übelkeit, häufiges Wasserlassen, Brennen beim Wasserlassen",
    "Heuschnupfen: Niesen, laufende Nase, juckende Augen, tränende Augen, verstopfte Nase",
    "Bronchitis: Husten mit Auswurf, Brustschmerzen, Müdigkeit, Kurzatmigkeit, leichtes Fieber",
    "Otitis media (Mittelohrentzündung): Ohrenschmerzen, Fieber, Hörverlust, Ohrfluss, Schlafstörungen"
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

app = Flask(__name__)
CORS(app)

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