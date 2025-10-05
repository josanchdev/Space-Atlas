# 🌌 Space Atlas

**An interactive 3D solar system explorer with AI-powered educational insights about Mars and planetary exploration.**

🎥 **[Watch Demo on YouTube](https://youtu.be/O9LFdsgih54)**

---

## 📖 Overview

**Space Atlas** is a full-stack web application that brings space exploration to life through an immersive 3D experience. Users can navigate through our solar system, explore detailed planetary surfaces, discover Points of Interest (POIs) on Mars, and interact with AI-powered explanations of geological features. Built with modern technologies and powered by Microsoft Azure services, this project demonstrates the intersection of space science, 3D visualization, and artificial intelligence.

## ✨ Features

### 🪐 Interactive 3D Solar System
- Real-time 3D rendering of planets using **Three.js** and **React Three Fiber**
- Smooth navigation and orbital mechanics
- Detailed planet textures and realistic lighting

### 🔍 Deep Zoom Image Viewer
- High-resolution Mars surface imagery using **OpenSeadragon** (DZI format)
- Interactive POI markers with coordinate mapping
- Seamless pan and zoom capabilities for detailed exploration

### 🤖 AI-Powered Educational Content
- **Azure OpenAI GPT-4 Vision** integration for intelligent feature analysis
- Automated explanations of Martian geological formations
- Context-aware responses about planetary science

### 🗺️ Points of Interest (POI) System
- Curated collection of significant Martian landmarks
- Dynamic marker placement on high-resolution imagery
- Coordinate conversion system for precise location mapping
- Bookmarking functionality for favorite locations

### 📚 Space Missions Gallery
- Historical space mission information
- Mission-specific imagery and data
- Educational content about NASA's Mars exploration programs

## 🏗️ Architecture

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

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool
- **Three.js & React Three Fiber** - 3D graphics rendering
- **React Router** - Client-side routing
- **OpenSeadragon** - Deep zoom image viewing
- **Lucide React** - Icon library

### Backend
- **Node.js & Express** - REST API server
- **MongoDB & Mongoose** - Database and ODM
- **Azure OpenAI** - GPT-4 Vision API integration
- **Azure Blob Storage** - Cloud storage for images and assets
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

### Azure Services
- **Azure Blob Storage** - Scalable object storage for high-resolution images, 3D models, and static assets
- **Azure OpenAI Service** - GPT-4 Vision API for AI-powered educational content generation
- **Azure App Service** - (Recommended) Deployment platform for both frontend and backend
- **Azure Cosmos DB** - (Alternative) Could replace MongoDB for globally distributed database

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB instance
- Azure account with the following services configured:
  - Azure Blob Storage
  - Azure OpenAI Service

### 1. Clone the Repository
```bash
git clone https://github.com/josanchdev/Space-Atlas.git
cd Space-Atlas
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3000

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=your_azure_storage_connection_string
AZURE_CONTAINER_NAME=your_container_name

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
AZURE_OPENAI_KEY=your_azure_openai_api_key
AZURE_OPENAI_API_VERSION=2024-02-15-preview
AZURE_OPENAI_DEPLOYMENT=your_deployment_name
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🚀 Deployment on Azure

### Backend Deployment (Azure App Service)

1. **Create an App Service:**
```bash
az webapp create --resource-group <resource-group> \
  --plan <app-service-plan> \
  --name <backend-app-name> \
  --runtime "NODE:18-lts"
```

2. **Configure Environment Variables:**
   - Navigate to your App Service in Azure Portal
   - Go to Configuration → Application Settings
   - Add all environment variables from your `.env` file

3. **Deploy from GitHub:**
   - Enable GitHub Actions deployment
   - The app will auto-deploy on push to main branch

### Frontend Deployment (Azure Static Web Apps)

1. **Build the Frontend:**
```bash
cd frontend
npm run build
```

2. **Deploy to Azure Static Web Apps:**
```bash
az staticwebapp create \
  --name <frontend-app-name> \
  --resource-group <resource-group> \
  --source https://github.com/josanchdev/Space-Atlas \
  --location "eastus2" \
  --branch main \
  --app-location "/frontend" \
  --output-location "dist"
```

### Azure Blob Storage Setup

1. **Create a Storage Account:**
```bash
az storage account create \
  --name <storage-account-name> \
  --resource-group <resource-group> \
  --location eastus \
  --sku Standard_LRS
```

2. **Create a Container:**
```bash
az storage container create \
  --name <container-name> \
  --account-name <storage-account-name> \
  --public-access blob
```

3. **Upload Assets:**
   - Upload your images, DZI files, and 3D models
   - Configure CORS for browser access

## 📂 Project Structure

```
Space-Atlas/
│
├── backend/
│   ├── src/
│   │   ├── config/              # Azure & MongoDB connections
│   │   │   ├── azure-connection.js
│   │   │   ├── azure-openai-connection.js
│   │   │   └── mongo.js
│   │   ├── controllers/         # Request handlers
│   │   │   └── pois.js
│   │   ├── models/              # MongoDB schemas
│   │   │   └── pois.js
│   │   ├── routes/              # API endpoints
│   │   │   ├── index.js
│   │   │   ├── pois.js
│   │   │   ├── dzi.js
│   │   │   └── explain.js
│   │   ├── services/            # Business logic
│   │   │   ├── ai-service.js    # Azure OpenAI integration
│   │   │   └── storage-service.js # Azure Blob Storage
│   │   └── index.js             # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/          # React components
    │   │   ├── DziViewer.jsx    # Image viewer
    │   │   ├── SolarSystem.jsx  # 3D solar system
    │   │   ├── PoiMarker.jsx    # POI markers
    │   │   └── ...
    │   ├── pages/               # Route pages
    │   │   ├── LandingPage.jsx
    │   │   ├── PlanetPage.jsx
    │   │   ├── ImageViewerPage.jsx
    │   │   └── ...
    │   ├── services/            # API integration
    │   │   └── poisService.js
    │   ├── utils/               # Helper functions
    │   │   └── coordinateConverter.js
    │   └── App.jsx
    └── package.json
```

## 🔌 API Endpoints

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

## 👥 Authors

This project was developed by a team of 5 developers:

- **[Alejandro Arias]** - [GitHub Profile](https://github.com/Alexx019)
- **[Jorge Sánchez]** - [GitHub Profile](https://github.com/josanchdev)
- **[Joaquín Fuentes]** - [GitHub Profile](https://github.com/Jjoaquin04)
- **[Fernando Silvestre]** - [GitHub Profile](https://github.com/f-silvestre)
- **[Sergio Barrios]** - [GitHub Profile](https://github.com/CodeInIA)

## 🙏 Acknowledgments

- NASA for providing public domain Mars imagery
- Microsoft Azure for cloud infrastructure and AI services
- The open-source community for amazing tools and libraries

---

<div align="center">

**Built with ❤️ and ☕**

</div>
