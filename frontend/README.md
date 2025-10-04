Project README

Run the frontend (Vite) and a minimal backend to serve uploaded DZI files.

Backend (simple Express server)

1. Open a terminal in ./backend
2. Install dependencies:

	npm install

3. Start the backend:

	npm start

The backend will run on http://localhost:4000 by default and expose:
- GET /images/:planet -> returns { images: [ { file, title } ] }
- GET /images/:planet/:file -> serves the .dzi or related static file from backend/uploads/:planet
- POST /upload -> multipart upload (field name 'file', body field 'planet')

Frontend

1. From project root install dependencies:

	npm install

2. Ensure `.env.local` has VITE_API_BASE set to the backend (default provided):

	VITE_API_BASE=http://localhost:4000

3. Start vite:

	npm run dev

Notes
- The frontend will try the backend API first to list images for a planet, and fall back to local `src/assets/images/<planet>/images.json` when the backend is not available.
- Uploaded DZI files should be placed under backend/uploads/<planet>/ for immediate availability, or use the /upload endpoint.
