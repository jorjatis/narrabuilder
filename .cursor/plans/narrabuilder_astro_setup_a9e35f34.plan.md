---
name: Narrabuilder Astro Setup
overview: Crear un proyecto Astro con un catálogo de componentes narrativos y un generador visual de scrollytelling como primer componente, basado en el JS/SCSS/HTML proporcionados.
todos:
  - id: init-astro
    content: Inicializar proyecto Astro con dependencias (sass, gsap)
    status: completed
  - id: base-layout
    content: "Crear layouts Base.astro y Component.astro (dos columnas: config + preview)"
    status: completed
  - id: catalog-index
    content: Crear página index con catálogo grid de componentes
    status: completed
  - id: scrolly-styles
    content: Adaptar _scrolly.scss al proyecto (sin variables externas)
    status: completed
  - id: scrolly-js
    content: Portar scrolly.js al proyecto (función exportable, misma lógica)
    status: completed
  - id: scrolly-preview
    content: Crear ScrollyPreview.astro que renderiza el scrollytelling
    status: completed
  - id: scrolly-config
    content: Crear panel de configuración con formularios nativos para editar steps, fondos y parámetros
    status: completed
  - id: scrolly-page
    content: Crear scrollytelling.astro uniendo config + preview
    status: completed
  - id: export
    content: Implementar exportación de HTML/CSS/JS limpio
    status: completed
isProject: false
---

# Narrabuilder - Librería de componentes narrativos con Astro

## Estructura del proyecto

```
narrabuilder/
  astro.config.mjs
  package.json
  tsconfig.json
  src/
    layouts/
      Base.astro              # Layout base (head, body, slot)
      Component.astro         # Layout para cada generador (sidebar config + preview)
    pages/
      index.astro             # Catálogo / portfolio de componentes
      scrollytelling.astro    # Página del generador de scrollytelling
    components/
      catalog/
        ComponentCard.astro   # Tarjeta del catálogo (nombre, preview, enlace)
      scrollytelling/
        ScrollyPreview.astro  # Renderiza el scrollytelling con el HTML/SCSS base
        ScrollyConfig.astro   # Panel lateral de configuración (formularios nativos)
    styles/
      global.scss             # Reset, tipografía base, variables compartidas
      components/
        _scrolly.scss         # SCSS del scrollytelling (adaptado del original)
        _catalog.scss         # Estilos del catálogo
    scripts/
      scrolly.js              # JS funcional del scrollytelling (tal cual, adaptado mínimamente)
```

## Decisiones clave

- **Sin React ni frameworks JS pesados**: todo con Astro components (`.astro`) + JS vanilla en `<script>` tags o archivos `.js` importados
- **SCSS**: Astro soporta SCSS nativamente con `sass` como dependencia
- **JS funcional**: el `scrolly.js` se mantiene como función exportada, se invoca desde un `<script>` en la página
- **Configuración no-code**: formularios HTML nativos en un panel lateral que manipulan el DOM del preview (añadir/quitar steps, cambiar textos, subir imágenes de fondo, ajustar parámetros como fadeIn/fadeOut)
- **Build limpio**: el output de Astro genera HTML + CSS + JS estáticos, fácil de extraer

## Catálogo (index)

Página grid con tarjetas. Cada tarjeta tiene: nombre del componente, descripción breve, thumbnail/icono, enlace a `/scrollytelling` (o el que corresponda). Sencillo y limpio.

## Generador de Scrollytelling

Layout a dos columnas:
- **Izquierda (o superior en mobile)**: panel de configuración con:
  - Gestión de steps: añadir/eliminar, editar texto de cada cartela
  - Gestión de fondos: subir imágenes/videos por cada `bg-item`
  - Vincular step con fondo (`data-bg`)
  - Parámetros: `fadeIn`, `fadeOut`, `start`, `end`
  - Opción overlay (`v-n-ss`)
  - Botón "Exportar HTML/CSS/JS"
- **Derecha**: preview en vivo del scrollytelling (iframe o div con scroll propio)

El JS de `scrolly.js` se usa prácticamente tal cual, solo se adaptan las referencias a variables SCSS (se usan valores por defecto en lugar de importar de un proyecto externo).

## Dependencias

- `astro` (framework)
- `sass` (SCSS)
- `gsap` (animaciones scroll, ya usada en el JS base)

## Flujo de exportación

Un botón "Exportar" genera y descarga un `.zip` con:
- `index.html` (el scrollytelling renderizado)
- `scrolly.css` (compilado)
- `scrolly.js` (el módulo funcional)
