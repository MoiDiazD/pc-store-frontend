# pc-store frontend

Frontend React de **pc-store**, una tienda de componentes de PC. Consume el backend NestJS descrito en [`BACKEND_API.md`](./BACKEND_API.md); no contiene base de datos, autenticación propia ni endpoints simulados.

## Arquitectura y stack

- React + TypeScript + Vite.
- React Router para las rutas de escaparate, cuenta, pedidos y administración.
- Servicios tipados en `src/services/` sobre un único cliente HTTP (`api-client.ts`). Todas las peticiones conservan `credentials: 'include'` para la sesión del backend.
- Estado de sesión en memoria mediante `AuthContext`; no se usa `localStorage` ni se guarda ninguna contraseña o cookie de sesión.
- CSS responsive propio, sin una librería de UI.

La aplicación está organizada en `src/app` (shell, rutas y estilos), `src/features/auth` (sesión), `src/pages` (vistas) y `src/services` (contrato HTTP y tipos).

## Requisitos

- Node.js compatible con Vite.
- Un backend pc-store en ejecución, normalmente en `http://localhost:3000`.
- Dependencias instaladas con `npm install`.

## Instalación y ejecución

```bash
npm install
cp .env.example .env
npm run dev
```

Por defecto Vite reenvía `/api` a `http://localhost:3000`, por lo que evita el CORS ausente del backend durante el desarrollo. Si se configura `VITE_API_URL`, debe apuntar al prefijo HTTP del backend (por ejemplo `/api` para el proxy), no a PostgreSQL.

Comandos disponibles:

```bash
npm run dev
npm test
npm run lint
npm run build
```

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `VITE_API_URL` | Base de la API. Si no existe usa `/api`, que el proxy de Vite reenvía al backend local. |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Clave publicable `pk_...` necesaria cuando se integre el Payment Element oficial. No es una clave secreta. |

Nunca se debe poner `STRIPE_SECRET_KEY` en este repositorio, `.env.example` o una variable `VITE_*`: la clave secreta sólo se usa en el backend.

## Funcionalidad integrada

- Registro, inicio/cierre de sesión, recuperación de sesión, perfil y cambio de contraseña.
- Catálogo público, productos, marcas y navegación por categorías.
- Carrito autenticado con añadir, cambiar cantidad, eliminar, totales y estados de carga/error/vacío.
- Lista y detalle de pedidos del usuario. Los precios del API se conservan como cadenas decimales y sólo se formatean para mostrarlos.
- Administración adaptada al rol: trabajadores y managers gestionan productos y asociaciones de categoría; managers además gestionan marcas, categorías y usuarios por ID. El backend sigue siendo la frontera de autorización.

## Backend e integración

`BACKEND_API.md` es la referencia de endpoints, cuerpos y respuestas. El cliente no llama directamente al webhook de Stripe y no hay endpoints de búsqueda, paginación, filtros, imágenes, favoritos, envíos, cancelación ni reintentos porque el backend no los publica.

Las rutas de administración permiten restaurar por ID conocido. Esto es deliberado: los listados públicos excluyen los registros eliminados y el backend no expone un listado de elementos soft-deleted.

## Stripe / checkout

El backend puede crear el PaymentIntent con `POST /orders/checkout` y devuelve un `clientSecret`. El navegador debe después usar el Payment Element de Stripe para confirmar el pago; el webhook del backend cambia el pedido a `confirmed` o `cancelled`.

Cuando `VITE_STRIPE_PUBLISHABLE_KEY` está configurada, la pantalla inicia el checkout, monta el Payment Element con el `clientSecret` devuelto y confirma el pago en el navegador. Después dirige al detalle del pedido, que consulta `GET /orders/:id` hasta que el webhook del backend confirma o cancela su estado. Si falta la clave de entorno, se muestra un error de configuración y no se bloquea el carrito iniciando un checkout incompleto. Consulta [`BACKEND_LIMITATIONS.md`](./BACKEND_LIMITATIONS.md) para la limitación de CORS en producción.

## Tests

La batería Vitest cubre el cliente API centralizado, login/logout, el refresco de sesión de `AuthContext` y la confirmación del Payment Element. Se priorizan contratos y flujos que no requieren un backend real. Para ejecutar los tests hace falta haber instalado las dependencias del proyecto.
