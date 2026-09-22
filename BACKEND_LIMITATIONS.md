# Limitaciones conocidas de integración con el backend

## 23 de septiembre de 2026

El frontend se implementa con el contrato real de [`BACKEND_API.md`](./BACKEND_API.md), sin clonar ni modificar el repositorio backend. Los servicios tipados consumen autenticación, catálogo, categorías, marcas, carrito, pedidos y cuenta mediante cookies de sesión (`credentials: 'include'`). En desarrollo, Vite reenvía `/api` a `http://localhost:3000` para evitar el problema de CORS documentado por el backend.

## Pago Stripe pendiente de integración del navegador

`POST /orders/checkout` está disponible en el servicio tipado: bloquea el carrito y devuelve un `clientSecret` de Stripe. Sin embargo, el contrato no proporciona una clave publicable de Stripe, ni describe el SDK o el flujo de confirmación que debe ejecutar el navegador. Por tanto, el frontend **no puede confirmar correctamente el pago** ni mostrar un pedido como exitoso sin inventar una integración. La pantalla de checkout comunica esta limitación y no inicia un pedido pendiente que no puede cobrar ni confirmar; tampoco simula pagos exitosos.

## Capacidades no expuestas por la API

No se implementan controles que aparenten llamadas al servidor para búsqueda, paginación, filtros u ordenación de productos, imágenes, reseñas, favoritos, cupones, direcciones/envíos, cancelación/reintento de pedidos ni webhook de Stripe, porque el contrato no ofrece dichos endpoints. El catálogo permite navegación por categorías mediante `GET /categories/:id/products`, que sí está documentado.

Para despliegues con frontend y backend en orígenes distintos, el backend necesitará configurar CORS o compartir origen; el proxy de Vite solo resuelve el desarrollo local.
