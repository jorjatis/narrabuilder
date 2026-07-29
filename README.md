# Narrabuilder

Constructor visual para crear **historias interactivas** con acabado de producto, sin montar un proyecto desde cero.

Hoy Narrabuilder es un estudio web donde configuras la historia, la previsualizas en un canvas y exportas el resultado listo para publicar.

## ¿Para qué sirve?

Para montar narrativas que se cuentan con el scroll: fondos sticky, cartelas, cambios de escena y audio ligado a cada paso. Pensado para scroll stories, tours de producto y piezas multimedia ligeras.

La idea es ir del borrador al embebible en minutos: editas en un panel, ves el resultado al momento y exportas cuando esté listo.

## Estado actual

Por ahora solo hay **una plantilla disponible**:

### Scrollytelling

Builder de *scrollies* (scrollytelling) con:

- Fondo sticky y varios **bg-items** (imagen, color, etc.)
- **Steps** con cartelas de contenido
- Transiciones de fondo (incluido **morph** entre steps)
- Audio por step
- Preview en vivo y **export** del paquete

Más plantillas llegarán más adelante. La home ya está orientada a un catálogo de componentes; de momento solo enlaza a scrollytelling.

## Stack

| Pieza | Uso |
| --- | --- |
| [Astro](https://astro.build/) | App / páginas estáticas |
| [GSAP](https://gsap.com/) + ScrollTrigger | Scroll y sincronización del scrolly |
| Sass | Estilos del builder y del componente |
| [JSZip](https://stuk.github.io/jszip/) | Empaquetado del export |
| [Netlify](https://www.netlify.com/) | Hosting / deploy |

## Desarrollo local

```bash
npm install
npm run dev
```

Abre la URL que indique Astro (por defecto `http://localhost:4321`).

Otros scripts:

```bash
npm run build          # build de producción → dist/
npm run preview        # previsualizar el build
npm run deploy         # build + deploy a Netlify (producción)
npm run deploy:preview # build + deploy draft en Netlify
```

Para `deploy` / `deploy:preview` hace falta tener el [Netlify CLI](https://docs.netlify.com/cli/get-started/) instalado, sesión iniciada (`netlify login`) y el proyecto enlazado (`netlify link`).

## Estructura (resumen)

```
src/
  pages/           # Home y builder de scrollytelling
  components/      # UI del catálogo y del scrolly
  scripts/         # Lógica de scroll (scrolly.js)
  styles/          # Tokens y estilos del producto
public/            # Assets estáticos
```

## Licencia

Privado / por definir.
