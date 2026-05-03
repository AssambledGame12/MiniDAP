# 🎵 MiniDAP

Reproductor de música web minimalista con visualizador de audio en tiempo real. Desarrollado en HTML, CSS y JavaScript vanilla — sin frameworks, sin dependencias.

**[▶️ Abrir MiniDAP](https://assambledgame12.github.io/MiniDAP/)**

---

## ¿Qué es?

MiniDAP (Mini Digital Audio Player) es un reproductor de música local que funciona directamente en el navegador. Carga tus propios archivos de audio y los reproduce con un visualizador de frecuencias en tiempo real.

## Características

- Visualizador de frecuencias en tiempo real (Web Audio API)
- Reproducción de playlist con archivos locales
- Shuffle aleatorio
- Estadísticas de escucha (canciones escuchadas, tiempo total, tiempo de hoy)
- Controles completos: play, pause, siguiente, anterior, seek
- Interfaz limpia y minimalista
- Sin conexión a internet requerida después de cargar

## Cómo usar

1. Abre el link o el archivo `index.html` en tu navegador
2. Agrega tus archivos de audio a la carpeta `musica/`
3. Actualiza la playlist en `script.js` con los nombres de tus archivos
4. ¡Listo!

## Tecnologías

- Web Audio API (visualizador y análisis de frecuencias)
- HTML5 Audio (reproducción de audio)
- JavaScript vanilla (lógica del reproductor, gestión de playlist)
- CSS3 (interfaz y animaciones)

## Estructura del proyecto

```
MiniDAP/
├── index.html
├── style.css
├── script.js
└── musica/
    └── (tus archivos .mp3 / .ogg / .wav)
```

## Autor

**AssambledGame12** — [@AssambledGame12](https://github.com/AssambledGame12)
