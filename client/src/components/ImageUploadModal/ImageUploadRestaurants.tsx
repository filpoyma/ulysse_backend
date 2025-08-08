import React from 'react';
import './ImageUploadModal.css';
import useUploadRestaurantGallery from './hooks/useUploadRestaurantGallery.tsx';
import ModalGallery from './ModalGallery.tsx';
import { IUploadedImage } from '../../types/uploadImage.types.ts';

interface Props {
  open: boolean;
  onClose: () => void;
  restaurantId?: string;
  isMany: boolean;
  galleryType?: 'gallery';
  belongsToId?: string;
  onSelectImage?: (img: IUploadedImage) => void;
}

const ImageUploadRestaurants: React.FC<Props> = ({
  open,
  onClose,
  restaurantId,
  isMany,
  galleryType,
  belongsToId,
  onSelectImage,
}) => {
  const {
    handleTitleClick,
    handleFileChange,
    handlePreviewClick: origHandlePreviewClick,
    handleDelete,
    handleSaveGallery,
    uploadedImages,
    selectedImages,
    fileInputRef,
    error,
    success,
    loading,
    maxCells,
  } = useUploadRestaurantGallery({ restaurantId, onClose, isMany, galleryType, open, belongsToId });

  // Обертка для handlePreviewClick
  const handlePreviewClick = (img: IUploadedImage) => {
    if (!isMany && onSelectImage) {
      onSelectImage(img);
      onClose();
      return;
    }
    origHandlePreviewClick(img);
  };

  if (!open) return null;

  return (
    <ModalGallery
      handleTitleClick={handleTitleClick}
      handleFileChange={handleFileChange}
      handlePreviewClick={handlePreviewClick}
      handleDelete={handleDelete}
      handleSaveGallery={handleSaveGallery}
      uploadedImages={uploadedImages}
      selectedImages={selectedImages}
      fileInputRef={fileInputRef}
      error={error}
      success={success}
      loading={loading}
      maxCells={maxCells}
      onClose={onClose}
      isMany={isMany}
    />
  );
};

export default ImageUploadRestaurants; 