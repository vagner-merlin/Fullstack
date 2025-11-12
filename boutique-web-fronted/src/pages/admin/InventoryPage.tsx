import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Search, Package, AlertTriangle, 
  MapPin, TrendingUp, TrendingDown, RefreshCw 
} from 'lucide-react';
import { 
  getAllInventario, 
  createInventario, 
  updateInventario, 
  deleteInventario,
  getAlertas,
  type Inventario, 
  type CreateInventarioData 
} from '../../services/admin/inventoryService';
import { getAllProducts, type AdminProduct } from '../../services/admin/productAdminService';
import { showToast } from '../../utils/toast';

export const InventoryPage = () => {
  const [inventario, setInventario] = useState<Inventario[]>([]);
  const [productos, setProductos] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Inventario | null>(null);
  const [alertas, setAlertas] = useState<{ stock_bajo: number; stock_alto: number }>({ 
    stock_bajo: 0, 
    stock_alto: 0 
  });
  
  const [formData, setFormData] = useState<CreateInventarioData>({
    cantidad_entradas: 0,
    stock_minimo: 0,
    stock_maximo: 0,
    ubicacion_almacen: '',
    Producto_id: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [inventarioData, productosData, alertasData] = await Promise.all([
        getAllInventario(),
        getAllProducts(),
        getAlertas()
      ]);
      
      setInventario(inventarioData);
      setProductos(productosData);
      setAlertas({
        stock_bajo: alertasData.stock_bajo.count,
        stock_alto: alertasData.stock_alto.count
      });
      
      console.log('📦 Inventario cargado:', inventarioData);
    } catch (error) {
      console.error('Error al cargar inventario:', error);
      showToast.error('Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.Producto_id) {
      showToast.error('Debe seleccionar un producto');
      return;
    }

    if (formData.stock_minimo > formData.stock_maximo) {
      showToast.error('El stock mínimo no puede ser mayor que el stock máximo');
      return;
    }

    try {
      if (editingItem) {
        await updateInventario(editingItem.id, formData);
        showToast.success('Inventario actualizado correctamente');
      } else {
        await createInventario(formData);
        showToast.success('Inventario creado correctamente');
      }
      loadData();
      closeModal();
    } catch (error) {
      console.error('Error al guardar inventario:', error);
      showToast.error('Error al guardar inventario');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este registro de inventario?')) return;

    try {
      await deleteInventario(id);
      showToast.success('Inventario eliminado correctamente');
      loadData();
    } catch (error) {
      console.error('Error al eliminar inventario:', error);
      showToast.error('Error al eliminar inventario');
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      cantidad_entradas: 0,
      stock_minimo: 0,
      stock_maximo: 0,
      ubicacion_almacen: '',
      Producto_id: 0,
    });
    setShowModal(true);
  };

  const openEditModal = (item: Inventario) => {
    setEditingItem(item);
    setFormData({
      cantidad_entradas: item.cantidad_entradas,
      stock_minimo: item.stock_minimo,
      stock_maximo: item.stock_maximo,
      ubicacion_almacen: item.ubicacion_almacen,
      Producto_id: item.Producto_id,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const getStockStatus = (item: Inventario) => {
    if (item.cantidad_entradas < item.stock_minimo) {
      return { status: 'bajo', color: 'text-red-600 bg-red-100', icon: TrendingDown };
    }
    if (item.cantidad_entradas > item.stock_maximo) {
      return { status: 'alto', color: 'text-orange-600 bg-orange-100', icon: TrendingUp };
    }
    return { status: 'normal', color: 'text-green-600 bg-green-100', icon: Package };
  };

  const getProductoNombre = (productoId: number) => {
    const producto = productos.find(p => p.id === productoId);
    return producto?.nombre || 'Producto no encontrado';
  };

  const filteredInventario = inventario.filter(item => {
    const productoNombre = getProductoNombre(item.Producto_id);
    return (
      productoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ubicacion_almacen.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Inventario</h1>
          <p className="text-gray-600 mt-1">Administra el stock y ubicación de productos</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Agregar Inventario
        </button>
      </div>

      {/* Alertas */}
      {(alertas.stock_bajo > 0 || alertas.stock_alto > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alertas.stock_bajo > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
            >
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Stock Bajo</h3>
                <p className="text-sm text-red-700">
                  {alertas.stock_bajo} producto{alertas.stock_bajo !== 1 ? 's' : ''} con stock por debajo del mínimo
                </p>
              </div>
            </motion.div>
          )}
          {alertas.stock_alto > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center gap-3"
            >
              <TrendingUp className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-900">Stock Alto</h3>
                <p className="text-sm text-orange-700">
                  {alertas.stock_alto} producto{alertas.stock_alto !== 1 ? 's' : ''} con stock por encima del máximo
                </p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por producto o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Actualizar
        </button>
      </div>

      {/* Inventario Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Mínimo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Máximo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Actualización
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventario.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'No se encontraron resultados' : 'No hay registros de inventario'}
                  </td>
                </tr>
              ) : (
                filteredInventario.map((item) => {
                  const stockStatus = getStockStatus(item);
                  const StatusIcon = stockStatus.icon;
                  
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-gray-400" />
                          <div className="text-sm font-medium text-gray-900">
                            {getProductoNombre(item.Producto_id)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {item.cantidad_entradas}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {item.stock_minimo}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {item.stock_maximo}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {item.ubicacion_almacen}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {stockStatus.status === 'bajo' && 'Stock Bajo'}
                          {stockStatus.status === 'alto' && 'Stock Alto'}
                          {stockStatus.status === 'normal' && 'Normal'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(item.ultima_actualizacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingItem ? 'Editar Inventario' : 'Agregar Inventario'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Producto *
                </label>
                <select
                  value={formData.Producto_id}
                  onChange={(e) => setFormData({ ...formData, Producto_id: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value={0}>Seleccionar producto</option>
                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad de Entradas *
                </label>
                <input
                  type="number"
                  value={formData.cantidad_entradas}
                  onChange={(e) => setFormData({ ...formData, cantidad_entradas: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="0"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Mínimo *
                  </label>
                  <input
                    type="number"
                    value={formData.stock_minimo}
                    onChange={(e) => setFormData({ ...formData, stock_minimo: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Máximo *
                  </label>
                  <input
                    type="number"
                    value={formData.stock_maximo}
                    onChange={(e) => setFormData({ ...formData, stock_maximo: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación de Almacén *
                </label>
                <input
                  type="text"
                  value={formData.ubicacion_almacen}
                  onChange={(e) => setFormData({ ...formData, ubicacion_almacen: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej: Pasillo A, Estante 3"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {editingItem ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
