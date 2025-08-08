import { useParams } from 'react-router-dom';
import React, { useState } from 'react';
import { referencesService } from '../../services/references.service';
import { selectReference, selectIsLoggedIn } from '../../store/selectors';
import { useSelector } from 'react-redux';
import { getErrorMessage } from '../../utils/helpers';
import { Loader } from '../../components/Loader/Loader';
import { getImagePath } from '../../utils/helpers';
import Plus from '../../assets/icons/plus.svg';
import Edit from '../../assets/icons/edit.svg';
import Check from '../../assets/icons/check.svg';
import X from '../../assets/icons/x.svg';
import Trash2 from '../../assets/icons/trash2.svg';
import styles from './References.module.css';
  import ImageUploadReferences from '../../components/ImageUploadModal/ImageUploadReferences';
import { IUploadedImage } from '../../types/uploadImage.types';
import { IReferencesResponse } from '../../types/references.types';

const References = () => {
  const { name } = useParams();
  const reference = useSelector(selectReference);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<IReferencesResponse> | null>(null);

  React.useEffect(() => {
    if(!name) return;
    (async () => {
      try {
        setLoading(true);
        await referencesService.getById(name);
      } catch (error) {
        setError(getErrorMessage(error));
        console.error(error);
      } finally {
        setLoading(false);
      }
    })()
  }, [name]);

  const toggleItem = (index: number) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(index)) {
      newExpandedItems.delete(index);
    } else {
      newExpandedItems.add(index);
    }
    setExpandedItems(newExpandedItems);
  };

  const handleLeftSectionClick = () => {
    if (isLoggedIn && reference?._id && !isEditing) {
      setIsModalOpen(true);
    }
  };

  const handleSelectImage = async (img: IUploadedImage) => {
    if (reference?._id) {
      try {
        await referencesService.updateTitleImage(reference._id, img._id || img.id || '');
      } catch (err) {
        setError('Ошибка обновления изображения: ' + getErrorMessage(err));
      }
    }
  };

  const handleEditClick = () => {
    if (reference) {
      setEditedData({
        name: reference.name,
        name_eng: reference.name_eng,
        title: reference.title,
        description: reference.description,
        manager: reference.manager,
        listInfo: reference.listInfo.map(item => ({ ...item })),
      });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (reference?._id && editedData) {
      try {
        // Удаляем _id у новых блоков listInfo
        const dataToSave = {
          ...editedData,
          listInfo: editedData.listInfo?.map(item => {
            if (item._id && typeof item._id === 'string' && item._id.length === 36) {
              // вероятно, это сгенерированный uuid, а не ObjectId из базы
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { _id, ...rest } = item;
              return rest;
            }
            return item;
          })
        };
        await referencesService.update(reference._id, dataToSave);
        setIsEditing(false);
        setEditedData(null);
      } catch (err) {
        setError('Ошибка сохранения: ' + getErrorMessage(err));
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(null);
  };

  const handleInputChange = (field: keyof IReferencesResponse, value: string) => {
    setEditedData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleListItemChange = (index: number, field: 'title' | 'description', value: string) => {
    setEditedData(prev => {
      if (!prev || !prev.listInfo) return prev;
      const newListInfo = [...prev.listInfo];
      newListInfo[index] = { ...newListInfo[index], [field]: value };
      return { ...prev, listInfo: newListInfo };
    });
  };

  const handleRemoveListItem = (index: number) => {
    setEditedData(prev => {
      if (!prev || !prev.listInfo) return prev;
      const newListInfo = prev.listInfo.filter((_, i) => i !== index);
      return { ...prev, listInfo: newListInfo };
    });
  };

  const handleAddListItem = (index: number) => {
    setEditedData(prev => {
      if (!prev || !prev.listInfo) return prev;
      const newListInfo = [...prev.listInfo];
      newListInfo.splice(index + 1, 0, { title: '', description: '', _id: crypto.randomUUID() });
      return { ...prev, listInfo: newListInfo };
    });
  };

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;
  if (!reference) return <div>Справочник не найден</div>;

  const currentData = isEditing && editedData ? editedData : reference;

  return (
    <div className={styles.container}>
      <ImageUploadReferences
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        referencesId={reference._id}
        isMany={false}
        galleryType="titleImage"
        belongsToId={reference._id}
        onSelectImage={handleSelectImage}
      />

      {/* Левая секция - изображение и заголовок */}
      <div 
        className={`${styles.leftSection} ${isLoggedIn ? styles.clickable : ''}`}
        onClick={handleLeftSectionClick}
      >
        {reference.titleImage && (
          <img
            src={getImagePath(reference.titleImage.path)}
            alt={reference.title}
            className={styles.mainImage}
          />
        )}
        <div className={styles.imageOverlay}>
          <div className={styles.overlaySubtitle}>Справочная информация</div>
          {isEditing ? (
            <input
              type="text"
              value={currentData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={styles.editableInput}
            />
          ) : (
            <h1 className={styles.overlayTitle}>{currentData.title}</h1>
          )}
        </div>
      </div>

      {/* Правая секция - описание и списки */}
      <div className={styles.rightSection}>
        {isEditing ? (
          <textarea
            value={currentData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={styles.editableTextarea}
          />
        ) : (
          <h2 className={styles.description}>{currentData.description}</h2>
        )}
        <div className={styles.divider}></div>
        
        <div className={styles.listContainer}>
          {currentData.listInfo?.map((item, index) => (
            <div key={item._id || index} className={styles.listItem}>
              <div className={styles.listItemHeader} onClick={() => !isEditing && toggleItem(index)}>
                {isEditing ? (
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleListItemChange(index, 'title', e.target.value)}
                    className={styles.editableInput}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className={styles.listItemTitle}>{item.title}</span>
                )}
                {!isEditing && (
                  <Plus
                    className={`${styles.expandIcon} ${expandedItems.has(index) ? styles.expanded : ''}`}
                    height={16}
                    width={16}
                  />
                )}
              </div>
              <div className={`${styles.listItemContent} ${(!isEditing && expandedItems.has(index)) || isEditing ? styles.expanded : ''}`}>
                <div className={styles.listItemContentInner}>
                  {isEditing ? (
                    <textarea
                      value={item.description}
                      onChange={(e) => handleListItemChange(index, 'description', e.target.value)}
                      className={styles.editableTextarea}
                    />
                  ) : (
                    item.description
                  )}
                  {isEditing && (
                    <div className={styles.listItemEditButtons}>
                      {currentData.listInfo && currentData.listInfo.length > 1 && (
                        <button
                          className={styles.editButton}
                          type="button"
                          onClick={() => handleRemoveListItem(index)}
                          title="Удалить блок"
                        >
                          <Trash2 height={16} width={16} />
                        </button>
                      )}
                      <button
                        className={styles.editButton}
                        type="button"
                        onClick={() => handleAddListItem(index)}
                        title="Добавить блок ниже"
                      >
                        <Plus height={16} width={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Кнопки редактирования */}
        {isLoggedIn && (
          <div className={styles.editButtons}>
            {isEditing ? (
              <>
                <button className={styles.editButton} onClick={handleSave}>
                  <Check height={16} width={16} />
                </button>
                <button className={styles.editButton} onClick={handleCancel}>
                  <X height={16} width={16} />
                </button>
              </>
            ) : (
              <button className={styles.editButton} onClick={handleEditClick}>
                <Edit height={16} width={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default References;
