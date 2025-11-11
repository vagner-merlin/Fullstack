import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, Star, Loader, X } from 'lucide-react';
import addressService, { type SavedAddress, type CreateAddressData } from '../../services/addressService';

const DEPARTAMENTOS_BOLIVIA = [
  'La Paz',
  'Cochabamba',
  'Santa Cruz',
  'Oruro',
  'Potosí',
  'Chuquisaca',
  'Tarija',
  'Beni',
  'Pando'
];

const AddressesList = () => {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const [formData, setFormData] = useState<CreateAddressData>({
    nombre_completo: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    codigo_postal: '',
    referencias: '',
    es_principal: false,
    etiqueta: 'Casa',
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error('Error al cargar direcciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre_completo: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      departamento: '',
      codigo_postal: '',
      referencias: '',
      es_principal: false,
      etiqueta: 'Casa',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = async (id: number) => {
    const address = addresses.find(a => a.id === id);
    if (!address) return;

    setFormData({
      nombre_completo: address.nombre_completo,
      telefono: address.telefono,
      direccion: address.direccion,
      ciudad: address.ciudad,
      departamento: address.departamento,
      codigo_postal: address.codigo_postal,
      referencias: address.referencias,
      es_principal: address.es_principal,
      etiqueta: address.etiqueta || 'Casa',
    });
    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta dirección?')) return;

    setDeleting(id);
    try {
      await addressService.deleteAddress(id);
      await loadAddresses();
    } catch (error) {
      console.error('Error al eliminar dirección:', error);
      alert('Error al eliminar dirección');
    } finally {
      setDeleting(null);
    }
  };

  const handleSetPrincipal = async (id: number) => {
    try {
      await addressService.setPrincipalAddress(id);
      await loadAddresses();
    } catch (error) {
      console.error('Error al marcar como principal:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await addressService.updateAddress(editingId, formData);
      } else {
        await addressService.createAddress(formData);
      }
      await loadAddresses();
      resetForm();
    } catch (error) {
      console.error('Error al guardar dirección:', error);
      alert('Error al guardar dirección');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-boutique-black-matte"></div>
        <p className="font-poppins text-gray-600 mt-4">Cargando direcciones...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-boutique-rose-light to-boutique-beige rounded-lg">
            <MapPin size={24} className="text-boutique-black-matte" />
          </div>
          <h2 className="font-raleway text-2xl font-bold text-boutique-black-matte">
            Mis Direcciones
          </h2>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-boutique-black-matte text-white rounded-lg font-poppins font-semibold hover:bg-gray-800 transition-colors"
          >
            <Plus size={20} />
            Agregar
          </button>
        )}
      </div>

      {/* Formulario */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="mb-6 p-6 bg-gray-50 rounded-lg border-2 border-boutique-beige overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-raleway text-lg font-bold text-boutique-black-matte">
                {editingId ? 'Editar Dirección' : 'Nueva Dirección'}
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
                  Etiqueta
                </label>
                <select
                  name="etiqueta"
                  value={formData.etiqueta}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-poppins focus:ring-2 focus:ring-boutique-rose focus:border-transparent"
                >
                  <option value="Casa">🏠 Casa</option>
                  <option value="Trabajo">💼 Trabajo</option>
                  <option value="Otro">📍 Otro</option>
                </select>
              </div>

              <div>
                <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-poppins focus:ring-2 focus:ring-boutique-rose focus:border-transparent"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-poppins focus:ring-2 focus:ring-boutique-rose focus:border-transparent"
                  placeholder="+591 70000000"
                />
              </div>

              <div>
                <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
                  Departamento *
                </label>
                <select
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-poppins focus:ring-2 focus:ring-boutique-rose focus:border-transparent"
                >
                  <option value="">Seleccionar...</option>
                  {DEPARTAMENTOS_BOLIVIA.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
                  Ciudad *
                </label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-poppins focus:ring-2 focus:ring-boutique-rose focus:border-transparent"
                  placeholder="La Paz"
                />
              </div>

              <div>
                <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
                  Código Postal
                </label>
                <input
                  type="text"
                  name="codigo_postal"
                  value={formData.codigo_postal}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-poppins focus:ring-2 focus:ring-boutique-rose focus:border-transparent"
                  placeholder="0000"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
                  Dirección Completa *
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-poppins focus:ring-2 focus:ring-boutique-rose focus:border-transparent"
                  placeholder="Av. Principal #123"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
                  Referencias
                </label>
                <textarea
                  name="referencias"
                  value={formData.referencias}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-poppins focus:ring-2 focus:ring-boutique-rose focus:border-transparent resize-none"
                  placeholder="Ej: Casa blanca con portón negro, al lado de..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="es_principal"
                    checked={formData.es_principal}
                    onChange={handleChange}
                    className="w-4 h-4 text-boutique-rose border-gray-300 rounded focus:ring-boutique-rose"
                  />
                  <span className="font-poppins text-sm text-gray-700">
                    Marcar como dirección principal
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="flex-1 bg-boutique-black-matte text-white py-3 rounded-lg font-poppins font-semibold hover:bg-gray-800 transition-colors"
              >
                {editingId ? 'Actualizar' : 'Guardar'} Dirección
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-poppins font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Lista de Direcciones */}
      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="font-poppins text-gray-600">No tienes direcciones guardadas</p>
          <p className="font-poppins text-sm text-gray-500 mt-2">
            Agrega una dirección para facilitar tus compras
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address, index) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 border-2 rounded-lg transition-all ${
                address.es_principal
                  ? 'border-boutique-rose bg-rose-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">
                      {address.etiqueta === 'Casa' && '🏠'}
                      {address.etiqueta === 'Trabajo' && '💼'}
                      {address.etiqueta === 'Otro' && '📍'}
                    </span>
                    <h3 className="font-raleway font-bold text-boutique-black-matte">
                      {address.etiqueta}
                    </h3>
                    {address.es_principal && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-boutique-rose text-white text-xs font-poppins font-semibold rounded-full">
                        <Star size={12} fill="currentColor" />
                        Principal
                      </span>
                    )}
                  </div>

                  <p className="font-poppins text-sm font-semibold text-gray-800">
                    {address.nombre_completo}
                  </p>
                  <p className="font-poppins text-sm text-gray-600">
                    {address.direccion}
                  </p>
                  <p className="font-poppins text-sm text-gray-600">
                    {address.ciudad}, {address.departamento}
                    {address.codigo_postal && ` - ${address.codigo_postal}`}
                  </p>
                  {address.referencias && (
                    <p className="font-poppins text-xs text-gray-500 mt-1 italic">
                      Ref: {address.referencias}
                    </p>
                  )}
                  <p className="font-poppins text-sm text-gray-600 mt-1">
                    Tel: {address.telefono}
                  </p>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {!address.es_principal && (
                    <button
                      onClick={() => handleSetPrincipal(address.id)}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      title="Marcar como principal"
                    >
                      <Star size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={deleting === address.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Eliminar"
                  >
                    {deleting === address.id ? (
                      <Loader size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AddressesList;
