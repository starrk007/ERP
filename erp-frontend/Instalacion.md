# Proyecto Frontend

---

## Creación del Proyecto

```

npm create nuxt@latest . -- -t v3
cd erp-frontend
```

## Forzar Node 24

Crear .nvmrc

```

24

```

Agregar en el package.json

```json

{
  "engines": { "node": ">=24" },
  "scripts": {
    "preinstall": "node -e \"const v=process.versions.node.split('.').map(Number); if(v[0]<24){console.error('❌ Node >= 24 required. Current:',process.versions.node); process.exit(1)}\""
  }
}

```

## Instalar Tailwind3 y DaisyUI4

```bash

npm i -D tailwindcss@3 postcss autoprefixer daisyui@4
npx tailwindcss init -p

```

Si no existe tailwind.config.js crearlo en raiz si no modificarlos con:

```bash

import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {}
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        erp: {
          "primary": "#2563eb",
          "secondary": "#0f172a",
          "accent": "#22c55e",
          "neutral": "#111827",
          "base-100": "#ffffff",
          "base-200": "#f3f4f6",
          "base-300": "#e5e7eb",
          "info": "#0ea5e9",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444"
        }
      },
      "dark"
    ],
    darkTheme: "dark"
  }
}

```

Crear y poner el código en assets/css/tailwind.css

```bash

@tailwind base;
@tailwind components;
@tailwind utilities;

```

Modificar el archivo nuxt.config.ts

```bash

export default defineNuxtConfig({
  devtools: { enabled: true },

  css: ['~/assets/css/tailwind.css'],

  app: {
    head: {
      htmlAttrs: { "data-theme": "erp" }
    }
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api'
    }
  }
})

```

## Crear el archivo .env

```bash

NUXT_PUBLIC_API_BASE=

```