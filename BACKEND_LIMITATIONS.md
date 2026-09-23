# Limitaciones conocidas de integración con el backend

## 23 de septiembre de 2026

El frontend usa el contrato real de BACKEND_API.md, sin modificar el backend. En desarrollo, Vite reenvía /api a http://localhost:3000.

## Pago Stripe

El checkout de navegador está implementado con el SDK oficial:

- POST /orders/checkout crea el checkout y devuelve clientSecret.
- @stripe/stripe-js inicializa Stripe con VITE_STRIPE_PUBLISHABLE_KEY.
- @stripe/react-stripe-js renderiza el Payment Element.
- stripe.confirmPayment() confirma el pago desde el navegador.
- El frontend nunca invoca POST /payments/webhook.
- El detalle consulta GET /orders/:id para observar el estado establecido por el webhook.

La clave publicable es configuración de runtime. Si falta, el frontend no inicia POST /orders/checkout y muestra un mensaje claro. Nunca se usa STRIPE_SECRET_KEY en el frontend.

El contrato no ofrece consulta directa del PaymentIntent ni endpoint de reintento. El flujo implementado no inventa ninguno: usa el estado del pedido.

## Capacidades no expuestas por la API

No se implementan búsqueda, paginación, filtros, imágenes, reseñas, favoritos, cupones, direcciones/envíos, cancelación/reintento de pedidos ni consulta directa de PaymentIntent porque el backend no ofrece esos endpoints.

El catálogo sí permite navegación por categorías mediante GET /categories/:id/products.

La administración puede restaurar recursos por ID conocido, pero el backend no publica un listado de recursos soft-deleted.

## CORS

Para despliegues con frontend y backend en orígenes distintos, el backend necesitará configurar CORS o compartir origen. El proxy de Vite sólo resuelve el desarrollo local.

## Verificación del entorno

Si npm devuelve 403 Forbidden, eso impide instalar o ejecutar checks en ese entorno, pero no impide implementar código estáticamente. npm test, npm run lint y npm run build sólo deben considerarse verificados cuando se hayan ejecutado realmente.
