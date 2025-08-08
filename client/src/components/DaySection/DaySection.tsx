import React, { useState } from 'react';
import styles from './DaySection.module.css';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { selectIsLoggedIn, selectTravelProgram } from '../../store/selectors.ts';
import PlusCircle from '../../assets/icons/plusInCircle.svg';
import InfoCircle from '../../assets/icons/infoInCircle.svg';
import Check from '../../assets/icons/check.svg';
import Trash2 from '../../assets/icons/trash2.svg';
import Plus from '../../assets/icons/plus.svg';
import X from '../../assets/icons/x.svg';

import { travelProgramService } from '../../services/travelProgram.service';
import { IFourthDayData } from '../../types/travelProgram.types';
import { selectTravelProgramDaySection } from '../../store/reSelect.ts';

const DaySection: React.FC = () => {
  const daySectionData = useSelector(selectTravelProgramDaySection);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const program = useSelector(selectTravelProgram);
  const [editableDay, setEditableDay] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<IFourthDayData | null>(null);

  if (!daySectionData || !Array.isArray(daySectionData) || daySectionData.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>Нет данных</div>
      </div>
    );
  }

  const handleDayClick = (index: number) => {
    if (isLoggedIn) {
      setEditableDay(index);
      setEditedData({
        header: { ...daySectionData[index].header },
        title: daySectionData[index].title,
        nights: daySectionData[index].nights,
        subtitle: daySectionData[index].subtitle,
        description: daySectionData[index].description,
        pros: [...daySectionData[index].pros],
        info: [...daySectionData[index].info],
        schedule: daySectionData[index].schedule.map(item => ({ ...item })),
      });
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (editedData) {
      setEditedData({
        ...editedData,
        [field]: field === 'nights' ? Number(value) : value,
      });
    }
  };

  const handleHeaderChange = (field: string, value: string | number) => {
    if (editedData) {
      setEditedData({
        ...editedData,
        header: {
          ...editedData.header,
          [field]: field === 'dayIndex' ? Number(value) : value,
        },
      });
    }
  };

  const handleArrayItemChange = (arrayName: 'pros' | 'info', index: number, value: string) => {
    if (editedData) {
      const updatedArray = [...editedData[arrayName]];
      updatedArray[index] = value;
      setEditedData({
        ...editedData,
        [arrayName]: updatedArray,
      });
    }
  };

  const handleScheduleItemChange = (
    index: number,
    field: 'title' | 'description',
    value: string,
  ) => {
    if (editedData) {
      const updatedSchedule = [...editedData.schedule];
      updatedSchedule[index] = {
        ...updatedSchedule[index],
        [field]: value,
      };
      setEditedData({
        ...editedData,
        schedule: updatedSchedule,
      });
    }
  };

  const handleAddArrayItem = (arrayName: 'pros' | 'info') => {
    if (editedData) {
      setEditedData({
        ...editedData,
        [arrayName]: [...editedData[arrayName], 'Новый элемент'],
      });
    }
  };

  const handleRemoveArrayItem = (arrayName: 'pros' | 'info', index: number) => {
    if (editedData) {
      if (editedData[arrayName].length <= 1) {
        return;
      }

      const updatedArray = editedData[arrayName].filter((_, i) => i !== index);
      setEditedData({
        ...editedData,
        [arrayName]: updatedArray,
      });
    }
  };

  const handleAddScheduleItem = () => {
    if (editedData) {
      setEditedData({
        ...editedData,
        schedule: [...editedData.schedule, { title: 'Новый пункт', description: 'Описание' }],
      });
    }
  };

  const handleRemoveScheduleItem = (index: number) => {
    if (editedData) {
      if (editedData.schedule.length <= 1) return;
      const updatedSchedule = editedData.schedule.filter((_, i) => i !== index);
      setEditedData({
        ...editedData,
        schedule: updatedSchedule,
      });
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editableDay !== null && editedData && program?._id) {
      try {
        await travelProgramService.updateDaySection(program._id, editableDay, editedData);
        setEditableDay(null);
        setEditedData(null);
      } catch (error) {
        console.error('Failed to save changes:', error);
      }
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditableDay(null);
    setEditedData(null);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editableDay !== null && program?._id) {
      if (daySectionData.length <= 1) {
        alert('Нельзя удалить последний день. Должен остаться хотя бы один день.');
        return;
      }

      try {
        await travelProgramService.deleteDaySection(program._id, editableDay);
        setEditableDay(null);
        setEditedData(null);
      } catch (error) {
        console.error('Failed to delete day:', error);
      }
    }
  };

  const handleAddNewDay = async () => {
    if (program?._id) {
      try {
        const newDay: IFourthDayData = {
          header: {
            date: new Date(),
            dayIndex: daySectionData.length + 1,
          },
          title: 'Новый день',
          nights: 1,
          subtitle: 'Подзаголовок',
          description: 'Описание нового дня',
          pros: ['Преимущество 1', 'Преимущество 2'],
          info: ['Информация 1', 'Информация 2'],
          schedule: [
            {
              title: 'Пункт расписания 1',
              description: 'Описание пункта 1',
            },
            {
              title: 'Пункт расписания 2',
              description: 'Описание пункта 2',
            },
          ],
        };

        await travelProgramService.addDaySection(program._id, newDay);
      } catch (error) {
        console.error('Failed to add new day:', error);
      }
    }
  };

  return (
    <div data-days="days">
      {daySectionData.map((dayData, index) => {
        const isEditing = editableDay === index;
        const currentData = isEditing && editedData ? editedData : dayData;

        return (
          <div
            key={index}
            className={styles.container}
            id={`day${index + 1}`}
            onClick={!isEditing ? () => handleDayClick(index) : undefined}
            style={{ cursor: isLoggedIn && !isEditing ? 'pointer' : 'default' }}>
            <div className={styles.header}>
              {isEditing ? (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span>День</span>
                  <input
                    type="number"
                    value={currentData.header.dayIndex}
                    className={styles['editable-input']}
                    onClick={e => e.stopPropagation()}
                    onChange={e => handleHeaderChange('dayIndex', e.target.value)}
                    style={{ width: '60px' }}
                  />
                  <span>/</span>
                  <input
                    type="date"
                    value={dayjs(currentData.header.date).format('YYYY-MM-DD')}
                    className={styles['editable-input']}
                    onClick={e => e.stopPropagation()}
                    onChange={e => handleHeaderChange('date', e.target.value)}
                    style={{ width: '150px' }}
                  />
                </div>
              ) : (
                `День ${dayData.header.dayIndex} / ${dayjs(dayData.header.date).format('DD dddd')}`
              )}
            </div>

            <div className={styles.content}>
              {isEditing ? (
                <input
                  type="text"
                  value={currentData.title}
                  className={styles['editable-input']}
                  onClick={e => e.stopPropagation()}
                  onChange={e => handleInputChange('title', e.target.value)}
                  placeholder="Заголовок"
                />
              ) : (
                <div className={styles.title}>{dayData.title}</div>
              )}

              <div className={styles.night}>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="number"
                      value={currentData.nights}
                      className={styles['editable-input']}
                      onClick={e => e.stopPropagation()}
                      onChange={e => handleInputChange('nights', e.target.value)}
                      style={{ width: '60px' }}
                    />
                    <span>
                      {currentData.nights === 1
                        ? 'ночь'
                        : currentData.nights < 5
                        ? 'ночи'
                        : 'ночей'}
                    </span>
                  </div>
                ) : (
                  <p>
                    {dayData.nights}{' '}
                    {dayData.nights === 1 ? 'ночь' : dayData.nights < 5 ? 'ночи' : 'ночей'}
                  </p>
                )}
              </div>

              {isEditing ? (
                <textarea
                  value={currentData.description}
                  className={styles['editable-textarea']}
                  onClick={e => e.stopPropagation()}
                  onChange={e => handleInputChange('description', e.target.value)}
                  placeholder="Описание"
                  rows={4}
                />
              ) : (
                <div className={styles.description}>{dayData.description}</div>
              )}

              {currentData.pros && currentData.pros.length > 0 && (
                <>
                  <div className={styles.infoContainer}>
                    <PlusCircle height={31} width={31} />
                    <div>Преимущества</div>
                    {isEditing && (
                      <button
                        className={styles['add-item-btn']}
                        onClick={e => {
                          e.stopPropagation();
                          handleAddArrayItem('pros');
                        }}>
                        <Plus />
                      </button>
                    )}
                  </div>
                  <ul>
                    {currentData.pros.map((pro, proIndex) => (
                      <li key={proIndex}>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={pro}
                              className={styles['editable-input']}
                              onClick={e => e.stopPropagation()}
                              onChange={e =>
                                handleArrayItemChange('pros', proIndex, e.target.value)
                              }
                            />
                            {currentData.pros.length > 1 && (
                              <button
                                className={styles['remove-item-btn']}
                                onClick={e => {
                                  e.stopPropagation();
                                  handleRemoveArrayItem('pros', proIndex);
                                }}>
                                <X />
                              </button>
                            )}
                          </div>
                        ) : (
                          pro
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {currentData.info && currentData.info.length > 0 && (
                <>
                  <div className={styles.infoContainer}>
                    <InfoCircle height={31} width={31} />
                    <div>Краткая информация</div>
                    {isEditing && (
                      <button
                        className={styles['add-item-btn']}
                        onClick={e => {
                          e.stopPropagation();
                          handleAddArrayItem('info');
                        }}>
                        <Plus />
                      </button>
                    )}
                  </div>
                  <ul>
                    {currentData.info.map((infoItem, infoIndex) => (
                      <li key={infoIndex}>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={infoItem}
                              className={styles['editable-input']}
                              onClick={e => e.stopPropagation()}
                              onChange={e =>
                                handleArrayItemChange('info', infoIndex, e.target.value)
                              }
                            />
                            {currentData.info.length > 1 && (
                              <button
                                className={styles['remove-item-btn']}
                                onClick={e => {
                                  e.stopPropagation();
                                  handleRemoveArrayItem('info', infoIndex);
                                }}>
                                <X />
                              </button>
                            )}
                          </div>
                        ) : (
                          infoItem
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {currentData?.schedule?.length > 0 && (
              <div className={styles.scheduleBlock}>
                {currentData.schedule.map((scheduleItem, scheduleIndex) => (
                  <div key={scheduleIndex} className={styles.scheduleItem}>
                    <div>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <input
                              type="text"
                              value={scheduleItem.title}
                              className={styles['editable-input']}
                              onClick={e => e.stopPropagation()}
                              onChange={e =>
                                handleScheduleItemChange(scheduleIndex, 'title', e.target.value)
                              }
                              placeholder="Заголовок"
                            />
                            <textarea
                              value={scheduleItem.description}
                              className={styles['editable-textarea']}
                              onClick={e => e.stopPropagation()}
                              onChange={e =>
                                handleScheduleItemChange(
                                  scheduleIndex,
                                  'description',
                                  e.target.value,
                                )
                              }
                              placeholder="Описание"
                              rows={2}
                            />
                          </div>
                          {currentData.schedule.length > 1 && (
                            <button
                              className={styles['remove-item-btn']}
                              onClick={e => {
                                e.stopPropagation();
                                handleRemoveScheduleItem(scheduleIndex);
                              }}>
                              <X />
                            </button>
                          )}
                          {currentData.schedule.length === scheduleIndex + 1 && (
                            <button
                              className={styles['edit-item-btn']}
                              onClick={e => {
                                e.stopPropagation();
                                handleAddScheduleItem();
                              }}>
                              <Plus />
                            </button>
                          )}
                        </div>
                      ) : (
                        <>
                          <div className={styles.scheduleTitle}>{scheduleItem.title}</div>
                          {scheduleItem.description && (
                            <div className={styles.scheduleDesc}>{scheduleItem.description}</div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isEditing && (
              <div className={styles['edit-controls']}>
                <div className={styles['edit-icons']}>
                  <button className={styles['edit-icon']} onClick={handleCancel} title="Отмена">
                    <X />
                  </button>
                  {daySectionData.length > 1 && (
                    <button
                      className={`${styles['edit-icon']} ${styles['del-icon']}`}
                      onClick={handleDelete}
                      title="Удалить день">
                      <Trash2 />
                    </button>
                  )}
                  <button className={styles['edit-icon']} onClick={handleSave} title="Сохранить">
                    <Check />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
      {isLoggedIn && (
        <div className={styles['add-day-container']}>
          <button className={styles['add-day-btn']} onClick={handleAddNewDay}>
            <Plus /> День
          </button>
        </div>
      )}
    </div>
  );
};

export default DaySection;
