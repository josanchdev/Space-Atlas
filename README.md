# 🌌 Space Atlas

**An interactive 3D solar system explorer with AI-powered educational insights about Mars and planetary exploration.**

🎥 **[Watch Demo on YouTube](https://youtu.be/O9LFdsgih54)**

🏆 **NASA Space Apps Challenge 2025 — Madrid Winner, Global Finalist** (top teams from 11,500+ worldwide)

---

## Overview

**Space Atlas** is a full-stack web application that brings space exploration to life through an immersive 3D experience. Users can navigate the solar system, explore detailed planetary surfaces, discover Points of Interest (POIs) on Mars, and interact with AI-powered explanations of geological features. Built in 48 hours during NASA Space Apps Challenge 2025.

## Features

### Interactive 3D Solar System
- Real-time 3D rendering of planets using **Three.js** and **React Three Fiber**
- Smooth navigation and orbital mechanics
- Detailed planet textures and realistic lighting

### Deep Zoom Image Viewer
- High-resolution Mars surface imagery using **OpenSeadragon** (DZI format)
- Interactive POI markers with coordinate mapping
- Seamless pan and zoom for detailed exploration

### AI-Powered Educational Content
- **Azure OpenAI GPT-4o** with vision capabilities for feature analysis
- Automated explanations of Martian geological formations
- Context-aware responses grounded in planetary science

### Points of Interest (POI) System
- Curated collection of significant Martian landmarks
- Dynamic marker placement on high-resolution imagery
- Coordinate conversion system for precise location mapping
- Bookmarking functionality

### Space Missions Gallery
- Historical space mission information
- Mission-specific imagery and data
- Educational content about NASA's Mars exploration programs

## Architecture

```
Space Atlas
├── Frontend (React + Vite)
│   ├── 3D Solar System (Three.js)
│   ├── Image Viewer (OpenSeadragon)
│   ├── React Router Navigation
│   └── Azure Blob Storage Integration
│
└── Backend (Node.js + Express)
    ├── RESTful API
    ├── MongoDB Database
    ├── Azure OpenAI Service
    └── Azure Blob Storage
```

## Technology Stack

### Frontend
- **React 19** — UI library with hooks
- **Vite** — build tool
- **Three.js & React Three Fiber** — 3D graphics rendering
- **React Router** — client-side routing
- **OpenSeadragon** — deep zoom image viewing
- **Lucide React** — icon library

### Backend
- **Node.js & Express** — REST API server
- **MongoDB & Mongoose** — database and ODM
- **Azure OpenAI (GPT-4o)** — vision-enabled AI explanations
- **Azure Blob Storage** — cloud storage for images and assets
- **CORS** — cross-origin resource sharing
- **dotenv** — environment configuration

### Azure Services
- **Azure Blob Storage** — scalable object storage for high-resolution images, 3D models, and static assets
- **Azure OpenAI Service** — GPT-4o with vision for AI-powered educational content
- **Azure App Service** — backend deployment
- **Azure Static Web Apps** — frontend deployment

## Deployment

This project is deployed to Azure with a full CI/CD pipeline:

- **Backend:** Deployed to Azure App Service via GitHub Actions. Every push to `main` triggers a build and deploy workflow with secrets managed through Azure OIDC authentication.
- **Frontend:** Deployed to Azure Static Web Apps with automatic PR preview environments.

See `.github/workflows/` for the deployment pipelines.

## Installation (Local Development)

### Prerequisites
- Node.js (v18 or higher)
- MongoDB instance
- Azure account with Blob Storage and OpenAI Service configured

### 1. Clone the Repository
​```bash
git clone https://github.com/josanchdev/Space-Atlas.git
cd Space-Atlas
​```

### 2. Backend Setup
​```bash
cd backend
npm install
​```

Create a `.env` file in the `backend` directory:
​```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
AZURE_STORAGE_CONNECTION_STRING=your_azure_storage_connection_string
AZURE_CONTAINER_NAME=your_container_name
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
AZURE_OPENAI_KEY=your_azure_openai_api_key
AZURE_OPENAI_API_VERSION=2024-11-20
AZURE_OPENAI_DEPLOYMENT=gpt-4o
​```

Start the backend server:
​```bash
npm run dev
​```

### 3. Frontend Setup
​```bash
cd ../frontend
npm install
​```

Create a `.env` file in the `frontend` directory:
​```env
VITE_API_URL=http://localhost:3000/api
​```

Start the development server:
​```bash
npm run dev
​```

The application will be available at `http://localhost:5173`

## Project Structure

```
Space-Atlas/
│
├── backend/
│   ├── src/
│   │   ├── config/              # Azure & MongoDB connections
│   │   ├── controllers/         # Request handlers
│   │   ├── models/              # MongoDB schemas
│   │   ├── routes/              # API endpoints
│   │   ├── services/            # Business logic (AI, storage)
│   │   └── index.js             # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/          # React components
    │   ├── pages/               # Route pages
    │   ├── services/            # API integration
    │   ├── utils/               # Helper functions
    │   └── App.jsx
    └── package.json
```

## API Endpoints

### POI Endpoints

```
GET    /api/pois              # Get all Points of Interest
GET    /api/pois/:id          # Get POI by ID
POST   /api/pois              # Create new POI
PUT    /api/pois/:id          # Update POI
DELETE /api/pois/:id          # Delete POI
```

### AI Explanation Endpoint

```
POST   /api/explain           # Generate AI explanation for a POI
Body: { title, imageUrl, description }
```

### Image Endpoint

```
GET    /api/dzi               # Get DZI image metadata
```

## Authors

Built by a team of 5 during NASA Space Apps Challenge 2025:

- **Alejandro Arias** — [GitHub](https://github.com/Alexx019)
- **Jorge Sánchez** — [GitHub](https://github.com/josanchdev)
- **Joaquín Fuentes** — [GitHub](https://github.com/Jjoaquin04)
- **Fernando Silvestre** — [GitHub](https://github.com/f-silvestre)
- **Sergio Barrios** — [GitHub](https://github.com/CodeInIA)

## Acknowledgments

- NASA for providing public domain Mars imagery
- Microsoft Azure for cloud infrastructure and AI services
- The open-source community for amazing tools and libraries

---

<div align="center">

**Built with ❤️ and ☕ in 48 hours**

</div>
