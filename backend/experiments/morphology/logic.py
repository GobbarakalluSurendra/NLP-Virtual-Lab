# morphology - logic.py
from .data import WORDS

def analyze_word(language, word, category, tense=None, number=None):
    try:
        if category == "noun":
            return WORDS[language]["noun"][word][number]

        if category == "verb":
            return WORDS[language]["verb"][word][tense]

        return "Invalid category"

    except KeyError:
        return "Word not found in dataset"