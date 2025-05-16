from retrival.retriver import retrieve_passages
from generation.generator import generate_answer

def test_rag_pipeline():
    question = input()
    passages = retrieve_passages(question)
    answer = generate_answer(question, passages)
    assert answer is not None
    print("Test passed.")

if __name__ == "__main__":
    test_rag_pipeline()
