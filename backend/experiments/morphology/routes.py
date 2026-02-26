from flask import Blueprint, request, jsonify
from .logic import analyze_word

morphology_bp = Blueprint("morphology", __name__)

@morphology_bp.route("/morphology", methods=["POST"])
def morphology():
    data = request.json

    language = data.get("language")
    word = data.get("word")
    category = data.get("category")
    tense = data.get("tense")
    number = data.get("number")

    result = analyze_word(language, word, category, tense, number)

    return jsonify({
        "message": "Processed Successfully",
        "correct": result
    })