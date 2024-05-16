from sentence_transformers import SentenceTransformer, util
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams


client = QdrantClient(url="http://localhost:6333")
client.create_collection(
    collection_name="test_collection",
    vectors_config=VectorParams(size=4, distance=Distance.DOT),
)


model = SentenceTransformer('paraphrase-multilingual-mpnet-base-v2')

senteces = [
    "Ich finde Fußball toll",
    "Ich mag Füße",
    "Heute werde ich mit Freunden Ball spielen",
    "I like playing soccer"
]


embeddings = model.encode(senteces)
sentence = model.encode("Hallo ich spiele gerne Fußball")


for sentences, embedding in zip(senteces, embeddings):
    current_embedding = model.encode(sentences)
    print("Sentence Similarity:", util.dot_score(sentence, current_embedding))