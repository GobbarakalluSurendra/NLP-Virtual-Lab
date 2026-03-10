from .data import WORD_DATA

def get_words():
    return [item["word"] for item in WORD_DATA]

def get_features(word):

    for item in WORD_DATA:
        if item["word"] == word:
            return item

    return None