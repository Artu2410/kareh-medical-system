# KAREH Medical System - Instrucciones de Ejecución

## Requisitos
- Node.js 18.x o superior
- npm 9.x o superior

## Instalación y ejecución rápida

### 1. Instalar dependencias (solo la primera vez o tras cambios en package.json)

Abre una terminal y ejecuta:

```sh
cd D:/kareh-medical-system/kareh-medical-system
npm install
cd backend
npm install
```

### 2. Levantar el backend (API)

En una terminal:

```sh
cd D:/kareh-medical-system/kareh-medical-system/backend
npm run dev
```

Esto debe mostrar:
```
✅ KAREH Backend iniciado en puerto 4000
```

### 3. Levantar el frontend (Vite)

Abre otra terminal y ejecuta:

```sh
cd D:/kareh-medical-system/kareh-medical-system
npm run dev
```

Esto debe mostrar una URL como:
```
VITE v5.x.x  ready in ... ms
 ➜  Local:   http://localhost:5173/
```

Abre esa URL en tu navegador para ver la app funcionando.

---

## Solución de problemas comunes

- **npm error Missing script: "dev"**
  - Asegúrate de estar en la carpeta `D:/kareh-medical-system/kareh-medical-system` (no en la raíz del repo).
- **Faltan dependencias (axios, etc.)**
  - Ejecuta `npm install` en la carpeta correcta.
- **Cambios en dependencias**
  - Si hay problemas, elimina `node_modules` y `package-lock.json`, luego ejecuta `npm install` de nuevo.

---

## Scripts útiles

- `npm run dev` (en frontend): Levanta la app React con Vite.
- `npm run dev` (en backend): Levanta la API con nodemon.
- `npm run dev:all` (en frontend): Levanta frontend y backend juntos (requiere `npm-run-all`).

---

## Estructura recomendada de carpetas

- `kareh-medical-system/` (raíz del repo)
  - `kareh-medical-system/` (código fuente)
    - `backend/` (API Node.js/Express)
    - `src/` (frontend React)
    - ...

---

## Contacto y soporte
Si tienes problemas, comparte el mensaje de error exacto de la terminal para recibir ayuda rápida.
