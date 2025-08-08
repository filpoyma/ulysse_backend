import React from 'react';
import { createArrayFromNumber, getImagePath } from '../../utils/helpers.ts';
import { IUploadedImage } from '../../types/uploadImage.types.ts';

interface IModalGallery {
  handleTitleClick: () => void;
  handleFileChange: () => void;
  handlePreviewClick: (img: IUploadedImage) => void;
  handleDelete: (img: IUploadedImage) => void;
  handleSaveGallery: () => void;
  uploadedImages: IUploadedImage[];
  selectedImages: IUploadedImage[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  error: string | null;
  success: boolean;
  loading: boolean;
  maxCells: number;
  onClose: () => void;
  isMany: boolean;
}

const ModalGallery: React.FC<IModalGallery> = ({
  onClose,
  handleTitleClick,
  error,
  success,
  fileInputRef,
  handleFileChange,
  maxCells,
  uploadedImages,
  selectedImages,
  handlePreviewClick,
  handleDelete,
  isMany,
  handleSaveGallery,
  loading,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ position: 'relative' }}>
        <button className="modal-close-top" onClick={onClose} title="Закрыть">
          <span className="modal-cross-top">×</span>
        </button>
        <div className="modal-header">
          <h3 className="modal-title-upload" onClick={handleTitleClick}>
            Загрузить изображения
          </h3>
          {error ? (
            <div style={{ color: 'red', marginBottom: 8 }}>{`${error}`}</div>
          ) : success ? (
            <div style={{ color: 'green', marginBottom: 8 }}>Файл успешно загружен</div>
          ) : (
            <p className="modal-subtext"> ≥ 1080x1080 px</p>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            multiple
          />
        </div>
        <div className="modal-grid-wrapper">
          <div className="modal-grid">
            {createArrayFromNumber(maxCells).map((id, i) => {
              const img = uploadedImages[i];
              const isSelected =
                img &&
                selectedImages.some(
                  (selected) => (selected._id || selected.id) === (img._id || img.id),
                );
              return (
                <div className="modal-cell" key={id}>
                  {img ? (
                    <>
                      <img
                        src={getImagePath(img.path)}
                        alt="preview"
                        onClick={() => handlePreviewClick(img)}
                        style={{
                          width: 120,
                          height: 120,
                          objectFit: 'cover',
                          borderRadius: 8,
                          cursor: 'pointer',
                          border: isSelected ? '3px solid #4CAF50' : 'none',
                        }}
                      />
                      <button
                        className="modal-delete-btn"
                        onClick={() => handleDelete(img)}
                        title="Удалить изображение">
                        <span className="modal-cross">×</span>
                      </button>
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
        <div className="modal-footer">
          {isMany && (
            <button
              className="modal-save-btn"
              onClick={handleSaveGallery}
              disabled={loading || !selectedImages.length}>
              {loading ? 'Сохранение...' : 'Выбрать'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalGallery;
