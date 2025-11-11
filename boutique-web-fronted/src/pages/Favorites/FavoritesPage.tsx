import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites';
import { useCart } from '../../hooks/useCart';
import type { Favorite } from '../../services/favoriteService';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, loading, removeFromFavorites } = useFavorites();
  const { addItem } = useCart();

  const handleRemove = async (productId: number, productName: string) => {
    if (window.confirm(`¿Eliminar "${productName}" de favoritos?`)) {
      try {
        await removeFromFavorites(productId);
      } catch (error) {
        console.error('Error al eliminar favorito:', error);
      }
    }
  };

  const handleAddToCart = (favorite: Favorite) => {
    addItem({
      id: favorite.product.id,
      producto_id: favorite.product.id,
      nombre: favorite.product.nombre,
      precio: favorite.product.precio,
      cantidad: 1,
      imagen: favorite.product.imagen_principal,
      inventario_id: favorite.product.id, // Usar el ID del producto como inventario_id
      stock_disponible: favorite.product.stock_disponible,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-boutique-beige py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boutique-rose"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-boutique-beige py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-boutique-rose transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Volver</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-boutique-rose fill-boutique-rose" />
            <h1 className="text-3xl font-bold text-boutique-black font-raleway">
              Mis Favoritos
            </h1>
          </div>
          
          {favorites.length > 0 && (
            <p className="text-gray-600">
              {favorites.length} {favorites.length === 1 ? 'producto' : 'productos'} guardados
            </p>
          )}
        </motion.div>

        {/* Lista de favoritos */}
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm p-12 text-center"
          >
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-boutique-beige rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-boutique-rose" />
              </div>
              <h2 className="text-xl font-semibold text-boutique-black mb-2">
                No tienes favoritos aún
              </h2>
              <p className="text-gray-600 mb-6">
                Explora nuestra colección y guarda tus productos favoritos para encontrarlos fácilmente más tarde
              </p>
              <button
                onClick={() => navigate('/shop')}
                className="btn-primary"
              >
                Explorar productos
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((favorite: Favorite, index: number) => (
              <motion.div
                key={favorite.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
              >
                {/* Imagen del producto */}
                <div 
                  className="relative aspect-square bg-gray-100 cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/product/${favorite.product_id}`)}
                >
                  <img
                    src={favorite.product.imagen_principal}
                    alt={favorite.product.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Botón eliminar en hover */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(favorite.product_id, favorite.product.nombre);
                      }}
                      className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>

                  {/* Badge de sin stock */}
                  {favorite.product.stock_disponible === 0 && (
                    <div className="absolute top-3 left-3 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Sin stock
                    </div>
                  )}
                </div>

                {/* Info del producto */}
                <div className="p-4">
                  <h3 
                    className="font-medium text-boutique-black mb-2 line-clamp-2 cursor-pointer hover:text-boutique-rose transition-colors"
                    onClick={() => navigate(`/product/${favorite.product_id}`)}
                  >
                    {favorite.product.nombre}
                  </h3>
                  
                  {favorite.product.categoria && (
                    <p className="text-xs text-gray-500 mb-2 capitalize">
                      {favorite.product.categoria}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-boutique-rose">
                      Bs. {favorite.product.precio.toFixed(2)}
                    </span>
                  </div>

                  {/* Botón añadir al carrito */}
                  <button
                    onClick={() => handleAddToCart(favorite)}
                    disabled={favorite.product.stock_disponible === 0}
                    className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                      favorite.product.stock_disponible === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-boutique-rose text-white hover:bg-boutique-rose/90 hover:shadow-md'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {favorite.product.stock_disponible === 0 ? 'Sin stock' : 'Añadir al carrito'}
                    </span>
                  </button>
                </div>

                {/* Fecha añadido */}
                <div className="px-4 pb-3 pt-0 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Añadido el {new Date(favorite.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
