# ShoppingCart — Frontend

Frontend Angular 22 del carrito de compras. Consume la API REST del repositorio `shopping-cart-api`.

---

## Requisitos previos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 22.12+ |
| npm | 10+ |
| Docker Desktop | cualquier versión reciente |

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/josesanc-tech/shopping-cart-app.git
cd shopping-cart-app

git checkout develop

# 2. Instalar dependencias
npm install
```

---

## Ejecución

### 1. Levantar el backend

En una terminal separada, desde la carpeta `shopping-cart-api`:

```bash
docker-compose up --build
```

La API queda disponible en `http://localhost:5000/swagger`.

### 2. Levantar el frontend

```bash
npm start
```

Abre `http://localhost:4200`.  
El proxy redirige automáticamente `/api/*` → `http://localhost:5000`.

---

## Credenciales de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| `cliente` | `Cliente123!` | Cliente |
| `admin` | `Admin123!` | Administrador |
