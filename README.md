# CalzaStock — Sistema de Gestión Logística

> Proyecto desarrollado para el **Logistics Hackathon UPIICSA 2025**. Aplicación web full-stack para la gestión interna de una empresa distribuidora de calzado.

---

## 📋 Descripción

**CalzaStock** es una plataforma multi-rol para administrar los procesos internos de una empresa de calzado: desde la recepción y control de calidad de lotes, hasta el almacenamiento y venta de productos. Cada área de la empresa cuenta con su propio panel adaptado a sus funciones.

---

## 🏗️ Arquitectura

```
Logistic_Hackathon/
├── client/          # Frontend — React + TypeScript + Mantine UI
│   └── src/
│       ├── pages/       # Vistas por rol (Manager, Sales, Storage, Quality)
│       ├── components/  # Componentes reutilizables
│       ├── layouts/     # Layouts por sección
│       ├── context/     # Autenticación (AuthContext)
│       └── auth/        # Rutas protegidas
└── server/          # Backend — Node.js + TypeScript
```

**Stack tecnológico:**
- **Frontend:** React, TypeScript, Mantine UI, React Router, Tabler Icons
- **Backend:** Node.js, TypeScript
- **Build tool:** Vite

---

## 👥 Roles y Funcionalidades

La aplicación maneja cuatro roles distintos, cada uno con su propio dashboard:

### 🏢 Gerente (`/home/manager`)
Panel de administración general del sistema.
- Visualización de estadísticas de usuarios (total, activos, inactivos, nuevos)
- Tabla de usuarios con roles asignados
- Crear nuevos usuarios y asignarles un rol
- Activar/desactivar usuarios
- Distribución de roles por área
- Configuraciones del sistema (logs, notificaciones, backups)

### 🛒 Ventas (`/home/sales`)
Panel para gestión de pedidos y ventas.
- Estadísticas diarias: número de ventas, ingresos, pedidos pendientes y completados
- Catálogo de productos disponibles con stock y precio
- Tabla de órdenes de venta con estado (pendiente / completado)
- Crear nuevas ventas seleccionando cliente, producto y cantidad
- Marcar órdenes como completadas

### 📦 Almacén (`/home/storage`)
Panel para gestión del inventario físico.
- Estadísticas de capacidad del almacén y tasa de utilización
- Vista general de secciones del almacén (A, B, C, D) con ocupación
- Inventario de lotes por sección y ubicación específica
- Reubicar lotes entre secciones
- Transferir lotes (reducir cantidad para envío a ventas)

### ✅ Control de Calidad (`/home/quality`)
Panel para inspección y aprobación de lotes entrantes.
- Estadísticas de lotes: pendientes, aprobados, rechazados
- Tabla de lotes recibidos de proveedores
- Inspeccionar lotes pendientes: aprobar o rechazar con notas
- Seguimiento del estado de cada lote

---

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js v18+
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/UrielCandelasMeza/Logistic_Hackathon.git
cd Logistic_Hackathon

# Instalar dependencias raíz
npm install

# Instalar dependencias del cliente
cd client && npm install

# Instalar dependencias del servidor
cd ../server && npm install
```

### Ejecutar en desarrollo

```bash
# Desde la raíz — iniciar backend
cd server && npm run dev

# En otra terminal — iniciar frontend
cd client && npm run dev
```

El cliente estará disponible en `http://localhost:5173` por defecto.

---

## 🔐 Autenticación

La app incluye rutas protegidas mediante un `AuthContext`. Las rutas de cada rol (`/home/manager`, `/home/sales`, `/home/storage`, `/home/quality`) requieren estar autenticado. Las rutas públicas son:

- `/` — Landing page
- `/login` — Inicio de sesión
- `/register` — Registro
- `/support` — Soporte

---

## 📝 Notas del Hackathon

- Proyecto presentado en el **Logistics Hackathon organizado por UPIICSA (2025)**.
- El proyecto fue construido en tiempo limitado; algunas vistas usan datos mock en lugar de llamadas reales a la API.
- La landing page (`/`) es un placeholder pendiente de desarrollo.
- El backend está incluido en la carpeta `server/` pero puede requerir configuración adicional de variables de entorno.
