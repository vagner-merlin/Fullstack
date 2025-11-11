import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Banknote, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { PAYMENT_METHODS, type PaymentMethodType } from '../../services/orderService';

interface PaymentMethodProps {
  selectedMethod: PaymentMethodType;
  onSubmit: (method: PaymentMethodType) => void;
  isProcessing?: boolean;
}

const PaymentMethod = ({ selectedMethod, onSubmit, isProcessing = false }: PaymentMethodProps) => {
  const [selected, setSelected] = useState<PaymentMethodType>(selectedMethod);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selected);
  };

  const getIcon = (type: PaymentMethodType) => {
    switch (type) {
      case 'qr':
        return <Smartphone size={32} />;
      case 'tarjeta':
        return <CreditCard size={32} />;
      case 'efectivo':
        return <Banknote size={32} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-boutique-rose-light rounded-lg">
          <CreditCard size={24} className="text-boutique-rose" />
        </div>
        <div>
          <h2 className="font-raleway text-2xl font-bold text-boutique-black-matte">
            Método de Pago
          </h2>
          <p className="font-poppins text-sm text-gray-600">
            Selecciona cómo deseas pagar
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Payment Options */}
        <div className="space-y-3">
          {PAYMENT_METHODS.map((method) => (
            <motion.button
              key={method.type}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(method.type)}
              className={`w-full p-5 rounded-lg border-2 transition-all text-left ${
                selected === method.type
                  ? 'border-boutique-rose bg-boutique-rose-light'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  selected === method.type 
                    ? 'bg-white text-boutique-rose' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {getIcon(method.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-raleway font-bold text-boutique-black-matte">
                      {method.nombre}
                    </h3>
                    {selected === method.type && (
                      <CheckCircle size={20} className="text-boutique-rose" />
                    )}
                  </div>
                  <p className="font-poppins text-sm text-gray-600">
                    {method.descripcion}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Payment Details based on selection */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-lg"
        >
          {selected === 'qr' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Smartphone className="text-blue-600" size={20} />
                <p className="font-poppins text-sm font-semibold text-blue-900">
                  Pago con QR Simple/Tigo Money
                </p>
              </div>
              <p className="font-poppins text-xs text-blue-800">
                Al confirmar el pedido, te mostraremos un código QR para que realices el pago 
                desde tu aplicación de banca móvil.
              </p>
            </div>
          )}

          {selected === 'tarjeta' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CreditCard className="text-blue-600" size={20} />
                <p className="font-poppins text-sm font-semibold text-blue-900">
                  Pago con Tarjeta
                </p>
              </div>
              <p className="font-poppins text-xs text-blue-800">
                Procesaremos tu pago de forma segura. Aceptamos Visa, Mastercard y American Express.
              </p>
              <div className="flex gap-2 mt-2">
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-700">VISA</div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-700">MC</div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-700">AMEX</div>
              </div>
            </div>
          )}

          {selected === 'efectivo' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Banknote className="text-blue-600" size={20} />
                <p className="font-poppins text-sm font-semibold text-blue-900">
                  Pago Contra Entrega
                </p>
              </div>
              <p className="font-poppins text-xs text-blue-800">
                Pagarás en efectivo al momento de recibir tu pedido. Asegúrate de tener el 
                monto exacto o cambio disponible.
              </p>
            </div>
          )}
        </motion.div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="font-poppins text-xs font-semibold text-gray-900 mb-1">
                Pago 100% Seguro
              </p>
              <p className="font-poppins text-xs text-gray-600">
                Tu información está protegida con encriptación SSL. Nunca compartimos tus datos.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <motion.button
            type="submit"
            disabled={isProcessing}
            whileHover={{ scale: isProcessing ? 1 : 1.02 }}
            whileTap={{ scale: isProcessing ? 1 : 0.98 }}
            className="w-full bg-boutique-black-matte text-white py-4 rounded-lg font-poppins font-semibold hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Procesando pedido...</span>
              </>
            ) : (
              <>
                <span>Confirmar Pedido</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Terms Notice */}
        <p className="text-center font-poppins text-xs text-gray-500 mt-4">
          Al confirmar tu pedido, aceptas nuestros{' '}
          <a href="/terms" className="text-boutique-black-matte hover:underline">
            Términos y Condiciones
          </a>
        </p>
      </form>
    </motion.div>
  );
};

export default PaymentMethod;
