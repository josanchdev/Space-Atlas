# Integración Backend - Frontend: Sistema de Imágenes

## Resumen

Se ha implementado la integración completa entre el frontend y el backend para cargar imágenes DZI desde la base de datos MongoDB a través del endpoint `/api/pois`.

---

## Endpoints Utilizados

### 1. **GET /api/pois**
- **Descripción**: Obtiene todos los POIs (Points of Interest) de la base de datos
- **Respuesta**: Array de objetos POI con la siguiente estructura:

```json
[
  {
    "id": "uuid-string",
    "_id": "mongodb-id",
    "lat": 123.456,
    "lon": -78.910,
    "title": "Olympus Mons",
    "description": "Largest volcano in the solar system",
    "path": "mars/12_34",
    "planet": "mars"  // opcional
  }
]
```

---

## Transformación de Datos

### Archivo: `src/utils/imageDataHelpers.js`

Este archivo contiene funciones helper para transformar datos del backend:

#### **transformPoisToImages(pois)**
Transforma POIs del backend al formato esperado por las páginas:

```javascript
// Entrada: POI del backend
{
  id: "abc-123",
  lat: 123.456,
  lon: -78.910,
  title: "Olympus Mons",
  description: "...",
  path: "mars/12_34"
}

// Salida: Formato imagen
{
  id: "abc-123",
  filename: "mars/12_34.dzi",
  title: "Olympus Mons",
  body: "Mars",
  description: "...",
  planet: "mars",
  lat: 123.456,
  lon: -78.910,
  path: "mars/12_34",
  thumbnail: null
}
```

#### **filterImagesByPlanet(images, planetName)**
Filtra imágenes por planeta específico.

#### **sortImagesByDate(images)**
Ordena imágenes por fecha (más reciente primero).

#### **getRecentImages(images, count)**
Obtiene las N imágenes más recientes.

#### **PLACEHOLDER_IMAGES**
Datos de placeholder para cuando no hay datos del backend:
- `PLACEHOLDER_IMAGES.explore` - Para página Explore
- `PLACEHOLDER_IMAGES.news` - Para página News
- `PLACEHOLDER_IMAGES.landing` - Para Landing Page

---

## Páginas Actualizadas

### 1. **ExplorePage** (`/explore`)

```javascript
// Flujo de datos:
1. Fetch /api/pois
2. Transform con transformPoisToImages()
3. Si vacío → usar PLACEHOLDER_IMAGES.explore
4. Mostrar en grid con búsqueda
```

**Características:**
- ✅ Carga desde `/api/pois`
- ✅ Loading state
- ✅ Fallback a placeholders
- ✅ Búsqueda en tiempo real
- ✅ Click navega a `/image/:image_name`

---

### 2. **NewsPage** (`/news`)

```javascript
// Flujo de datos:
1. Fetch /api/pois
2. Transform con transformPoisToImages()
3. Sort con sortImagesByDate() (más recientes primero)
4. Si vacío → usar PLACEHOLDER_IMAGES.news
5. Mostrar en grid
```

**Características:**
- ✅ Carga desde `/api/pois`
- ✅ Ordenadas por fecha
- ✅ Loading state
- ✅ Fallback a placeholders
- ✅ Click navega a `/image/:image_name`

---

### 3. **LandingPage** (`/`)

```javascript
// Flujo de datos:
1. Fetch /api/pois
2. Transform con transformPoisToImages()
3. Get 3 más recientes con getRecentImages(images, 3)
4. Si vacío → usar PLACEHOLDER_IMAGES.landing
5. Mostrar en sección "Recent Scientific Discoveries"
```

**Características:**
- ✅ Carga desde `/api/pois`
- ✅ Muestra solo las 3 más recientes
- ✅ Loading state
- ✅ Fallback a placeholders con imágenes de ejemplo
- ✅ Click navega a `/image/:image_name`

---

### 4. **PlanetPage** (`/:planet`)

```javascript
// Flujo de datos (via loadImages helper):
1. Fetch /api/pois
2. Transform con transformPoisToImages()
3. Filter con filterImagesByPlanet(images, planetName)
4. Si vacío → try /api/images/:planet (legacy)
5. Si vacío → try /src/assets/images/:planet/images.json (local)
6. Si todo falla → mostrar array vacío
```

**Archivo modificado:** `src/utils/loadImages.js`

**Características:**
- ✅ Prioriza endpoint `/api/pois`
- ✅ Filtra por planeta automáticamente
- ✅ Múltiples fallbacks
- ✅ Manejo de errores robusto

---

## Variables de Entorno

### Frontend (.env)

```env
VITE_API_BASE=http://localhost:3000/api
```

Si no está definida, usa por defecto:
- `http://localhost:3000/api` (desarrollo)

---

## Flujo Completo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ LandingPage  │  │  ExplorePage │  │   NewsPage   │      │
│  │              │  │              │  │              │      │
│  │ Get 3 recent │  │  All images  │  │ Latest imgs  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │               │
│         └─────────────────┴──────────────────┘               │
│                           │                                  │
│                           ▼                                  │
│              ┌────────────────────────┐                      │
│              │   GET /api/pois        │                      │
│              └────────────┬───────────┘                      │
│                           │                                  │
│                           ▼                                  │
│              ┌────────────────────────┐                      │
│              │ transformPoisToImages  │                      │
│              └────────────┬───────────┘                      │
│                           │                                  │
│         ┌─────────────────┼─────────────────┐               │
│         │                 │                 │               │
│         ▼                 ▼                 ▼               │
│  filterByPlanet   sortByDate      getRecent(3)              │
│  (PlanetPage)     (NewsPage)      (LandingPage)             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
│                                                              │
│              ┌────────────────────────┐                      │
│              │  GET /api/pois         │                      │
│              │  (routes/pois.js)      │                      │
│              └────────────┬───────────┘                      │
│                           │                                  │
│                           ▼                                  │
│              ┌────────────────────────┐                      │
│              │  getItems controller   │                      │
│              │  (controllers/pois.js) │                      │
│              └────────────┬───────────┘                      │
│                           │                                  │
│                           ▼                                  │
│              ┌────────────────────────┐                      │
│              │   MongoDB Query        │                      │
│              │   PoiModel.find({})    │                      │
│              └────────────┬───────────┘                      │
│                           │                                  │
│                           ▼                                  │
│              ┌────────────────────────┐                      │
│              │  MongoDB Database      │                      │
│              │  Collection: pois      │                      │
│              └────────────────────────┘                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Modelo de Datos POI

### Backend Schema (`models/pois.js`)

```javascript
{
  id: String,        // UUID único
  lat: Number,       // Latitud (requerido)
  lon: Number,       // Longitud (requerido)
  title: String,     // Título del POI
  description: String, // Descripción
  path: String       // Path de la imagen: "planet/tile_id"
}
```

### Campos Adicionales Recomendados

Para mejorar la funcionalidad, considera añadir:

```javascript
{
  // ... campos existentes ...
  planet: String,     // Nombre del planeta
  thumbnail: String,  // URL de thumbnail
  createdAt: Date,    // Fecha de creación (para sorting)
  author: String,     // Autor/fuente
  tags: [String]      // Tags para búsqueda
}
```

---

## Testing

### Verificar endpoints:

```bash
# Desde el backend
curl http://localhost:3000/api/pois

# Debería devolver:
[
  {
    "id": "...",
    "lat": 123.456,
    "lon": -78.910,
    "title": "Test POI",
    "description": "...",
    "path": "mars/12_34"
  }
]
```

### Verificar en frontend:

1. Abrir consola del navegador
2. Navegar a `/explore`, `/news`, o `/`
3. Buscar logs:
   - `"Loaded X images from backend"` → ✅ Datos cargados
   - `"Using placeholder data"` → ⚠️ Sin datos / Error

---

## Manejo de Errores

### Estrategia de Fallback en Cascada:

```
1. Try: /api/pois → Transform → Filter
   ↓ (si falla)
2. Try: /api/images/:planet (legacy endpoint)
   ↓ (si falla)
3. Try: /src/assets/images/:planet/images.json (local)
   ↓ (si falla)
4. Use: PLACEHOLDER_IMAGES (hardcoded)
```

### Logs en Consola:

```javascript
// Éxito
✅ "Loaded 15 images for mars from POIs endpoint"

// Fallback
⚠️ "No images found for mars in POIs, trying other endpoints..."
⚠️ "No local images.json found for mars"
⚠️ "Using placeholder data due to error"
```

---

## Próximos Pasos

### Backend:
1. ✅ Endpoint `/api/pois` funcionando
2. 🔲 Añadir campo `planet` al schema
3. 🔲 Añadir campo `thumbnail` para vistas previas
4. 🔲 Añadir campo `createdAt` para ordenamiento
5. 🔲 Endpoint `/api/pois/:planet` para filtrar por planeta
6. 🔲 Endpoint `/api/pois/recent?limit=3` para optimizar

### Frontend:
1. ✅ Integración con `/api/pois`
2. ✅ Transformación de datos
3. ✅ Loading states
4. ✅ Fallback a placeholders
5. 🔲 Cache de imágenes en localStorage
6. 🔲 Paginación en Explore (si hay muchas imágenes)
7. 🔲 Prefetch de imágenes relacionadas

---

## Archivos Modificados/Creados

### Creados:
- ✅ `frontend/src/utils/imageDataHelpers.js`

### Modificados:
- ✅ `frontend/src/pages/ExplorePage.jsx`
- ✅ `frontend/src/pages/NewsPage.jsx`
- ✅ `frontend/src/pages/LandingPage.jsx`
- ✅ `frontend/src/utils/loadImages.js`

---

## Notas Importantes

1. **Path Format**: El campo `path` debe seguir el formato `"planet/tile_id"` (ej: `"mars/12_34"`)
2. **DZI Extension**: Se añade automáticamente `.dzi` al filename
3. **Planet Detection**: Si no hay campo `planet`, se intenta extraer del `path`
4. **Placeholders**: Siempre hay datos de respaldo para no mostrar páginas vacías
5. **API Base**: Configurar `VITE_API_BASE` en `.env` para producción

---

## FAQ

### ¿Por qué no se cargan mis imágenes?

1. Verifica que el backend esté corriendo (`http://localhost:3000`)
2. Verifica que `/api/pois` devuelva datos
3. Revisa la consola del navegador para errores
4. Verifica que `VITE_API_BASE` esté correctamente configurado

### ¿Cómo añado el campo `planet` a mis POIs existentes?

```javascript
// En MongoDB o via API
db.pois.updateMany(
  { path: /^mars\// },
  { $set: { planet: 'mars' } }
)
```

### ¿Puedo usar otro endpoint que no sea `/api/pois`?

Sí, modifica las funciones en `imageDataHelpers.js` y actualiza las páginas para usar tu endpoint personalizado.
