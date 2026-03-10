from .data import WORDS

def analyze_word(language, word, category, tense=None, number=None):

    language = language.lower()
    word = word.lower()

    try:

        if category == "noun":

            return {
                "root": word,
                "suffix": "" if number == "singular" else "s",
                "result": WORDS[language]["noun"][word][number]
            }

        if category == "verb":

            suffix_map = {
                "past": "ed",
                "progressive": "ing",
                "present": "",
                "future": "will"
            }

            return {
                "root": word,
                "suffix": suffix_map.get(tense, ""),
                "result": WORDS[language]["verb"][word][tense]
            }

        return {"error": "Invalid category"}

    except KeyError:
        return {"error": "Word not found"}