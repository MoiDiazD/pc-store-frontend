# pc-store frontend

Frontend React de **pc-store**, una tienda de componentes de PC. Consume el backend NestJS descrito en BACKEND_API.md; no contiene base de datos, autenticación propia ni endpoints simulados.

## Arquitectura y stack

- React + TypeScript + Vite.
- React Router para las rutas de escaparate, cuenta, pedidos y administración.
- Servicios tipados en src/services/ sobre un único cliente HTTP. Todas las peticiones conservan credentials: include para la sesión del backend.
- Estado de sesión en memoria mediante AuthContext; no se usa localStorage.
- Stripe Payment Element mediante @stripe/stripe-js y @stripe/react-stripe-js.
- Vitest + Testing Library para pruebas de comportamiento.
- CSS responsive propio.

## Requisitos

- Node.js compatible con Vite.
- Backend pc-store en ejecución, normalmente en http://localhost:3000.
- Dependencias instaladas con npm install.
- Para probar el checkout real en navegador, una clave publicable de Stripe.

## Instalación

```bash
npm install
cp .env.example .env
npm run dev
```

Vite reenvía /api a http://localhost:3000 durante el desarrollo. Comandos: npm run dev, npm test, npm run lint y npm run build.

## Variables de entorno

| Variable | Uso |
| --- | --- |
| VITE_API_URL | Base de la API. Por defecto usa /api. |
| VITE_STRIPE_PUBLISHABLE_KEY | Clave publicable pk_... usada por Stripe.js en el navegador. |

Nunca se debe poner STRIPE_SECRET_KEY en este repositorio ni en una variable VITE_*.

## Funcionalidad integrada

- Registro, login, logout, recuperación de sesión, perfil y cambio de contraseña.
- Catálogo, productos, marcas y navegación por categorías.
- Carrito autenticado con añadir, cambiar cantidad, eliminar y totales.
- Checkout real con POST /orders/checkout, Stripe Payment Element y confirmación mediante Stripe.js.
- Tras confirmar el pago, el frontend consulta GET /orders/:id; si el webhook todavía está procesando el pago, el detalle puede actualizar su estado automáticamente durante un periodo corto.
- Lista y detalle de pedidos.
- Administración adaptada a customer/worker/manager.
- Estados de carga, error y vacío en los principales flujos.

## Backend e integración

BACKEND_API.md es la referencia de endpoints, cuerpos y respuestas. El cliente no llama directamente al webhook de Stripe.

No se implementan funciones para las que el backend no publica endpoints, como búsqueda/paginación/filtros, imágenes, favoritos, envíos, cancelación/reintento de pedidos o consulta directa de PaymentIntent.

Las rutas de administración permiten restaurar por ID conocido porque el backend no publica un listado de recursos soft-deleted.

## Stripe / checkout

El backend crea el PaymentIntent mediante POST /orders/checkout y devuelve un clientSecret. El navegador utiliza ese secreto de cliente con el Payment Element oficial de Stripe.

El frontend nunca llama a /payments/webhook y el webhook del backend sigue siendo la autoridad que cambia el pedido a confirmed o cancelled.

Si falta VITE_STRIPE_PUBLISHABLE_KEY, el checkout no inicia el pedido y muestra un mensaje de configuración.

## Tests

Vitest cubre el cliente API, autenticación, rutas protegidas, permisos por rol, cuenta, checkout/Stripe y pedidos. Los mocks sólo aíslan dependencias externas en los tests; la aplicación real no simula pagos exitosos.

Si el entorno no permite instalar dependencias, los tests no pueden considerarse ejecutados hasta que npm install funcione.
