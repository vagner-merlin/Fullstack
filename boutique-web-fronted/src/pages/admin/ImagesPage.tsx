import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Image as ImageIcon, Upload, Star, X } from 'lucide-react';
import {
  getAllImages,
  uploadImage,
  updateImage,
  deleteImage,
  setAsPrincipal,
  checkS3Configuration,
  type ProductImage
} from '../../services/admin/imageService';
import { getAllVariants, type ProductVariant } from '../../services/admin/variantService';
import { showToast } from '../../utils/toast';

export const ImagesPage = () => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState<ProductImage | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [s3Config, setS3Config] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    texto: '',
    es_principal: false,
    Producto_categoria: 0,
  });

  useEffect(() => {
    loadData();
    checkS3Config();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [imagesData, variantsData] = await Promise.all([
        getAllImages(),
        getAllVariants()
      ]);
      setImages(imagesData);
      setVariants(variantsData);
      console.log('🖼️ Imágenes cargadas:', imagesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      showToast.error('Error al cargar imágenes');
    } finally {
      setLoading(false);
    }
  };

  const checkS3Config = async () => {
    try {
      const config = await checkS3Configuration();
      setS3Config(config);
      console.log('🔧 Configuración S3 verificada:', config);
      
      if (config.storage_backend === 'S3Boto3Storage') {
        console.log('✅ S3 está configurado correctamente');
      } else {
        console.warn('⚠️ S3 no está configurado, usando:', config.storage_backend);
      }
    } catch (error) {
      console.error('Error al verificar S3:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        showToast.error('Por favor selecciona un archivo de imagen');
        return;
      }

      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast.error('La imagen no debe superar los 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.Producto_categoria || formData.Producto_categoria === 0) {
      showToast.error('Debes seleccionar una variante de producto');
      return;
    }

    if (!editingImage && !selectedFile) {
      showToast.error('Debes seleccionar una imagen');
      return;
    }

    try {
      if (editingImage) {
        // Actualizar imagen existente
        await updateImage(editingImage.id, {
          texto: formData.texto,
          es_principal: formData.es_principal,
          ...(selectedFile && { imagen: selectedFile })
        });
        showToast.success('Imagen actualizada correctamente');
      } else {
        // Subir nueva imagen
        if (selectedFile) {
          await uploadImage({
            imagen: selectedFile,
            texto: formData.texto,
            es_principal: formData.es_principal,
            Producto_categoria: formData.Producto_categoria,
          });
          showToast.success('Imagen subida correctamente');
        }
      }
      loadData();
      closeModal();
    } catch (error) {
      console.error('Error al guardar imagen:', error);
      showToast.error('Error al guardar imagen');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return;
    try {
      await deleteImage(id);
      showToast.success('Imagen eliminada correctamente');
      loadData();
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      showToast.error('Error al eliminar imagen');
    }
  };

  const handleSetPrincipal = async (id: number) => {
    try {
      await setAsPrincipal(id);
      showToast.success('Imagen marcada como principal');
      loadData();
    } catch (error) {
      console.error('Error al marcar imagen como principal:', error);
      showToast.error('Error al actualizar imagen');
    }
  };

  const openCreateModal = () => {
    setEditingImage(null);
    setFormData({
      texto: '',
      es_principal: false,
      Producto_categoria: 0,
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowModal(true);
  };

  const openEditModal = (image: ProductImage) => {
    setEditingImage(image);
    setFormData({
      texto: image.texto,
      es_principal: image.es_principal,
      Producto_categoria: image.Producto_categoria,
    });
    setSelectedFile(null);
    setPreviewUrl(image.imagen_url);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingImage(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getVariantInfo = (variantId: number) => {
    const variant = variants.find(v => v.id === variantId);
    if (!variant) return 'Variante no encontrada';
    return `${variant.producto_info?.nombre || 'Producto'} - ${variant.color} ${variant.talla}`;
  };

  const filteredImages = images.filter(img => {
    const searchLower = searchTerm.toLowerCase();
    const variantInfo = getVariantInfo(img.Producto_categoria).toLowerCase();
    return (
      variantInfo.includes(searchLower) ||
      img.texto.toLowerCase().includes(searchLower)
    );
  });

  const totalImages = images.length;
  const principalImages = images.filter(img => img.es_principal).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-gray-900">Imágenes de Productos</h2>
            {s3Config && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                s3Config.storage_backend === 'S3Boto3Storage'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {s3Config.storage_backend === 'S3Boto3Storage' ? '☁️ S3 Activo' : '💾 Local'}
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-1">
            Gestiona las imágenes de tus variantes de productos
            {s3Config?.storage_backend === 'S3Boto3Storage' && (
              <span className="text-green-600 font-medium"> • Almacenamiento en AWS S3</span>
            )}
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-pink-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5" />
          Subir Imagen
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm font-medium">Total Imágenes</p>
              <p className="text-3xl font-bold mt-2">{totalImages}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <ImageIcon className="h-8 w-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Imágenes Principales</p>
              <p className="text-3xl font-bold mt-2">{principalImages}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Star className="h-8 w-8" />
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
              <p className="text-purple-100 text-sm font-medium">Variantes con Imágenes</p>
              <p className="text-3xl font-bold mt-2">
                {new Set(images.map(img => img.Producto_categoria)).size}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Upload className="h-8 w-8" />
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
            placeholder="Buscar por producto o descripción..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredImages.map((image) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
          >
            {/* Image */}
            <div className="relative aspect-square bg-gray-100">
              {image.imagen_url ? (
                <>
                  <img
                    src={image.imagen_url}
                    alt={image.texto}
                    className="w-full h-full object-cover"
                  />
                  {image.es_principal && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 fill-white" />
                      Principal
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-gray-300" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                  {getVariantInfo(image.Producto_categoria)}
                </p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {image.texto || 'Sin descripción'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {!image.es_principal && (
                  <button
                    onClick={() => handleSetPrincipal(image.id)}
                    className="flex-1 px-3 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                    title="Marcar como principal"
                  >
                    <Star className="h-4 w-4" />
                    Principal
                  </button>
                )}
                <button
                  onClick={() => openEditModal(image)}
                  className="p-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron imágenes</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 my-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingImage ? 'Editar Imagen' : 'Subir Nueva Imagen'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen {!editingImage && '*'}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-pink-500 transition-colors">
                  {previewUrl ? (
                    <div className="space-y-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cambiar Imagen
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer text-center"
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Haz clic para seleccionar una imagen
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG hasta 5MB
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Variante */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variante de Producto *
                </label>
                <select
                  value={formData.Producto_categoria}
                  onChange={(e) => setFormData({ ...formData, Producto_categoria: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                  disabled={!!editingImage}
                >
                  <option value={0}>Seleccionar variante...</option>
                  {variants.map(variant => (
                    <option key={variant.id} value={variant.id}>
                      {variant.producto_info?.nombre} - {variant.color} {variant.talla}
                    </option>
                  ))}
                </select>
              </div>

              {/* Texto/Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.texto}
                  onChange={(e) => setFormData({ ...formData, texto: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Descripción de la imagen..."
                />
              </div>

              {/* Es Principal */}
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <input
                  type="checkbox"
                  id="es_principal"
                  checked={formData.es_principal}
                  onChange={(e) => setFormData({ ...formData, es_principal: e.target.checked })}
                  className="w-5 h-5 text-amber-600 focus:ring-amber-500 rounded"
                />
                <label htmlFor="es_principal" className="flex items-center gap-2 cursor-pointer">
                  <Star className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Marcar como imagen principal
                  </span>
                </label>
              </div>

              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <p className="text-sm text-pink-800">
                  <strong>📸 Tip:</strong> La imagen principal será la que se muestre primero en el catálogo. Solo puede haber una imagen principal por variante.
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
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  {editingImage ? 'Actualizar Imagen' : 'Subir Imagen'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
