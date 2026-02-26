from flask import Flask
from flask_cors import CORS
from experiments.morphology.routes import morphology_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(morphology_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True, port=5000)