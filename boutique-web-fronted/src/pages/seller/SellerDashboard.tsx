import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  Trash2,
  DollarSign,
  RefreshCw,
  Tag,
  Grid3X3
} from 'lucide-react';
import { showToast } from '../../utils/toast';
import { getAllVariants, type ProductVariant } from '../../services/admin/variantService';
import { getAllProducts, type AdminProduct } from '../../services/admin/productAdminService';
import { getAllCategories, type Category } from '../../services/admin/categoryService';

interface CartItem {
  id: number;
  variant: ProductVariant;
  quantity: number;
  price: number;
}

export const SellerDashboard = () => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredVariants, setFilteredVariants] = useState<ProductVariant[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterVariants();
  }, [searchTerm, selectedCategory, variants]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [variantsData, productsData, categoriesData] = await Promise.all([
        getAllVariants(),
        getAllProducts(),
        getAllCategories()
      ]);
      setVariants(variantsData);
      setProducts(productsData);
      setCategories(categoriesData);
      setFilteredVariants(variantsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      showToast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const filterVariants = () => {
    let filtered = variants;

    if (searchTerm) {
      filtered = filtered.filter(variant => 
        variant.producto_info?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variant.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variant.talla.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory > 0) {
      filtered = filtered.filter(variant => variant.categoria === selectedCategory);
    }

    setFilteredVariants(filtered);
  };

  const addToCart = (variant: ProductVariant) => {
    const existingItem = cart.find(item => item.variant.id === variant.id);
    
    if (existingItem) {
      if (existingItem.quantity >= variant.stock) {
        showToast.error(`Stock insuficiente. Máximo disponible: ${variant.stock}`);
        return;
      }
      setCart(cart.map(item => 
        item.variant.id === variant.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      if (variant.stock <= 0) {
        showToast.error('Producto sin stock disponible');
        return;
      }
      setCart([...cart, {
        id: Date.now(),
        variant: variant,
        quantity: 1,
        price: parseFloat(variant.precio_unitario)
      }]);
    }
    
    showToast.success(`${variant.producto_info?.nombre} - ${variant.color}/${variant.talla} agregado al carrito`);
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    const item = cart.find(i => i.id === itemId);
    if (item && newQuantity > item.variant.stock) {
      showToast.error(`Stock insuficiente. Máximo disponible: ${item.variant.stock}`);
      return;
    }

    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(item => item.id !== itemId));
    showToast.success('Producto eliminado del carrito');
  };

  const clearCart = () => {
    setCart([]);
    showToast.success('Carrito limpiado');
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getProductName = (variant: ProductVariant) => {
    return variant.producto_info?.nombre || `Producto #${variant.producto}`;
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.nombre || 'Sin categoría';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Empleado</h1>
          <p className="text-gray-600 mt-1">Gestiona productos, categorías y ventas</p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Actualizar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Productos</p>
              <p className="text-3xl font-bold mt-2">{products.length}</p>
            </div>
            <Package className="h-10 w-10 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Variantes</p>
              <p className="text-3xl font-bold mt-2">{variants.length}</p>
            </div>
            <Grid3X3 className="h-10 w-10 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Categorías</p>
              <p className="text-3xl font-bold mt-2">{categories.length}</p>
            </div>
            <Tag className="h-10 w-10 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Total Carrito</p>
              <p className="text-3xl font-bold mt-2">${getTotalPrice().toFixed(2)}</p>
            </div>
            <DollarSign className="h-10 w-10 text-orange-200" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Productos y Variantes</h2>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar productos, color, talla..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {filteredVariants.map((variant) => (
                <motion.div
                  key={variant.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{getProductName(variant)}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {variant.color}
                        </span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {variant.talla}
                        </span>
                        {variant.capacidad && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            {variant.capacidad}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{getCategoryName(variant.categoria)}</p>
                      <p className="text-lg font-bold text-blue-600 mt-2">${variant.precio_unitario}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">Stock: {variant.stock}</span>
                        <span className={`text-xs font-medium ${
                          variant.stock > 10 ? 'text-green-600' : 
                          variant.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {variant.stock > 10 ? 'Disponible' : 
                           variant.stock > 0 ? 'Poco stock' : 'Sin stock'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => addToCart(variant)}
                        disabled={variant.stock <= 0}
                        className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredVariants.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No se encontraron productos</p>
              </div>
            )}
          </div>
        </div>

        {/* Cart Section */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Carrito de Venta ({getTotalItems()})
              </h2>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Limpiar Todo
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {getProductName(item.variant)}
                    </h4>
                    <div className="flex gap-1 mt-1">
                      <span className="text-xs bg-gray-100 text-gray-700 px-1 py-0.5 rounded">
                        {item.variant.color}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-700 px-1 py-0.5 rounded">
                        {item.variant.talla}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">${item.price.toFixed(2)} c/u</p>
                    <p className="text-xs font-medium text-blue-600">
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 hover:bg-red-100 rounded text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {cart.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Carrito vacío</p>
                <p className="text-sm">Agrega productos para comenzar una venta</p>
              </div>
            )}

            {cart.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Items:</span>
                    <span>{getTotalItems()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
                <button
                  className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  onClick={() => showToast.info('Funcionalidad de venta en desarrollo')}
                >
                  Procesar Venta
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen Rápido</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Productos base:</span>
                <span className="font-medium">{products.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Variantes totales:</span>
                <span className="font-medium">{variants.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Categorías:</span>
                <span className="font-medium">{categories.length}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-600">Stock total:</span>
                <span className="font-medium">
                  {variants.reduce((total, v) => total + v.stock, 0)} unidades
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};