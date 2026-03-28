# NLP Virtual Lab

🌐 Live Demo:
https://nlp-virtual-lab1.vercel.app/

## Features
- **Real-time Processing**: Fast text analysis using state-of-the-art NLP models.
- **Interactive UI**: User-friendly dashboard for experimenting with tokenization, Named Entity Recognition (NER), and sentiment analysis.
- **Scalable Architecture**: Decoupled FastAPI backend and modern frontend framework.

## Project Structure
```text
nlp-virtual-lab/
├── backend/                # Python FastAPI Backend
│   ├── main.py             # Application entry point
│   ├── requirements.txt    # Python dependencies
│   └── app/                # Core logic, models, and routes
├── frontend/               # Frontend Project (React/Next.js)
│   ├── src/                # Components and assets
│   ├── package.json        # Node dependencies
│   └── tailwind.config.js  # Styling configuration
└── README.md
```

## Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## API Documentation
Once the backend is running, you can access the interactive API docs at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## License
Distributed under the MIT License. See `LICENSE` for more information.
```
