import { useState } from 'react';
import ImageGallery from 'react-image-gallery';
import { useSelector } from 'react-redux';

import styles from './Days.module.css';
import { selectTravelProgram } from '../../store/selectors.ts';
import ImageUploadTravelProgram from '../ImageUploadModal/ImageUploadTravelProgram.tsx';
import { travelProgramService } from '../../services/travelProgram.service';
import { selectTravelProgramGallery, selectTravelProgramImages } from '../../store/reSelect.ts';
import { LeftNav, RightNav } from './NavIcons.tsx';
import { getErrorMessage, getImagePath } from '../../utils/helpers.ts';
const DaysGallery = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const program = useSelector(selectTravelProgram);
  const imagesForGallery = useSelector(selectTravelProgramGallery);
  const images = useSelector(selectTravelProgramImages);

  const handleDeleteImage = async (imageId: string) => {
    if (!program?._id || !imageId) return;

    try {
      const updatedImages = images.filter((img) => img._id !== imageId);
      const imageIds = updatedImages.map((img) => img._id || '');

      await travelProgramService.updateGallery(program._id, imageIds);
    } catch (error) {
      console.error('Error deleting image:', error);
      alert(getErrorMessage(error));
    }
  };

  return (
    <div className={styles.content}>
      {isLoggedIn && program && (
        <ImageUploadTravelProgram
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          programId={program._id}
          isMany={true}
        />
      )}
      {isLoggedIn && (
        <div className={styles.scrollableGallery}>
          <div className={styles.addImagePlaceholder} onClick={() => setIsModalOpen(true)} />
          {images.map((image, index) => (
            <div key={image._id} className={styles.imageWrapper}>
              <img
                src={getImagePath(image.path)}
                alt={`Image ${index + 1}`}
                className={styles.scrollableImage}
              />
              <button
                className={styles.deleteButton}
                onClick={(e) => {
                  e.stopPropagation();
                  if (image._id) {
                    handleDeleteImage(image._id);
                  }
                }}>
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      {imagesForGallery.length > 0 && (
        <ImageGallery
          items={imagesForGallery}
          showThumbnails={false}
          showBullets={true}
          renderLeftNav={(onClick: () => void, disabled: boolean) => (
            <LeftNav onClick={onClick} disabled={disabled} />
          )}
          renderRightNav={(onClick: () => void, disabled: boolean) => (
            <RightNav onClick={onClick} disabled={disabled} />
          )}
        />
      )}
    </div>
  );
};

export default DaysGallery;
