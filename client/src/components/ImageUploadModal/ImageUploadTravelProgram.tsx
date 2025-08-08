import React from 'react';
import './ImageUploadModal.css';
import ModalGallery from './ModalGallery.tsx';
import useUploadTravelProgramGallery from './hooks/useUploadTravelProgramGallery.tsx';

interface Props {
  open: boolean;
  onClose: () => void;
  programId?: string;
  isMany: boolean;
}

const ImageUploadTravelProgram: React.FC<Props> = ({ open, onClose, programId, isMany }) => {
  const {
    handleTitleClick,
    handleFileChange,
    handlePreviewClick,
    handleDelete,
    handleSaveGallery,
    uploadedImages,
    selectedImages,
    fileInputRef,
    error,
    success,
    loading,
    maxCells,
  } = useUploadTravelProgramGallery({ programId, onClose, isMany, open });

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

export default ImageUploadTravelProgram;
