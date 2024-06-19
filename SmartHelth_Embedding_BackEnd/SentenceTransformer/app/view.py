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
    "Grippe: Husten, Fieber, Muskelschmerzen, Kopfschmerzen, Müdigkeit",
    "COVID-19: Husten, Fieber, Verlust des Geruchssinns, Atemnot, Müdigkeit",
    "Migräne: Starke Kopfschmerzen, Übelkeit, Lichtempfindlichkeit, Geräuschempfindlichkeit, Sehstörungen",
    "Allergie: Niesen, Juckreiz, tränende Augen, laufende Nase, Hautausschlag",
    "Depression: Anhaltende Traurigkeit, Verlust des Interesses, Müdigkeit, Schlafstörungen, Appetitlosigkeit",
    "Asthma: Atemnot, Husten, Keuchen, Engegefühl in der Brust, nächtliche Hustenanfälle",
    "Diabetes: Häufiges Wasserlassen, extremer Durst, unerklärlicher Gewichtsverlust, Müdigkeit, verschwommenes Sehen",
    "Bluthochdruck: Kopfschmerzen, Schwindel, Nasenbluten, Kurzatmigkeit, Brustschmerzen",
    "Herzinfarkt: Brustschmerzen, Kurzatmigkeit, Schmerzen im Arm oder Kiefer, Übelkeit, Schwitzen",
    "Schlaganfall: Plötzliche Schwäche, Verwirrtheit, Sehprobleme, Schwindel, plötzliche Kopfschmerzen",
    "Gastritis: Magenschmerzen, Übelkeit, Erbrechen, Aufstoßen, Völlegefühl",
    "Nierensteine: Starke Rückenschmerzen, Blut im Urin, Übelkeit, häufiges Wasserlassen, Brennen beim Wasserlassen",
    "Pneumonie: Husten mit Auswurf, Fieber, Schüttelfrost, Atemnot, Brustschmerzen",
    "Arthritis: Gelenkschmerzen, Steifheit, Schwellung, Rötung, eingeschränkte Beweglichkeit",
    "Zöliakie: Durchfall, Bauchschmerzen, Blähungen, Gewichtsverlust, Müdigkeit",
    "Multiple Sklerose: Muskelschwäche, Sehstörungen, Taubheit oder Kribbeln, Koordinationsprobleme, Müdigkeit",
    "Epilepsie: Krampfanfälle, Verwirrung, Bewusstlosigkeit, Angst, abnormales Verhalten",
    "Morbus Crohn: Bauchschmerzen, Durchfall, Gewichtsverlust, Fieber, Müdigkeit",
    "Gicht: Starke Gelenkschmerzen, Rötung, Schwellung, Hitzegefühl, Bewegungseinschränkung",
    "Tuberkulose: Anhaltender Husten, Bluthusten, Gewichtsverlust, Fieber, Nachtschweiß",
    "Parkinson: Zittern, langsame Bewegungen, Muskelsteifheit, Gleichgewichtsprobleme, Sprachveränderungen",
    "Schilddrüsenunterfunktion: Müdigkeit, Gewichtszunahme, Kälteempfindlichkeit, Haarausfall, Verstopfung",
    "Schilddrüsenüberfunktion: Gewichtsverlust, Nervosität, Schwitzen, Herzklopfen, Schlaflosigkeit",
    "AIDS: Fieber, Nachtschweiß, Gewichtsverlust, geschwollene Lymphknoten, chronische Müdigkeit",
    "Lungenembolie: Plötzliche Atemnot, Brustschmerzen, schneller Herzschlag, Husten mit Blut, Schwindel",
    "Masern: Fieber, Hautausschlag, Husten, laufende Nase, rote, tränende Augen",
    "Mumps: Geschwollene Speicheldrüsen, Fieber, Kopfschmerzen, Muskelschmerzen, Müdigkeit",
    "Windpocken: Juckender Hautausschlag, Fieber, Müdigkeit, Kopfschmerzen, Appetitlosigkeit",
    "Röteln: Leichtes Fieber, Hautausschlag, geschwollene Lymphknoten, Gelenkschmerzen, rote Augen",
    "Keuchhusten: Starker Husten, Keuchen, Erbrechen nach Hustenanfällen, Müdigkeit, leichter Husten",
    "Bronchitis: Husten mit Auswurf, Brustschmerzen, Müdigkeit, Kurzatmigkeit, leichtes Fieber",
    "Sinusitis: Gesichtsschmerzen, verstopfte Nase, Kopfschmerzen, gelber oder grüner Nasenausfluss, Husten",
    "Otitis media (Mittelohrentzündung): Ohrenschmerzen, Fieber, Hörverlust, Ohrfluss, Schlafstörungen",
    "Mandelentzündung (Tonsillitis): Halsschmerzen, Schluckbeschwerden, Fieber, geschwollene Mandeln, Kopfschmerzen",
    "Hepatitis A: Müdigkeit, Bauchschmerzen, Übelkeit, Gelbsucht, dunkler Urin",
    "Hepatitis B: Müdigkeit, Appetitlosigkeit, Bauchschmerzen, Gelbsucht, Gelenkschmerzen",
    "Hepatitis C: Müdigkeit, Appetitlosigkeit, Bauchschmerzen, Gelbsucht, dunkler Urin",
    "Magenschleimhautentzündung (Gastritis): Magenschmerzen, Übelkeit, Erbrechen, Völlegefühl, Sodbrennen",
    "Magengeschwür: Magenschmerzen, Sodbrennen, Übelkeit, Appetitlosigkeit, Blähungen",
    "Gallensteine: Starke Bauchschmerzen, Übelkeit, Erbrechen, Fieber, Gelbsucht",
    "Reizdarmsyndrom (IBS): Bauchschmerzen, Blähungen, Durchfall, Verstopfung, Schleim im Stuhl",
    "Zystitis (Blasenentzündung): Schmerzen beim Wasserlassen, häufiges Wasserlassen, Blut im Urin, Bauchschmerzen, Fieber",
    "Prostatitis: Schmerzen im Unterleib, Schmerzen beim Wasserlassen, häufiger Harndrang, Fieber, Schmerzen im unteren Rücken",
    "Anämie: Müdigkeit, Blässe, Kurzatmigkeit, Schwindel, Herzklopfen",
    "Hypoglykämie: Zittern, Schwitzen, Verwirrung, Herzklopfen, Hunger",
    "Hyperglykämie: Durst, häufiges Wasserlassen, Müdigkeit, verschwommenes Sehen, trockener Mund",
    "Hypothyreose: Müdigkeit, Gewichtszunahme, Kälteempfindlichkeit, Haarausfall, Verstopfung",
    "Hyperthyreose: Gewichtsverlust, Nervosität, Schwitzen, Herzklopfen, Schlaflosigkeit",
    "Laktoseintoleranz: Bauchschmerzen, Blähungen, Durchfall, Übelkeit, Blähbauch",
    "Zöliakie: Durchfall, Bauchschmerzen, Blähungen, Gewichtsverlust, Müdigkeit"
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
        limit=5
    )

    if search_result:
        similar_sentences = []
        for result in search_result:
            most_similar_sentence = result.payload["sentence"]
            colon_index = most_similar_sentence.find(':')
            if colon_index != -1:
                most_similar_sentence = most_similar_sentence[:colon_index]
            similar_sentences.append(most_similar_sentence)
        return jsonify({"Sicknesses": similar_sentences})
    else:
        return jsonify({"error": "No similar symptoms found"}), 404

if __name__ == "__main__":
    app.run(debug=True)