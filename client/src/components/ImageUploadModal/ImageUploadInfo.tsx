import React from 'react';
import './ImageUploadModal.css';
import useUploadInfoGallery from './hooks/useUploadInfoGallery.tsx';
import ModalGallery from './ModalGallery.tsx';
import { IUploadedImage } from '../../types/uploadImage.types.ts';

interface Props {
  open: boolean;
  onClose: () => void;
  infoId?: string;
  isMany: boolean;
  galleryType?: 'titleImage';
  belongsToId?: string;
  onSelectImage?: (img: IUploadedImage) => void;
}

const ImageUploadInfo: React.FC<Props> = ({
  open,
  onClose,
  infoId,
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
  } = useUploadInfoGallery({ infoId, onClose, isMany, galleryType, open, belongsToId });

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

export default ImageUploadInfo; 