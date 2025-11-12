# API de Inventario - Documentación

## Endpoints Disponibles

Base URL: `http://localhost:8000/api/productos/inventario/`

### 1. Listar todos los registros de inventario
```http
GET /api/productos/inventario/
Authorization: Token {tu_token}
```

**Respuesta:**
```json
{
  "success": true,
  "count": 10,
  "inventario": [
    {
      "id": 1,
      "cantidad_entradas": 100,
      "stock_minimo": 10,
      "stock_maximo": 200,
      "ubicacion_almacen": "Pasillo A, Estante 3",
      "ultima_actualizacion": "2025-11-11T10:30:00Z",
      "Producto_id": 5,
      "producto_info": {
        "id": 5,
        "nombre": "Camisa Blanca",
        "descripcion": "Camisa de algodón",
        "activo": true,
        "fecha_creacion": "2025-11-01T00:00:00Z",
        "peso": 0.5
      }
    }
  ]
}
```

### 2. Obtener un registro específico
```http
GET /api/productos/inventario/{id}/
Authorization: Token {tu_token}
```

### 3. Crear nuevo registro de inventario
```http
POST /api/productos/inventario/
Authorization: Token {tu_token}
Content-Type: application/json

{
  "cantidad_entradas": 100,
  "stock_minimo": 10,
  "stock_maximo": 200,
  "ubicacion_almacen": "Pasillo A, Estante 3",
  "Producto_id": 5
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Registro de inventario creado exitosamente",
  "inventario": {
    "id": 1,
    "cantidad_entradas": 100,
    "stock_minimo": 10,
    "stock_maximo": 200,
    "ubicacion_almacen": "Pasillo A, Estante 3",
    "ultima_actualizacion": "2025-11-11T10:30:00Z",
    "Producto_id": 5,
    "producto_info": { ... }
  }
}
```

### 4. Actualizar registro de inventario
```http
PATCH /api/productos/inventario/{id}/
Authorization: Token {tu_token}
Content-Type: application/json

{
  "cantidad_entradas": 150,
  "ubicacion_almacen": "Pasillo B, Estante 1"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Registro de inventario actualizado exitosamente",
  "inventario": { ... }
}
```

### 5. Eliminar registro de inventario
```http
DELETE /api/productos/inventario/{id}/
Authorization: Token {tu_token}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Registro de inventario eliminado exitosamente"
}
```

### 6. Obtener productos con stock bajo
```http
GET /api/productos/inventario/stock_bajo/
Authorization: Token {tu_token}
```

**Respuesta:**
```json
{
  "success": true,
  "count": 3,
  "inventario_bajo": [
    {
      "id": 1,
      "cantidad_entradas": 5,
      "stock_minimo": 10,
      "stock_maximo": 200,
      "ubicacion_almacen": "Pasillo A, Estante 3",
      "ultima_actualizacion": "2025-11-11T10:30:00Z",
      "Producto_id": 5,
      "producto_info": { ... }
    }
  ]
}
```

### 7. Obtener alertas de inventario
```http
GET /api/productos/inventario/alertas/
Authorization: Token {tu_token}
```

**Respuesta:**
```json
{
  "success": true,
  "alertas": {
    "stock_bajo": {
      "count": 3,
      "items": [ ... ]
    },
    "stock_alto": {
      "count": 2,
      "items": [ ... ]
    }
  }
}
```

## Filtros Disponibles

### Filtrar por producto
```http
GET /api/productos/inventario/?producto=5
```

### Filtrar por ubicación
```http
GET /api/productos/inventario/?ubicacion=Pasillo A
```

### Filtrar por stock bajo
```http
GET /api/productos/inventario/?stock_bajo=true
```

## Validaciones

- `cantidad_entradas`: debe ser >= 0
- `stock_minimo`: debe ser >= 0
- `stock_maximo`: debe ser >= 0
- `stock_minimo` no puede ser mayor que `stock_maximo`
- `ubicacion_almacen`: campo obligatorio
- `Producto_id`: debe ser un ID válido de un producto existente

## Frontend - Página de Inventario

### URL de acceso
```
http://localhost:5173/admin/inventory
```

### Funcionalidades implementadas

1. **Tabla de inventario**
   - Muestra todos los registros con información del producto
   - Columnas: Producto, Stock Actual, Stock Mínimo, Stock Máximo, Ubicación, Estado, Última Actualización, Acciones

2. **Búsqueda**
   - Por nombre de producto
   - Por ubicación de almacén

3. **Alertas visuales**
   - Muestra cantidad de productos con stock bajo
   - Muestra cantidad de productos con stock alto
   - Indicadores de color en la tabla (rojo=bajo, naranja=alto, verde=normal)

4. **Modal de creación/edición**
   - Formulario completo con validaciones
   - Selector de producto
   - Campos numéricos para cantidades y stocks
   - Campo de ubicación

5. **Acciones CRUD**
   - Crear nuevo registro de inventario
   - Editar registro existente
   - Eliminar registro
   - Botón de actualización/refresh

6. **Estados visuales**
   - Indicador de stock bajo (rojo)
   - Indicador de stock alto (naranja)
   - Indicador de stock normal (verde)

## Archivos creados/modificados

### Backend
- `app_productos/serializers.py` - Agregado `InventarioSerializer`
- `app_productos/api.py` - Agregado `InventarioViewSet`
- `app_productos/urls.py` - Agregada ruta `/inventario/`

### Frontend
- `src/services/admin/inventoryService.ts` - Servicio completo para API de inventario
- `src/pages/admin/InventoryPage.tsx` - Página completa con tabla CRUD
- `src/router/AppRouter.tsx` - Agregada ruta `/admin/inventory`
- `src/components/admin/AdminLayout.tsx` - Ya incluía el ítem de navegación "Inventario"

## Próximos pasos para probar

1. Asegúrate de que el backend esté corriendo:
   ```bash
   python manage.py runserver
   ```

2. Asegúrate de que el frontend esté corriendo:
   ```bash
   npm run dev
   ```

3. Inicia sesión como admin en el frontend

4. Ve a la sección "Inventario" en el panel de administración

5. Prueba crear, editar y eliminar registros de inventario
