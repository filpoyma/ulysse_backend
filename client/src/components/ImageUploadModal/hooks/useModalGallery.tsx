import { useEffect, useRef, useState } from 'react';
import { imageService } from '../../../services/image.service.ts';
import { IUploadedImage } from '../../../types/uploadImage.types.ts';
import { getErrorMessage } from '../../../utils/helpers.ts';

const useModalGallery = ({ belongsToId, open }: { belongsToId?: string; open: boolean }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<IUploadedImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<IUploadedImage[]>([]);
  const maxCells = Math.max(uploadedImages.length, 8);

  // Загружаем все изображения при открытии модального окна
  useEffect(() => {
    if (!open) return;
    console.log('file-useUploadOne.tsx getImagesByBelongId:', belongsToId);
    imageService
      .getAllImages(belongsToId)
      .then((images) => {
        setUploadedImages(images);
      })
      .catch(console.error);
  }, [open]);

  // Автоматически скрывать надпись об успехе через 1 сек
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleTitleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async () => {
    setError(null);
    setSuccess(false);
    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      const response = await imageService.uploadMultipleImages(Array.from(files), belongsToId);

      if (response && response.images && response.images.length > 0) {
        setUploadedImages((prev) => [...prev, ...response.images]);
      }

      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (img: IUploadedImage) => {
    const id = img._id || img.id;
    if (!id) return;
    setLoading(true);
    try {
      await imageService.deleteImage(id);
      setUploadedImages((prev) => prev.filter((i) => (i._id || i.id) !== id));
      setSelectedImages((prev) => prev.filter((i) => (i._id || i.id) !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };
  return {
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
    setLoading,
    setSelectedImages,
    setSuccess,
    setError,
  };
};
export default useModalGallery;
