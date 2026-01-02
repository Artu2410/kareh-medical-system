# 🏥 KAREH Pro - Sistema Médico Premium

Sistema de gestión médica tipo SaaS de alto rendimiento, construido con **React**, **Vite** y **Tailwind CSS v4**. Este proyecto implementa una arquitectura profesional, minimalista y escalable, diseñada para clínicas que buscan una experiencia de usuario fluida y robusta.

## 🎯 Características Principales

- ✅ **Dashboard Interactivo**: Visualización de KPIs y métricas críticas mediante gráficos dinámicos (Recharts).
- ✅ **Agenda Médica Inteligente**: Sistema de turnos con slots de 30 min y gestión de cupos (máx. 5 por slot).
- ✅ **Gestión de Pacientes**: Tabla profesional con búsqueda avanzada, filtros por estado y tipos de sangre.
- ✅ **Wizard Multi-paso**: Proceso guiado de 4 pasos para la creación de citas médicas.
- ✅ **Arquitectura UI Atómica**: Kit de componentes reutilizables (Botones, Cards, Modales, Badges) siguiendo el estilo *shadcn/ui*.
- ✅ **Layout Premium**: Sidebar colapsable animada y transiciones de página suaves con *Framer Motion*.
- ✅ **Seguridad y Auditoría**: Registro centralizado de cambios para cumplimiento legal y trazabilidad.

## 🛠️ Stack Técnico

- **Core**: React 18.3 + Vite 5.4
- **Estilos**: Tailwind CSS v4 (con motor de alto rendimiento)
- **Iconografía**: Lucide React
- **Animaciones**: Framer Motion (AnimatePresence)
- **Gráficos**: Recharts
- **Gestión de Fechas**: date-fns

---

## 📁 Estructura del Proyecto

```text
src/
├── components/
│   ├── ui/          # Componentes base (Button, Card, Input...)
│   ├── layout/      # Sidebar, Header y contenedores
│   └── appointments/# Lógica específica de la agenda
├── services/        # Lógica de datos y llamadas a API
├── hooks/           # Lógica reutilizable (useAuth, useStats...)
├── context/         # Estados globales (Autenticación, Features)
└── lib/             # Constantes y utilidades (cn, formatters)

🚀 Instalación y Desarrollo
Sigue estos pasos para levantar el proyecto en tu entorno local:

1. Clonar e instalar
Bash

# Instalar dependencias
npm install
2. Levantar servidor de desarrollo
Bash

npm run dev
La aplicación estará disponible en: http://localhost:5173

3. Construir para producción
Bash

npm run build
🎨 Identidad Visual
El sistema utiliza una paleta de colores equilibrada para entornos clínicos:

Primario (Teal): #0D9488 (Confianza y profesionalismo)

Éxito (Emerald): #10B981 (Estados positivos)

Fondo (Slate): #F8FAFC (Limpieza visual)

Bordes: rounded-2xl para una estética moderna y amigable.

📝 Auditoría y Seguridad
KAREH Pro incluye un servicio de auditoría (audit.service.js) que registra:

Quién realizó la acción.

Qué recurso fue modificado (Cita, Paciente, etc).

Timestamp exacto para trazabilidad médica.

📄 Licencia
Este proyecto está bajo la Licencia MIT.

Desarrollado con ❤️ por [ARTURO AZOCAR]
