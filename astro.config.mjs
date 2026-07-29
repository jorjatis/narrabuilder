import { defineConfig } from 'astro/config';

// data-astro-source-* solo aparece en `astro dev` (inspector).
// En build de producción no se inyectan. El export HTML los limpia igual.
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
});
