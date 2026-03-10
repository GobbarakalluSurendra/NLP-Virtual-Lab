# experiments/pos_tagging/data.py

CORPORA = [
    {
        "id": "A",
        "name": "Corpus A",
        "sentence": "A group of students are reading books quietly in the library .",
        "tagged_sentence": [
            ("A", "DET"),
            ("group", "NOUN"),
            ("of", "ADP"),
            ("students", "NOUN"),
            ("are", "VERB"),
            ("reading", "VERB"),
            ("books", "NOUN"),
            ("quietly", "ADV"),
            ("in", "ADP"),
            ("the", "DET"),
            ("library", "NOUN"),
            (".", ".")
        ]
    },
    {
        "id": "B",
        "name": "Corpus B",
        "sentence": "The quick brown fox jumps over the lazy dog .",
        "tagged_sentence": [
            ("The", "DET"),
            ("quick", "ADJ"),
            ("brown", "ADJ"),
            ("fox", "NOUN"),
            ("jumps", "VERB"),
            ("over", "ADP"),
            ("the", "DET"),
            ("lazy", "ADJ"),
            ("dog", "NOUN"),
            (".", ".")
        ]
    }
]
