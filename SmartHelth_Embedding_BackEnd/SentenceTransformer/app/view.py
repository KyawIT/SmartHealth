from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, Distance, VectorParams
from flask import Flask, request, jsonify

app = Flask(__name__)
client = QdrantClient(url="http://localhost:6333")
collection_name = "symptom_collection"
model = SentenceTransformer('paraphrase-multilingual-mpnet-base-v2')

def initialize_collection():
    # Überprüfen, ob die Sammlung bereits existiert
    collections = client.get_collections().collections
    collection_names = [collection.name for collection in collections]

    if collection_name in collection_names:
        # Falls die Sammlung bereits existiert, lösche alle Daten darin
        client.delete_collection(collection_name=collection_name)

    # Neue Sammlung erstellen
    client.create_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(size=768, distance=Distance.COSINE),
    )

    # Daten für die Sammlung
    sentences = [
        "Erkältung: Schnupfen, Halsschmerzen, Husten, leichtes Fieber, Kopfschmerzen",
        "Grippe: Husten, hohes Fieber, Muskelschmerzen, Kopfschmerzen, starke Müdigkeit",
        "Magen-Darm-Infekt: Durchfall, Bauchschmerzen, Übelkeit, Erbrechen, leichtes Fieber",
        "Allergie: Niesen, Juckreiz, tränende Augen, laufende Nase, Hautausschlag",
        "Depression: Anhaltende Traurigkeit, Verlust des Interesses an Aktivitäten, starke Müdigkeit, Schlafstörungen, Appetitlosigkeit",
        "Asthma: Atemnot, Husten, Keuchen, Engegefühl in der Brust, nächtliche Hustenanfälle",
        "Blasenentzündung: Schmerzen beim Wasserlassen, häufiger Harndrang, Blut im Urin, Bauchschmerzen, leichtes Fieber",
        "Migräne: Starke Kopfschmerzen, Übelkeit, Lichtempfindlichkeit, Geräuschempfindlichkeit, Sehstörungen",
        "Bindehautentzündung: Rote, juckende Augen, vermehrter Tränenfluss, Augenbrennen, Ausfluss, Schwellung der Augenlider",
        "Gelenkentzündung: Schmerzen im betroffenen Gelenk, Schwellung, Rötung, Wärme, eingeschränkte Beweglichkeit",
        "Gastritis: Magenschmerzen, Übelkeit, Erbrechen, Aufstoßen, Völlegefühl",
        "Nierensteine: Starke Rückenschmerzen, Blut im Urin, Übelkeit, häufiges Wasserlassen, Brennen beim Wasserlassen",
        "Arthritis: Gelenkschmerzen, Steifheit, Schwellung, Rötung, eingeschränkte Beweglichkeit",
        "Heuschnupfen: Niesen, laufende Nase, juckende Augen, tränende Augen, verstopfte Nase",
        "Bronchitis: Husten mit Auswurf, Brustschmerzen, Müdigkeit, Kurzatmigkeit, leichtes Fieber",
        "Otitis media (Mittelohrentzündung): Ohrenschmerzen, Fieber, Hörverlust, Ohrfluss, Schlafstörungen"
    ]

    # Embeddings für die Daten berechnen
    embeddings = model.encode(sentences)

    # Punkte für die Sammlung vorbereiten
    points = [
        PointStruct(id=i, vector=embedding.tolist(), payload={"sentence": sentence})
        for i, (sentence, embedding) in enumerate(zip(sentences, embeddings))
    ]

    # Daten in die Sammlung einfügen
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
        limit=5  # Limit für die Rückgabe von bis zu 5 ähnlichen Krankheiten
    )

    threshold = 0.65  # Cosinus-Similarity Schwellenwert

    similar_sicknesses = set()  # Menge zur Vermeidung von Duplikaten
    max_similarity = -1.0  # Variable zur Speicherung der höchsten Cosinus-Ähnlichkeit
    found_above_threshold = False

    for result in search_result:
        if result.score >= threshold:
            most_similar_sentence = result.payload["sentence"]
            colon_index = most_similar_sentence.find(':')
            if colon_index != -1:
                most_similar_sickness = most_similar_sentence[:colon_index].strip()
                if "(" in most_similar_sickness:  # Überprüfung auf zusätzliche Beschreibung
                    main_sickness = most_similar_sickness.split("(")[0].strip()
                    similar_sicknesses.add(main_sickness)
                else:
                    similar_sicknesses.add(most_similar_sickness)
                found_above_threshold = True  # Setze die Flagge auf True, wenn mindestens eine über dem Schwellenwert liegt

                # Aktualisiere die höchste Cosinus-Ähnlichkeit
                if result.score > max_similarity:
                    max_similarity = result.score
        else:
            # Da die Ergebnisse nach Ähnlichkeit sortiert sind, können wir anhalten, sobald ein Ergebnis unterhalb des Schwellenwerts liegt
            break

    if similar_sicknesses:
        # Wenn mindestens ein ähnliches Symptom über dem Schwellenwert liegt, geben wir diese zurück
        return jsonify({"Sicknesses": list(similar_sicknesses)})
    else:
        # Ansonsten geben wir das Symptom mit der höchsten Cosinus-Ähnlichkeit zurück
        if max_similarity != -1.0:  # Überprüfen, ob eine höchste Cosinus-Ähnlichkeit gefunden wurde
            return jsonify({"Sicknesses": [most_similar_sentence]})
        else:
            # Wenn keine ähnlichen Symptome gefunden wurden und auch keine höchste Ähnlichkeit vorhanden ist
            return jsonify({"error": "No similar symptoms found"}), 404

if __name__ == "__main__":
    app.run(debug=True)