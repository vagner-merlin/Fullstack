// Service para productos - Conectado al backend Django

// Interfaces para los datos que vienen del backend
export interface BackendImage {
  id: number;
  imagen: string;
  imagen_url: string;
  texto: string;
  es_principal: boolean;
  Producto_categoria: number;
}

export interface BackendVariant {
  id: number;
  producto: number;
  categoria: number;
  color: string;
  talla: string;
  capacidad: string;
  precio_variante: string;
  precio_unitario: string;
  stock: number;
  fecha_creacion: string;
  producto_info: {
    id: number;
    nombre: string;
    descripcion: string;
    activo: boolean;
    fecha_creacion: string;
    peso: string;
  };
  categoria_info: {
    id: number;
    nombre: string;
    descripcion: string;
    activo: boolean;
  };
  imagenes: BackendImage[];
  imagen_principal: BackendImage;
}

export interface BackendCategory {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface BackendProduct {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fecha_creacion: string;
  peso: string;
  variantes: BackendVariant[];
  categorias: BackendCategory[];
}

export interface BackendResponse {
  success: boolean;
  count: number;
  productos: BackendProduct[];
}

// Interface para el frontend
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount?: number;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isFeatured?: boolean;
  // Información adicional del backend
  backendData?: BackendProduct;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  search?: string;
  featured?: boolean;
  new?: boolean;
  page?: number;
  limit?: number;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Imagen placeholder SVG como data URL
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="%23999" text-anchor="middle" dy=".3em" font-family="Arial"%3EImagen no disponible%3C/text%3E%3C/svg%3E';

export const productService = {
  // Obtener productos desde Django
  getProducts: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    try {
      console.log('🌐 ProductService: Iniciando llamada a API');
      console.log('🔗 URL completa:', `${API_URL}/api/productos/productos`);
      console.log('📊 Filtros aplicados:', filters);
      
      const response = await fetch(`${API_URL}/api/productos/productos`, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      console.log('📡 Respuesta del servidor:', {
        RESPONSE:response,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url
      });
      
      if (!response.ok) {
        console.error('❌ Error en respuesta del servidor:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      let data;
      try {
        data = await response.json();
        console.log('📦 Datos recibidos del backend:', data);
        console.log('📋 Tipo de datos:', typeof data);
        console.log('🔑 Propiedades disponibles:', Object.keys(data));
      } catch (jsonError) {
        console.error('❌ Error al parsear JSON:', jsonError);
        const text = await response.text();
        console.error('📄 Contenido de respuesta:', text);
        throw new Error('Respuesta del servidor no es JSON válido');
      }
      
      // El backend retorna { success: true, count: X, productos: [...] }
      const backendData = data as BackendResponse;
      const productosBackend = backendData.productos || [];
      
      // Mapear productos del backend al formato del frontend
      const products: Product[] = productosBackend.map((prod: BackendProduct) => {
        console.log('🔍 Mapeando producto:', prod.nombre, prod);
        
        // Obtener la primera variante para obtener precio e imágenes
        const primeraVariante = prod.variantes && prod.variantes.length > 0 ? prod.variantes[0] : null;
        
        // Obtener todas las imágenes de todas las variantes
        const todasImagenes: string[] = [];
        if (prod.variantes) {
          prod.variantes.forEach((variante: BackendVariant) => {
            console.log('  🔍 Variante:', variante.color, variante.talla);
            
            // Agregar imagen principal si existe
            if (variante.imagen_principal) {
              console.log('    � Imagen principal:', variante.imagen_principal);
              const urlImagenPrincipal = variante.imagen_principal.imagen_url || variante.imagen_principal.imagen;
              if (urlImagenPrincipal && !todasImagenes.includes(urlImagenPrincipal)) {
                todasImagenes.unshift(urlImagenPrincipal); // Agregar al inicio
                console.log('      ✅ Imagen principal agregada al inicio:', urlImagenPrincipal);
              }
            }
            
            // Agregar imágenes adicionales si existen
            if (variante.imagenes && Array.isArray(variante.imagenes)) {
              console.log('    📸 Imágenes de variante:', variante.imagenes.length);
              variante.imagenes.forEach((img: BackendImage) => {
                console.log('      🖼️ Imagen individual:', img.texto);
                // Priorizar imagen_url (desde S3), si no existe usar imagen
                const urlImagen = img.imagen_url || img.imagen;
                if (urlImagen && !todasImagenes.includes(urlImagen)) {
                  todasImagenes.push(urlImagen);
                  console.log('        ✅ URL agregada:', urlImagen);
                }
              });
            }
          });
        }
        
        console.log('  📸 Total imágenes encontradas:', todasImagenes.length, todasImagenes);
        
        // Obtener colores y tallas únicos
        const colores = prod.variantes 
          ? [...new Set(prod.variantes.map((v: BackendVariant) => v.color).filter(Boolean))] as string[]
          : [];
        const tallas = prod.variantes 
          ? [...new Set(prod.variantes.map((v: BackendVariant) => v.talla).filter(Boolean))] as string[]
          : [];
        
        // Calcular stock total
        const stockTotal = prod.variantes 
          ? prod.variantes.reduce((sum: number, v: BackendVariant) => sum + (v.stock || 0), 0)
          : 0;
        
        // Obtener categoría
        const categoria = prod.categorias && prod.categorias.length > 0 
          ? prod.categorias[0].nombre 
          : 'Sin categoría';
        
        // Verificar si es nuevo (creado en los últimos 30 días)
        const fechaCreacion = new Date(prod.fecha_creacion);
        const ahora = new Date();
        const diasDiferencia = Math.floor((ahora.getTime() - fechaCreacion.getTime()) / (1000 * 3600 * 24));
        const esNuevo = diasDiferencia <= 30;
        
        // IMPORTANTE: Usar el ID de la primera variante para la navegación
        const variantId = primeraVariante ? primeraVariante.id : prod.id;
        
        return {
          id: variantId, // Usar ID de variante para que funcione la navegación
          name: prod.nombre,
          description: prod.descripcion || '',
          price: primeraVariante ? parseFloat(primeraVariante.precio_unitario) : 0,
          discount: 0, // El backend no tiene descuento por ahora
          category: categoria,
          images: todasImagenes.length > 0 ? todasImagenes : [PLACEHOLDER_IMAGE],
          sizes: tallas,
          colors: colores,
          stock: stockTotal,
          rating: 4.5, // Por ahora fijo, se puede calcular desde reseñas
          reviews: Math.floor(Math.random() * 50) + 1, // Random por ahora
          isNew: esNuevo,
          isFeatured: false,
          backendData: prod // Guardar datos originales para el modal
        };
      });
      
      console.log('✅ Productos mapeados:', products);
      
      return {
        products: products,
        total: products.length,
        page: filters.page || 1,
        totalPages: Math.ceil(products.length / (filters.limit || 12)),
      };
    } catch (error) {
      console.error('❌ Error en getProducts:', error);
      
      if (error instanceof Error) {
        console.error('🔍 Tipo de error:', error.constructor.name);
        console.error('💬 Mensaje de error:', error.message);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.error('🌐 Error de conexión: Verificar que el servidor Django esté corriendo en ' + API_URL);
        }
      }
      
      // Retornar respuesta vacía en caso de error
      return {
        products: [],
        total: 0,
        page: 1,
        totalPages: 1,
      };
    }
  },

  // Obtener producto por ID
  getProductById: async (id: number): Promise<Product | null> => {
    try {
      console.log(`🔍 ProductService: Buscando producto con ID: ${id}`);
      console.log(`🔗 URL: ${API_URL}/api/productos/productos/${id}/`);
      
      const response = await fetch(`${API_URL}/api/productos/productos/${id}/`, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      console.log(`📡 Respuesta recibida:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });
      
      if (!response.ok) {
        console.error(`❌ Producto no encontrado (${response.status}):`, id);
        const errorText = await response.text();
        console.error('📄 Contenido del error:', errorText);
        return null;
      }
      
      const data = await response.json();
      console.log('📦 Producto individual recibido:', data);
      
      // El backend retorna { success: true, producto: {...} }
      const prod = data.producto || data;
      
      console.log('🔍 Estructura del producto:', {
        id: prod.id,
        nombre: prod.nombre,
        variantes: prod.variantes?.length || 0,
        categorias: prod.categorias?.length || 0,
      });
      
      if (!prod.variantes || prod.variantes.length === 0) {
        console.warn('⚠️ El producto no tiene variantes');
      }
      
      // Obtener la primera variante para obtener precio e imágenes
      const primeraVariante = prod.variantes && prod.variantes.length > 0 ? prod.variantes[0] : null;
      
      // Obtener todas las imágenes de todas las variantes
      const todasImagenes: string[] = [];
      if (prod.variantes) {
        prod.variantes.forEach((variante: any, idx: number) => {
          console.log(`  🎨 Variante ${idx + 1}:`, {
            color: variante.color,
            talla: variante.talla,
            precio: variante.precio_unitario,
            stock: variante.stock,
            imagenes: variante.imagenes?.length || 0,
          });
          
          if (variante.imagenes && Array.isArray(variante.imagenes)) {
            variante.imagenes.forEach((img: any) => {
              // Priorizar imagen_url (desde S3), si no existe usar imagen
              const urlImagen = img.imagen_url || img.imagen;
              if (urlImagen) {
                todasImagenes.push(urlImagen);
              }
            });
          }
          
          // También verificar si hay imagen_principal
          if (variante.imagen_principal) {
            const urlImagenPrincipal = variante.imagen_principal.imagen_url || variante.imagen_principal.imagen;
            if (urlImagenPrincipal && !todasImagenes.includes(urlImagenPrincipal)) {
              todasImagenes.unshift(urlImagenPrincipal); // Agregar al inicio
            }
          }
        });
      }
      
      console.log(`📸 Total imágenes encontradas: ${todasImagenes.length}`);
      
      // Obtener colores y tallas únicos
      const colores = prod.variantes 
        ? [...new Set(prod.variantes.map((v: any) => v.color).filter(Boolean))] as string[]
        : [];
      const tallas = prod.variantes 
        ? [...new Set(prod.variantes.map((v: any) => v.talla).filter(Boolean))] as string[]
        : [];
      
      // Calcular stock total
      const stockTotal = prod.variantes 
        ? prod.variantes.reduce((sum: number, v: any) => sum + (v.stock || 0), 0)
        : 0;
      
      // Obtener categoría
      const categoria = prod.categorias && prod.categorias.length > 0 
        ? prod.categorias[0].nombre 
        : 'Sin categoría';
      
      const resultado = {
        id: prod.id,
        name: prod.nombre,
        description: prod.descripcion || '',
        price: primeraVariante ? primeraVariante.precio_unitario : 0,
        discount: 0,
        category: categoria,
        images: todasImagenes.length > 0 ? todasImagenes : [PLACEHOLDER_IMAGE],
        sizes: tallas,
        colors: colores,
        stock: stockTotal,
        rating: 4.5,
        reviews: 0,
        isNew: false,
        isFeatured: false,
      };
      
      console.log('✅ Producto mapeado:', resultado);
      return resultado;
    } catch (error) {
      console.error('❌ Error en getProductById:', error);
      if (error instanceof Error) {
        console.error('💬 Mensaje:', error.message);
        console.error('📍 Stack:', error.stack);
      }
      return null;
    }
  },

  // Obtener productos destacados
  getFeaturedProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_URL}/api/productos/productos/?es_destacado=true`, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) return [];
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error en getFeaturedProducts:', error);
      return [];
    }
  },

  // Obtener productos nuevos
  getNewProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_URL}/api/productos/productos/?es_nuevo=true`, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) return [];
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error en getNewProducts:', error);
      return [];
    }
  },

  // Buscar productos
  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_URL}/api/productos/productos/?search=${query}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) return [];
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error en searchProducts:', error);
      return [];
    }
  },

  // Obtener categorías disponibles
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await fetch(`${API_URL}/api/productos/categorias/`, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) return [];
      
      const data = await response.json();
      console.log('📦 Categorías recibidas:', data);
      
      // El backend retorna { success: true, count: X, categorias: [...] }
      const categorias = data.categorias || [];
      
      // Extraer nombres de categorías
      if (Array.isArray(categorias)) {
        return categorias.map((cat: any) => cat.nombre || cat.name);
      }
      return [];
    } catch (error) {
      console.error('Error en getCategories:', error);
      return [];
    }
  },

  // Obtener variante específica por ID (ProductoCategoria)
  getVariantById: async (variantId: number): Promise<BackendVariant | null> => {
    try {
      console.log(`🔍 ProductService: Buscando variante con ID: ${variantId}`);
      console.log(`🔗 URL: ${API_URL}/api/productos/variantes/${variantId}/`);
      
      const response = await fetch(`${API_URL}/api/productos/variantes/${variantId}/`, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      console.log(`📡 Respuesta recibida:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });
      
      if (!response.ok) {
        console.error(`❌ Variante no encontrada (${response.status}):`, variantId);
        const errorText = await response.text();
        console.error('📄 Contenido del error:', errorText);
        return null;
      }
      
      const data: BackendVariant = await response.json();
      console.log('✅ Variante recibida:', data);
      console.log('📦 Estructura:', {
        id: data.id,
        producto_info: data.producto_info?.nombre,
        categoria_info: data.categoria_info?.nombre,
        color: data.color,
        talla: data.talla,
        precio: data.precio_unitario,
        stock: data.stock,
        imagenes: data.imagenes?.length || 0,
        imagen_principal: data.imagen_principal ? 'Sí' : 'No',
      });
      
      return data;
    } catch (error) {
      console.error('❌ Error en getVariantById:', error);
      if (error instanceof Error) {
        console.error('💬 Mensaje:', error.message);
        console.error('📍 Stack:', error.stack);
      }
      return null;
    }
  },
};
