import { IUploadedImage } from '../../../types/uploadImage.types.ts';
import useModalGallery from './useModalGallery.tsx';
import { travelProgramService } from '../../../services/travelProgram.service.ts';
import { getErrorMessage } from '../../../utils/helpers.ts';

const useUploadTravelProgramGallery = ({
  programId,
  onClose,
  isMany,
  open,
}: {
  programId?: string;
  onClose: () => void;
  isMany?: boolean;
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
  } = useModalGallery({ belongsToId: programId, open });

  // Клик по превью для выбора изображения
  const handlePreviewClick = async (img: IUploadedImage) => {
    if (!programId) return;
    const imageId = img._id || img.id;
    if (!imageId) return;

    try {
      setLoading(true);
      if (isMany) {
        // Для множественного выбора добавляем/удаляем изображение из выбранных
        const isSelected = selectedImages.some((i) => (i._id || i.id) === imageId);
        if (isSelected) {
          setSelectedImages((prev) => prev.filter((i) => (i._id || i.id) !== imageId));
        } else {
          setSelectedImages((prev) => [...prev, img]);
        }
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Сохранение выбранных изображений в галерею
  const handleSaveGallery = async () => {
    if (!programId || selectedImages.length === 0) return;

    try {
      setLoading(true);
      const imageIds = selectedImages.map((img) => img._id || img.id).filter(Boolean) as string[];
      await travelProgramService.addToGallery(programId, imageIds);
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

export default useUploadTravelProgramGallery;
