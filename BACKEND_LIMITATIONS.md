# Limitaciones conocidas de integración con el backend

## 23 de septiembre de 2026

El frontend se implementa con el contrato real de [`BACKEND_API.md`](./BACKEND_API.md), sin clonar ni modificar el repositorio backend. Los servicios tipados consumen autenticación, catálogo, categorías, marcas, carrito, pedidos y cuenta mediante cookies de sesión (`credentials: 'include'`). En desarrollo, Vite reenvía `/api` a `http://localhost:3000` para evitar el problema de CORS documentado por el backend.

## Integración Stripe del navegador

`POST /orders/checkout` está disponible en el servicio tipado: bloquea el carrito y devuelve un `clientSecret` de Stripe. La investigación del contrato confirma que el siguiente paso debe ser una confirmación del `PaymentIntent` en el navegador mediante el SDK oficial de Stripe y su Payment Element; el webhook del backend es el único mecanismo que confirma o cancela finalmente el pedido. El frontend nunca debe invocar `POST /payments/webhook`.

La integración usa la clave **publicable** del entorno (`VITE_STRIPE_PUBLISHABLE_KEY`, de tipo `pk_...`) y las dependencias oficiales del SDK de navegador (`@stripe/stripe-js` y `@stripe/react-stripe-js`). No se ha incluido ni se solicita `STRIPE_SECRET_KEY`: esa clave sólo corresponde al backend. Si la clave publicable no está configurada, el checkout presenta un error de configuración y no llama a `/orders/checkout`, porque hacerlo bloquearía el carrito y crearía un pedido pendiente que no puede confirmarse desde esa instancia. No se simula un pago exitoso.

El contrato tampoco ofrece un endpoint para consultar el estado de un `PaymentIntent` ni un endpoint de reintento. Tras incorporar el Payment Element, la UI debe dirigir al detalle del pedido y reflejar el estado que devuelva `GET /orders/:id`; el webhook seguirá siendo quien cambie el estado definitivo.

## Capacidades no expuestas por la API

No se implementan controles que aparenten llamadas al servidor para búsqueda, paginación, filtros u ordenación de productos, imágenes, reseñas, favoritos, cupones, direcciones/envíos, cancelación/reintento de pedidos ni webhook de Stripe, porque el contrato no ofrece dichos endpoints. El catálogo permite navegación por categorías mediante `GET /categories/:id/products`, que sí está documentado.

Para despliegues con frontend y backend en orígenes distintos, el backend necesitará configurar CORS o compartir origen; el proxy de Vite solo resuelve el desarrollo local.
