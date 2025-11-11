import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Package, Palette, Ruler, DollarSign, ShoppingCart } from 'lucide-react';
import {
  getAllVariants,
  createVariant,
  updateVariant,
  deleteVariant,
  type ProductVariant,
  type CreateVariantData
} from '../../services/admin/variantService';
import { getAllProducts, type AdminProduct } from '../../services/admin/productAdminService';
import { getAllCategories, type Category } from '../../services/admin/categoryService';
import { showToast } from '../../utils/toast';

export const VariantsPage = () => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [formData, setFormData] = useState<CreateVariantData>({
    producto: 0,
    categoria: 0,
    color: '',
    talla: '',
    capacidad: '',
    precio_variante: '0.00',
    precio_unitario: '0.00',
    stock: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

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
      console.log('🎨 Variantes cargadas:', variantsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      showToast.error('Error al cargar variantes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.producto || formData.producto === 0) {
      showToast.error('Debes seleccionar un producto');
      return;
    }

    if (!formData.categoria || formData.categoria === 0) {
      showToast.error('Debes seleccionar una categoría');
      return;
    }

    if (parseFloat(formData.precio_unitario) <= 0) {
      showToast.error('El precio unitario debe ser mayor a 0');
      return;
    }

    if (formData.stock < 0) {
      showToast.error('El stock no puede ser negativo');
      return;
    }

    try {
      if (editingVariant) {
        await updateVariant(editingVariant.id, formData);
        showToast.success('Variante actualizada correctamente');
      } else {
        await createVariant(formData);
        showToast.success('Variante creada correctamente');
      }
      loadData();
      closeModal();
    } catch (error) {
      console.error('Error al guardar variante:', error);
      showToast.error('Error al guardar variante');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta variante?')) return;
    try {
      await deleteVariant(id);
      showToast.success('Variante eliminada correctamente');
      loadData();
    } catch (error) {
      console.error('Error al eliminar variante:', error);
      showToast.error('Error al eliminar variante');
    }
  };

  const openCreateModal = () => {
    setEditingVariant(null);
    setFormData({
      producto: 0,
      categoria: 0,
      color: '',
      talla: '',
      capacidad: '',
      precio_variante: '0.00',
      precio_unitario: '0.00',
      stock: 0,
    });
    setShowModal(true);
  };

  const openEditModal = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setFormData({
      producto: variant.producto,
      categoria: variant.categoria,
      color: variant.color,
      talla: variant.talla,
      capacidad: variant.capacidad,
      precio_variante: variant.precio_variante,
      precio_unitario: variant.precio_unitario,
      stock: variant.stock,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVariant(null);
  };

  const getProductName = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product?.nombre || 'Producto no encontrado';
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.nombre || 'Categoría no encontrada';
  };

  const filteredVariants = variants.filter(v => {
    const searchLower = searchTerm.toLowerCase();
    const productName = getProductName(v.producto).toLowerCase();
    const categoryName = getCategoryName(v.categoria).toLowerCase();
    return (
      productName.includes(searchLower) ||
      categoryName.includes(searchLower) ||
      v.color.toLowerCase().includes(searchLower) ||
      v.talla.toLowerCase().includes(searchLower)
    );
  });

  const totalStock = variants.reduce((acc, v) => acc + v.stock, 0);
  const lowStockVariants = variants.filter(v => v.stock < 10).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Variantes de Productos</h2>
          <p className="text-gray-600 mt-1">Gestiona colores, tallas, precios y stock de productos</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5" />
          Nueva Variante
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Total Variantes</p>
              <p className="text-3xl font-bold mt-2">{variants.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Package className="h-8 w-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Stock Total</p>
              <p className="text-3xl font-bold mt-2">{totalStock}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <ShoppingCart className="h-8 w-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Stock Bajo</p>
              <p className="text-3xl font-bold mt-2">{lowStockVariants}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <ShoppingCart className="h-8 w-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Productos Base</p>
              <p className="text-3xl font-bold mt-2">{products.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Palette className="h-8 w-8" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar variantes por producto, categoría, color o talla..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Variants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVariants.map((variant) => (
          <motion.div
            key={variant.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">{getProductName(variant.producto)}</h3>
                <p className="text-sm text-gray-500">{getCategoryName(variant.categoria)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(variant)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(variant.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Color:</span>
                <span className="text-sm font-medium text-gray-900">{variant.color || 'N/A'}</span>
              </div>

              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Talla:</span>
                <span className="text-sm font-medium text-gray-900">{variant.talla || 'N/A'}</span>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Precio Unitario:</span>
                  <span className="text-lg font-bold text-indigo-600">Bs. {variant.precio_unitario}</span>
                </div>

                {parseFloat(variant.precio_variante) > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Precio Variante:</span>
                    <span className="text-sm font-medium text-gray-900">Bs. {variant.precio_variante}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Stock:</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    variant.stock < 10 ? 'bg-red-100 text-red-700' : 
                    variant.stock < 50 ? 'bg-amber-100 text-amber-700' : 
                    'bg-green-100 text-green-700'
                  }`}>
                    {variant.stock} unidades
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredVariants.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron variantes</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 my-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingVariant ? 'Editar Variante' : 'Nueva Variante'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Producto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Producto Base *
                  </label>
                  <select
                    value={formData.producto}
                    onChange={(e) => setFormData({ ...formData, producto: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value={0}>Seleccionar producto...</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value={0}>Seleccionar categoría...</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="relative">
                    <Palette className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Ej: Rojo, Azul..."
                    />
                  </div>
                </div>

                {/* Talla */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Talla
                  </label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.talla}
                      onChange={(e) => setFormData({ ...formData, talla: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Ej: S, M, L, XL..."
                    />
                  </div>
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock *
                  </label>
                  <div className="relative">
                    <ShoppingCart className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                {/* Precio Unitario */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Unitario (Bs.) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formData.precio_unitario}
                      onChange={(e) => setFormData({ ...formData, precio_unitario: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                {/* Precio Variante */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Variante (Bs.)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.precio_variante}
                      onChange={(e) => setFormData({ ...formData, precio_variante: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-indigo-800">
                  <strong>💡 Tip:</strong> El precio variante es un ajuste opcional sobre el precio unitario. Útil para variaciones especiales de color o diseño.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  {editingVariant ? 'Actualizar Variante' : 'Crear Variante'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
