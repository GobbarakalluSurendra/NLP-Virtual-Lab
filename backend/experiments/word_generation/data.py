# word_generation/data.py

DATA = {

    # --------------------
    # Hindi Words
    # --------------------

    "लड़का": {
        "singular_direct": {"delete": "आ", "add": "ए"},
        "singular_oblique": {"delete": "आ", "add": "ए"},
        "plural_direct": {"delete": "आ", "add": "ओं"},
        "plural_oblique": {"delete": "आ", "add": "ओं"}
    },

    "बच्चा": {
        "singular_direct": {"delete": "आ", "add": "ए"},
        "singular_oblique": {"delete": "आ", "add": "ए"},
        "plural_direct": {"delete": "आ", "add": "ओं"},
        "plural_oblique": {"delete": "आ", "add": "ओं"}
    },

    # --------------------
    # English Words
    # --------------------

    "cat": {
        "singular_direct": {"delete": "None", "add": "None"},
        "singular_oblique": {"delete": "None", "add": "None"},
        "plural_direct": {"delete": "None", "add": "s"},
        "plural_oblique": {"delete": "None", "add": "s"}
    },

    "boy": {
        "singular_direct": {"delete": "None", "add": "None"},
        "singular_oblique": {"delete": "None", "add": "None"},
        "plural_direct": {"delete": "None", "add": "s"},
        "plural_oblique": {"delete": "None", "add": "s"}
    },

    "baby": {
        "singular_direct": {"delete": "y", "add": "ies"},
        "singular_oblique": {"delete": "y", "add": "ies"},
        "plural_direct": {"delete": "y", "add": "ies"},
        "plural_oblique": {"delete": "y", "add": "ies"}
    },

    "leaf": {
        "singular_direct": {"delete": "None", "add": "None"},
        "singular_oblique": {"delete": "None", "add": "None"},
        "plural_direct": {"delete": "f", "add": "ves"},
        "plural_oblique": {"delete": "f", "add": "ves"}
    }

}