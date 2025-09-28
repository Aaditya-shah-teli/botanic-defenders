# 🌱 Botanic Defenders

AI-powered agricultural insights and plant disease detection system.

## Features

### 🚀 Crop Yield Dashboard
- **Real-time Weather Integration**: Get current weather data for any location
- **Smart Crop Recommendations**: AI-powered suggestions based on temperature and climate
- **Agricultural Tips**: Expert advice for optimal crop growing conditions
- **Location-based Insights**: Tailored recommendations for your specific area

### 🔬 Plant Health Detection
- **AI-Powered Disease Identification**: Advanced machine learning models trained on thousands of plant disease images
- **Instant Analysis**: Get results in seconds with detailed confidence scores
- **Treatment Recommendations**: Expert advice on organic and chemical treatments
- **Fertilizer Suggestions**: Best fertilizers for plant recovery
- **Mobile-Friendly**: Works perfectly on all devices

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **shadcn/ui** - Modern UI components

### Backend
- **FastAPI** - High-performance Python web framework
- **Transformers** - Hugging Face ML models
- **PyTorch** - Deep learning framework
- **Google Gemini AI** - Advanced AI for treatment recommendations
- **PIL (Pillow)** - Image processing
- **OpenWeatherMap API** - Weather data integration

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the backend server:
```bash
python main.py
```

Or use the startup script:
```bash
chmod +x run.sh
./run.sh
```

The backend API will be available at `http://localhost:8002`

### Environment Variables

Create a `.env.local` file in the frontend directory:
```env
BACKEND_URL=http://localhost:8002
```

## API Endpoints

### Backend API (Port 8002)

- `GET /` - API status
- `GET /health` - Health check
- `POST /predict` - Plant disease prediction

### Frontend API (Port 3000)

- `POST /api/plant-health/predict` - Proxy to backend prediction API

## Usage

### Crop Yield Dashboard
1. Navigate to the dashboard
2. Enter your city or location
3. Get real-time weather data and crop recommendations
4. View agricultural tips based on current conditions

### Plant Health Detection
1. Go to the Plant Health page
2. Upload an image of your plant
3. Get instant AI-powered disease analysis
4. Receive treatment and fertilizer recommendations

## Project Structure

```
Botanic-defenders/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages
│   │   ├── dashboard/       # Main dashboard with crop yield
│   │   ├── plant-health/    # Plant disease detection page
│   │   └── api/            # API routes
│   ├── components/         # React components
│   │   ├── crops/          # Crop-related components
│   │   └── ui/             # UI components
│   └── lib/                # Utilities and configurations
├── backend/                # FastAPI backend application
│   ├── main.py            # Main FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── test_gemini.py     # Gemini API testing
└── README.md              # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub.

---

**Botanic Defenders** - Empowering farmers and gardeners with AI-driven agricultural insights! 🌱🤖
