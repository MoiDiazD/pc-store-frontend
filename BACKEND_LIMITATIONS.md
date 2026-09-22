# Estado de integración con el backend

## 22 de septiembre de 2026

La implementación del frontend debe basarse estrictamente en el repositorio
`MoiDiazD/pc-store`. Antes de crear endpoints o modelos de dominio se intentó
clonar dicho repositorio con:

```sh
git clone --depth 1 https://github.com/MoiDiazD/pc-store.git /tmp/pc-store-backend
```

La red del entorno devolvió `CONNECT tunnel failed, response 403`. Un intento
adicional de abrir el repositorio con el navegador disponible devolvió `401
Unauthorized`.

Por ello no fue posible verificar controllers, DTOs, rutas, respuestas,
autenticación por sesión, roles, carrito, pedidos ni Stripe. Para no incumplir
el contrato indicado, esta primera fase solo incorpora la base del frontend y
un transporte HTTP centralizado que envía cookies con `credentials: 'include'`.
No se han creado servicios de producto, autenticación, carrito, checkout ni
pedidos, ya que sus rutas y cuerpos no se pueden inferir sin inventar API.

Cuando el backend sea accesible, el siguiente paso es inspeccionarlo y añadir
los servicios tipados por funcionalidad a partir de sus contratos reales.
