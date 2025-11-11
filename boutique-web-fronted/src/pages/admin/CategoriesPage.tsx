import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Tag, Package, ChevronRight, FolderTree } from 'lucide-react';
import { getAllCategories, createCategory, updateCategory, deleteCategory, type Category } from '../../services/admin/categoryService';
import { getAllProducts, type AdminProduct } from '../../services/admin/productAdminService';
import { showToast } from '../../utils/toast';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    activo: true,
    id_padre: null as number | null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, productsData] = await Promise.all([
        getAllCategories(),
        getAllProducts()
      ]);
      setCategories(categoriesData);
      setProducts(productsData);
      console.log('📦 Categorías cargadas:', categoriesData);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      showToast.error('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const getProductCount = (categoryId: number) => {
    return products.filter(p => p.categoria_id === categoryId).length;
  };

  // Obtener subcategorías de una categoría
  const getSubcategories = (parentId: number) => {
    return categories.filter(c => c.id_padre === parentId);
  };

  // Obtener categorías principales (sin padre)
  const getMainCategoriesLocal = () => {
    return categories.filter(c => !c.id_padre);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      showToast.error('El nombre es obligatorio');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        showToast.success('Categoría actualizada correctamente');
      } else {
        await createCategory(formData);
        showToast.success('Categoría creada correctamente');
      }
      loadData();
      closeModal();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      showToast.error('Error al guardar categoría');
    }
  };

  const handleDelete = async (id: number) => {
    const productCount = getProductCount(id);
    const subcategoriesCount = getSubcategories(id).length;

    if (subcategoriesCount > 0) {
      showToast.error(`No se puede eliminar. Esta categoría tiene ${subcategoriesCount} subcategoría(s)`);
      return;
    }

    if (productCount > 0) {
      showToast.error(`No se puede eliminar. Hay ${productCount} producto(s) en esta categoría`);
      return;
    }

    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;

    try {
      await deleteCategory(id);
      showToast.success('Categoría eliminada correctamente');
      loadData();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      showToast.error('Error al eliminar categoría');
    }
  };

  const openCreateModal = (parentId: number | null = null) => {
    setEditingCategory(null);
    setFormData({ 
      nombre: '', 
      descripcion: '', 
      activo: true,
      id_padre: parentId 
    });
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({ 
      nombre: category.nombre, 
      descripcion: category.descripcion || '',
      activo: category.activo,
      id_padre: category.id_padre 
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  // Filtrar categorías principales que coincidan con la búsqueda
  const mainCategories = getMainCategoriesLocal().filter(c =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Categorías</h2>
          <p className="text-gray-600 mt-1">Gestiona las categorías de productos (soporta subcategorías)</p>
        </div>
        <button
          onClick={() => openCreateModal(null)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5" />
          Nueva Categoría Principal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Categorías</p>
              <p className="text-3xl font-bold mt-2">{categories.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Tag className="h-8 w-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Principales</p>
              <p className="text-3xl font-bold mt-2">{mainCategories.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FolderTree className="h-8 w-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Subcategorías</p>
              <p className="text-3xl font-bold mt-2">{categories.length - getMainCategoriesLocal().length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <ChevronRight className="h-8 w-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Productos</p>
              <p className="text-3xl font-bold mt-2">{products.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Package className="h-8 w-8" />
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
            placeholder="Buscar categorías..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories Hierarchy Grid */}
      <div className="space-y-6">
        {mainCategories.map((mainCategory) => {
          const subcategories = getSubcategories(mainCategory.id);
          const mainProductCount = getProductCount(mainCategory.id);

          return (
            <div key={mainCategory.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {/* Categoría Principal */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-lg">
                    <FolderTree className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-xl">{mainCategory.nombre}</h3>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                        Principal
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{mainCategory.descripcion || 'Sin descripción'}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        {mainProductCount} productos
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <ChevronRight className="h-4 w-4" />
                        {subcategories.length} subcategorías
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openCreateModal(mainCategory.id)}
                    className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Subcategoría
                  </button>
                  <button
                    onClick={() => openEditModal(mainCategory)}
                    className="px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(mainCategory.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    disabled={mainProductCount > 0 || subcategories.length > 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Subcategorías */}
              {subcategories.length > 0 && (
                <div className="ml-12 mt-4 space-y-3 border-l-2 border-gray-200 pl-6">
                  {subcategories.map((subCategory) => {
                    const subProductCount = getProductCount(subCategory.id);
                    return (
                      <div
                        key={subCategory.id}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="bg-indigo-100 p-2 rounded-lg">
                              <Tag className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-gray-900">{subCategory.nombre}</h4>
                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                                  Sub
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm">{subCategory.descripcion || 'Sin descripción'}</p>
                              <span className="text-xs text-gray-500 mt-1 inline-flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                {subProductCount} productos
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(subCategory)}
                              className="px-2 py-1.5 bg-white text-purple-600 rounded hover:bg-purple-50 transition-colors text-sm"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(subCategory.id)}
                              className="px-2 py-1.5 bg-white text-red-600 rounded hover:bg-red-50 transition-colors text-sm"
                              disabled={subProductCount > 0}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {getMainCategoriesLocal().length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <FolderTree className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No hay categorías creadas</p>
          <button
            onClick={() => openCreateModal(null)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Crear primera categoría
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Mostrar categoría padre si es una subcategoría */}
              {formData.id_padre && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                  <p className="text-sm text-indigo-700 flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    <span>
                      Subcategoría de: <strong>{categories.find(c => c.id === formData.id_padre)?.nombre}</strong>
                    </span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                  placeholder="Ej: Vestidos, Blusas, Pantalones"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Descripción de la categoría"
                />
              </div>

              {/* Solo mostrar selector de categoría padre si NO estamos editando y NO se ha seleccionado un padre previamente */}
              {!editingCategory && !formData.id_padre && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría Padre (opcional)
                  </label>
                  <select
                    value={formData.id_padre || ''}
                    onChange={(e) => setFormData({ ...formData, id_padre: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Sin categoría padre (Principal)</option>
                    {getMainCategoriesLocal().map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Deja en blanco para crear una categoría principal
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="activo" className="text-sm text-gray-700">
                  Categoría activa
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  {editingCategory ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
