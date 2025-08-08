import React, { useRef, useState, useEffect } from 'react';
import './ImageUploadModal.css';
import { imageService } from '../../services/image.service';
import { useSelector, useDispatch } from 'react-redux';
import { travelProgramActions } from '../../store/reducers/travelProgram';
import { RootState } from '../../store';
import { createArrayFromNumber, getErrorMessage, getImagePath } from '../../utils/helpers.ts';
import { IUploadedImage } from '../../types/uploadImage.types.ts';

interface Props {
  open: boolean;
  onClose: () => void;
  programName?: string;
  imageNumber: number | null;
}

const ImageUploadModal: React.FC<Props> = ({ open, onClose, programName, imageNumber }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<IUploadedImage[]>([]);

  const dispatch = useDispatch();
  const program = useSelector((state: RootState) => state.travelProgram.program);

  // Загружаем все изображения при открытии модального окна
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const images = (await imageService.getAllImages()) as IUploadedImage[];
        setUploadedImages(images);
      } catch {
        // Не критично, просто не показываем картинки
      }
    })();
  }, [open]);

  // Автоматически скрывать надпись об успехе через 2 секунды
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (!open) return null;

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
      const uploadPromises = Array.from(files).map((file) => imageService.uploadImage(file));
      const responses = await Promise.all(uploadPromises);

      const newImages = responses
        .filter((response) => response && response.image && response.image.path)
        .map((response) => response.image);

      if (newImages.length > 0) {
        setUploadedImages((prev) => [...prev, ...newImages]);
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
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const maxCells = Math.max(uploadedImages.length, 9);

  // Клик по превью для выбора фона
  const handlePreviewClick = async (img: IUploadedImage) => {
    if (!programName || imageNumber === null) return;
    const imageId = img._id || img.id;
    if (!imageId) return;
    try {
      const res = await imageService.setBgImage({
        programName,
        imageId,
        imageNumber,
      });

      // Обновляем bgImages в сторе
      if (program) {
        const newBgImages = [...(res.data.program.bgImages || [])];
        newBgImages[imageNumber] = {
          _id: img._id || img.id || '',
          filename: img.filename,
          path: img.path,
          belongsToId: img.belongsToId,
        };
        dispatch(travelProgramActions.setBgImages(newBgImages));
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ position: 'relative' }}>
        <button
          className="modal-close-top"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'transparent',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
          title="Закрыть">
          <span className="modal-cross" style={{ fontSize: 28, color: '#222', lineHeight: 1 }}>
            ×
          </span>
        </button>
        <div className="modal-header">
          <h3 className="modal-title-upload" onClick={handleTitleClick}>
            ЗАГРУЗИТЬ ИЗОБРАЖЕНИЯ
          </h3>
          {error ? (
            <div style={{ color: 'red', marginBottom: 8 }}>{`${error}`}</div>
          ) : success ? (
            <div style={{ color: 'green', marginBottom: 8 }}>файл успешно загружен</div>
          ) : (
            <p className="modal-subtext">размер изображения не менее 1080x1080 пикселей</p>
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
              return (
                <div
                  className="modal-cell"
                  key={id}
                  style={{ position: 'relative', width: 120, height: 120 }}>
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
                        }}
                      />
                      <button
                        className="modal-delete-btn"
                        onClick={() => handleDelete(img)}
                        title="Удалить изображение">
                        <span
                          className="modal-cross"
                          style={{ fontSize: 28, color: '#222', lineHeight: 1 }}>
                          ×
                        </span>
                      </button>
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
        <button className="modal-close" onClick={onClose} disabled={loading}>
          {loading ? 'Загрузка...' : 'Закрыть'}
        </button>
      </div>
    </div>
  );
};

export default ImageUploadModal;
