from sentence_transformers import SentenceTransformer, util
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, Distance, VectorParams
from flask import Flask, request, jsonify

# Verbindung zu Qdrant herstellen
client = QdrantClient(url="http://localhost:6333")

# Überprüfen, ob die Sammlung bereits existiert
collection_name = "symptom_collection"
collections = client.get_collections().collections
collection_names = [collection.name for collection in collections]

if collection_name not in collection_names:
    # Erstellen einer neuen Sammlung in Qdrant, falls sie nicht existiert
    client.create_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(size=768, distance=Distance.COSINE),  # Die Größe sollte 768 sein, da dies die Dimension des Embeddings ist
    )

# Initialisieren des SentenceTransformers-Modells
model = SentenceTransformer('paraphrase-multilingual-mpnet-base-v2')

# Beispiel-Sätze und zugehörige Krankheiten
sentences = [
    "Grippe: Husten, Fieber, Muskelschmerzen",
    "COVID-19: Husten, Fieber, Verlust des Geruchssinns",
    "Migräne: Starke Kopfschmerzen, Übelkeit, Lichtempfindlichkeit",
    "Allergie: Niesen, Juckreiz, tränende Augen",
    "Depression: Anhaltende Traurigkeit, Verlust des Interesses, Müdigkeit"
]

# Embeddings berechnen
embeddings = model.encode(sentences)

# Speichern der Sätze und Embeddings in Qdrant
points = [
    PointStruct(id=i, vector=embedding.tolist(), payload={"sentence": sentence})
    for i, (sentence, embedding) in enumerate(zip(sentences, embeddings))
]
client.upsert(
    collection_name=collection_name,
    points=points
)

# Flask-App initialisieren
app = Flask(__name__)

@app.route("/find_similar_symptom/", methods=["POST"])
def find_similar_symptom():
    data = request.json
    if "sentence" not in data:
        return jsonify({"error": "No sentence provided"}), 400

    # Eingabesatz einbetten
    input_embedding = model.encode(data["sentence"]).tolist()

    # Ähnliche Sätze in Qdrant finden
    search_result = client.search(
        collection_name=collection_name,
        query_vector=input_embedding,
        limit=1  # Nur das ähnlichste Ergebnis zurückgeben
    )

    if search_result:
        # Das ähnlichste Ergebnis extrahieren
        most_similar_sentence = search_result[0].payload["sentence"]
        return jsonify({"similar_sentence": most_similar_sentence})
    else:
        return jsonify({"error": "No similar symptoms found"}), 404

if __name__ == "__main__":
    app.run(debug=True)