import { IUploadedImage } from '../../../types/uploadImage.types.ts';
import { infoService } from '../../../services/info.service.ts';
import useModalGallery from './useModalGallery.tsx';
import { getErrorMessage } from '../../../utils/helpers.ts';

const useUploadInfoGallery = ({
  infoId,
  onClose,
  isMany,
  galleryType,
  belongsToId,
  open,
}: {
  infoId?: string;
  onClose: () => void;
  isMany?: boolean;
  galleryType?: 'titleImage';
  belongsToId?: string;
  open: boolean;
}) => {
  const {
    selectedImages,
    setLoading,
    setSelectedImages,
    setSuccess,
    setError,
    maxCells,
    handleDelete,
    handleFileChange,
    handleTitleClick,
    fileInputRef,
    loading,
    error,
    success,
    uploadedImages,
  } = useModalGallery({ belongsToId, open });

  // Клик по превью для выбора изображения
  const handlePreviewClick = async (img: IUploadedImage) => {
    if (isMany && galleryType) {
      // Для множественного выбора добавляем/удаляем изображение из выбранных
      const isSelected = selectedImages.some((i) => (i._id || i.id) === (img._id || img.id));
      if (isSelected) {
        setSelectedImages((prev) => prev.filter((i) => (i._id || i.id) !== (img._id || img.id)));
      } else {
        setSelectedImages((prev) => [...prev, img]);
      }
    }
    // Для одиночного выбора теперь ничего не делаем (логика в родителе через onSelectImage)
  };

  // Сохранение выбранных изображений в галерею
  const handleSaveGallery = async () => {
    if (!infoId || !galleryType || selectedImages.length === 0) return;

    try {
      setLoading(true);
      const imageId = selectedImages[0]._id || selectedImages[0].id;
      if (imageId) {
        await infoService.updateTitleImage(infoId, imageId);
      }
      setSuccess(true);
      setSelectedImages([]);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return {
    handlePreviewClick,
    handleSaveGallery,
    maxCells,
    handleDelete,
    handleFileChange,
    handleTitleClick,
    fileInputRef,
    loading,
    error,
    success,
    uploadedImages,
    selectedImages,
  };
};

export default useUploadInfoGallery; 