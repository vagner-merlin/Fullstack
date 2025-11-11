import { motion } from 'framer-motion';
import { MapPin, Phone, User, Building2, Map } from 'lucide-react';
import { useState } from 'react';
import type { ShippingAddress } from '../../services/orderService';

interface AddressFormProps {
  initialData?: ShippingAddress;
  onSubmit: (address: ShippingAddress) => void;
}

const AddressForm = ({ initialData, onSubmit }: AddressFormProps) => {
  const [formData, setFormData] = useState<ShippingAddress>(
    initialData || {
      nombre_completo: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      departamento: '',
      codigo_postal: '',
      referencias: '',
    }
  );

  const departamentos = [
    'La Paz',
    'Cochabamba',
    'Santa Cruz',
    'Oruro',
    'Potosí',
    'Tarija',
    'Chuquisaca',
    'Beni',
    'Pando',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof ShippingAddress, value: string) => {
    setFormData((prev: ShippingAddress) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-boutique-rose-light rounded-lg">
          <MapPin size={24} className="text-boutique-rose" />
        </div>
        <div>
          <h2 className="font-raleway text-2xl font-bold text-boutique-black-matte">
            Dirección de Envío
          </h2>
          <p className="font-poppins text-sm text-gray-600">
            Completa tus datos para la entrega
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nombre Completo */}
        <div>
          <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
            Nombre Completo <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              required
              value={formData.nombre_completo}
              onChange={(e) => handleChange('nombre_completo', e.target.value)}
              placeholder="Juan Pérez García"
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-boutique-rose focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
            Teléfono <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="tel"
              required
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              placeholder="+591 12345678"
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-boutique-rose focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Dirección */}
        <div>
          <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
            Dirección <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 text-gray-400" size={20} />
            <textarea
              required
              value={formData.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              placeholder="Av. Principal #123, entre Calle A y Calle B"
              rows={3}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-boutique-rose focus:border-transparent transition-all resize-none"
            />
          </div>
        </div>

        {/* Ciudad y Departamento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
              Ciudad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.ciudad}
              onChange={(e) => handleChange('ciudad', e.target.value)}
              placeholder="La Paz"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-boutique-rose focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
              Departamento <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Map className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select
                required
                value={formData.departamento}
                onChange={(e) => handleChange('departamento', e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-boutique-rose focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="">Selecciona...</option>
                {departamentos.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Código Postal */}
        <div>
          <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
            Código Postal (Opcional)
          </label>
          <input
            type="text"
            value={formData.codigo_postal}
            onChange={(e) => handleChange('codigo_postal', e.target.value)}
            placeholder="0000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-boutique-rose focus:border-transparent transition-all"
          />
        </div>

        {/* Referencias */}
        <div>
          <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
            Referencias Adicionales (Opcional)
          </label>
          <textarea
            value={formData.referencias}
            onChange={(e) => handleChange('referencias', e.target.value)}
            placeholder="Casa color azul, portón negro, al lado de la tienda..."
            rows={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-boutique-rose focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-boutique-black-matte text-white py-4 rounded-lg font-poppins font-semibold hover:bg-gray-800 transition-colors shadow-lg"
          >
            Continuar al Pago
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddressForm;
