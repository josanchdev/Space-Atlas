# Image Viewer - Documentación

## Ruta Universal del Visor de Imágenes

La aplicación Space Atlas utiliza una ruta universal para visualizar todas las imágenes DZI (Deep Zoom Images) utilizando OpenSeadragon:

```
/image/:image_name
```

## Parámetros de Query String

La ruta acepta parámetros opcionales que proporcionan contexto adicional:

- `planet` - El planeta o cuerpo celeste de origen (ej: "mars", "earth", "nebula")
- `source` - Origen de navegación (ej: "landing", "explore", "news", "bookmarks", "planet")
- `title` - Título de la imagen para mostrar

### Ejemplo de URL completa:

```
/image/mars_olympus_mons?planet=mars&source=planet&title=Olympus%20Mons
```

## Integración en Componentes

### Desde una lista de imágenes:

```jsx
import { useNavigate } from 'react-router-dom'

function ImageList({ images }) {
  const navigate = useNavigate()
  
  const handleImageClick = (image) => {
    const imageName = String(image.filename).replace(/\.dzi$/i, '')
    const planet = image.planet || 'unknown'
    const source = 'explore' // o el origen correspondiente
    
    navigate(`/image/${imageName}?planet=${planet}&source=${source}&title=${encodeURIComponent(image.title)}`)
  }
  
  return (
    <div>
      {images.map(img => (
        <div key={img.id} onClick={() => handleImageClick(img)}>
          {img.title}
        </div>
      ))}
    </div>
  )
}
```

## Páginas que utilizan el visor:

1. **LandingPage** (`/`) - Sección "Recent Scientific Discoveries"
   - Muestra las 3 imágenes más recientes
   - `source=landing`

2. **ExplorePage** (`/explore`) - Grid de exploración
   - Búsqueda y visualización de todas las imágenes
   - `source=explore`

3. **NewsPage** (`/news`) - Últimas noticias
   - Imágenes destacadas de descubrimientos
   - `source=news`

4. **PlanetPage** (`/:planet`) - Página de cada planeta
   - Lista de imágenes específicas del planeta
   - `source=planet`
   - `planet` automáticamente establecido

5. **MyBookmarksPage** (`/mybookmarks`) - Marcadores del usuario
   - Imágenes guardadas por el usuario
   - `source=bookmarks`

## Componente DziViewer

El componente `DziViewer` es responsable de renderizar las imágenes usando OpenSeadragon:

```jsx
<DziViewer 
  dziUrl={dziUrl} 
  imageName={image_name}
/>
```

### Props:

- `dziUrl` - URL completa al archivo .dzi
- `imageName` - Nombre de la imagen para logging/debugging

## Características del Visor:

### Controles de navegación:
- ✅ Zoom in/out
- ✅ Pan (arrastrar)
- ✅ Rotate
- ✅ Home (reset)
- ✅ Fullscreen
- ✅ Navegador miniatura

### Acciones adicionales:
- 📌 **Bookmark** - Guardar imagen en marcadores
- 💬 **Comments** - Panel de comentarios (próximamente)
- 🔗 **Share** - Compartir imagen (usa Web Share API o clipboard)

### Metadata:
- Nombre de la imagen
- Descripción
- Fecha
- Fuente/Autor
- Planeta de origen

## Backend - Endpoints requeridos:

### Servir archivos DZI:
```
GET /api/dzi/:planet/:image_name
GET /api/dzi/:image_name
```

### Metadata de imagen:
```
GET /api/images/:planet/:image_name
GET /api/images/:image_name
```

Respuesta esperada:
```json
{
  "name": "mars_olympus_mons",
  "title": "Olympus Mons",
  "description": "The largest volcano in the solar system",
  "planet": "mars",
  "date": "2025-10-01",
  "source": "NASA/JPL",
  "dziUrl": "/api/dzi/mars/mars_olympus_mons"
}
```

## Navegación de retorno:

El botón "Back" navega automáticamente según el parámetro `source`:
- `landing` → `/`
- `explore` → `/explore`
- `news` → `/news`
- `bookmarks` → `/mybookmarks`
- `planet` → `/:planet`
- Sin source → `navigate(-1)` (navegación hacia atrás del navegador)

## Estilos:

Los estilos del visor están en `src/styles/imageViewer.css` y son completamente personalizables. El diseño es:
- Full screen overlay (oculta header/footer)
- Top bar con título y controles
- Área principal con el visor OpenSeadragon
- Panel lateral opcional para comentarios
- Barra inferior con metadata

## Responsive:

El visor es completamente responsive:
- Desktop: Layout completo con todos los controles
- Tablet: Ajustes de tamaño de controles
- Mobile: Oculta textos auxiliares, optimiza para touch

## Ejemplos de uso en código:

### Desde LandingPage:
```jsx
navigate(`/image/${imageName}?planet=deep_space&source=landing&title=${encodeURIComponent(title)}`)
```

### Desde PlanetPage:
```jsx
navigate(`/image/${imageName}?planet=${planetName}&source=planet&title=${encodeURIComponent(title)}`)
```

### Desde ExplorePage:
```jsx
navigate(`/image/${imageName}?planet=${planet}&source=explore&title=${encodeURIComponent(title)}`)
```

## Notas importantes:

1. **Siempre** remover la extensión `.dzi` del nombre de archivo antes de navegar
2. **Siempre** usar `encodeURIComponent()` para el título en la URL
3. El visor carga automáticamente desde el backend, no desde archivos locales
4. Las imágenes DZI requieren una estructura de carpetas específica (archivo .dzi + carpeta _files)
