from sentence_transformers import SentenceTransformer, util
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, Distance, VectorParams
from flask import Flask, request, jsonify

client = QdrantClient(url="http://localhost:6333")

collection_name = "symptom_collection"
collections = client.get_collections().collections
collection_names = [collection.name for collection in collections]

if collection_name not in collection_names:
    client.create_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(size=768, distance=Distance.COSINE),
    )

model = SentenceTransformer('paraphrase-multilingual-mpnet-base-v2')

sentences = [
    "Grippe: Husten, Fieber, Muskelschmerzen",
    "COVID-19: Husten, Fieber, Verlust des Geruchssinns",
    "Migräne: Starke Kopfschmerzen, Übelkeit, Lichtempfindlichkeit",
    "Allergie: Niesen, Juckreiz, tränende Augen",
    "Depression: Anhaltende Traurigkeit, Verlust des Interesses, Müdigkeit"
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
        limit=1
    )

    if search_result:
        most_similar_sentence = search_result[0].payload["sentence"]
        colon_index = most_similar_sentence.find(':')
        if colon_index != -1:
            most_similar_sentence = most_similar_sentence[:colon_index]
        return jsonify({"Sickness": most_similar_sentence})
    else:
        return jsonify({"error": "No similar symptoms found"}), 404

if __name__ == "__main__":
    app.run(debug=True)