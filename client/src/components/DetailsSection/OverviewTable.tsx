import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import { store } from '../../store';
import { DayCell } from './DayCell';
import Map from '../../assets/icons/map.svg';
import Check from '../../assets/icons/check.svg';
import Pin from '../../assets/icons/pin.svg';
import Hotel from '../../assets/icons/hotel.svg';
import Trash2 from '../../assets/icons/trash2.svg';
import Plane from '../../assets/icons/plane.svg';
import Plus from '../../assets/icons/plus.svg';
import X from '../../assets/icons/x.svg';
import ChevronDown from '../../assets/icons/chevronDown.svg';
import ChevronUp from '../../assets/icons/chevronUp.svg';
import { selectIsLoggedIn, selectTravelProgram } from '../../store/selectors.ts';
import { travelProgramService } from '../../services/travelProgram.service';
import { travelProgramActions } from '../../store/reducers/travelProgram';
import styles from './index.module.css';

const ICON_OPTIONS = [
  { value: 'none', label: 'Map', icon: Map },
  { value: 'hotel', label: 'Hotel', icon: Hotel },
  { value: 'pin', label: 'Pin', icon: Pin },
  { value: 'plane', label: 'Plane', icon: Plane },
];

export function OverviewTable() {
  const program = useSelector(selectTravelProgram);
  const reviewData = program?.secondPageTables?.routeDetailsTable?.review || [];
  const [expandedActivities, setExpandedActivities] = useState<Record<string, boolean>>({});
  const [editableRow, setEditableRow] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<{
    day: Date;
    numOfDay: string;
    id: string;
    activity?: {
      id: string;
      icon: string;
      dayActivity: {
        id: string;
        line1: string;
        line2?: string;
        line3?: string;
        isFlight: boolean;
        more?: string;
      };
    }[];
  } | null>(null);
  const [showIconDropdown, setShowIconDropdown] = useState<{ activityIndex: number } | null>(null);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const toggleActivity = (activityId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedActivities(prev => ({
      ...prev,
      [activityId]: !prev[activityId],
    }));
  };

  const handleRowClick = (index: number) => {
    if (isLoggedIn) {
      setEditableRow(index);
      // Инициализируем editedData текущими данными строки
      const currentRow = reviewData[index];
      setEditedData({
        day: new Date(currentRow.day),
        numOfDay: String(currentRow.numOfDay),
        id: currentRow.id,
        activity: currentRow.activity.map(act => ({
          id: act.id,
          icon: act.icon,
          dayActivity: {
            id: act.dayActivity.id,
            line1: act.dayActivity.line1,
            line2: act.dayActivity.line2,
            line3: act.dayActivity.line3,
            isFlight: act.dayActivity.isFlight,
            more: act.dayActivity.more,
          },
        })),
      });
    }
  };

  const handleDateChange = (newDate: string) => {
    if (editedData) {
      setEditedData({
        ...editedData,
        day: new Date(newDate),
      });
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setEditedData(prevData => {
      if (!prevData) return null;
      return {
        ...prevData,
        numOfDay: newTitle,
      };
    });
  };

  const handleInputChange = (activityIndex: number, field: string, value: string) => {
    setEditedData(prevData => {
      if (!prevData) return null;
      const updatedActivity = [...(prevData.activity || [])];
      updatedActivity[activityIndex] = {
        ...updatedActivity[activityIndex],
        dayActivity: {
          ...updatedActivity[activityIndex].dayActivity,
          [field]: value,
        },
      };
      return {
        ...prevData,
        activity: updatedActivity,
      };
    });
  };

  const handleIconChange = (activityIndex: number, iconValue: string) => {
    if (editedData && editedData.activity) {
      const updatedActivity = [...editedData.activity];
      updatedActivity[activityIndex] = {
        ...updatedActivity[activityIndex],
        icon: iconValue,
        dayActivity: {
          ...updatedActivity[activityIndex].dayActivity,
          isFlight: iconValue === 'plane',
        },
      };
      setEditedData(prevData => {
        if (!prevData) return null;
        return {
          ...prevData,
          activity: updatedActivity,
        };
      });
      // Диспатчим изменение иконки в стор
      store.dispatch(
        travelProgramActions.updateActivityIcon({
          dayIndex: editableRow!,
          activityIndex,
          icon: iconValue,
        }),
      );
      setShowIconDropdown(null);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editableRow !== null && editedData && program?._id) {
      // Проверяем, что у каждой активности есть хотя бы одно заполненное поле
      const hasValidActivities = editedData.activity?.every(act => {
        const { line1 = '', line2 = '', line3 = '' } = act.dayActivity;
        return line1.trim() || line2.trim() || line3.trim();
      });

      if (!hasValidActivities) {
        alert(
          'Каждая активность должна содержать хотя бы одно заполненное поле (Заголовок, Подзаголовок или Дополнительная строка).',
        );
        return;
      }

      const filteredActivity = editedData.activity?.filter(act => {
        const { line1 = '', line2 = '', line3 = '' } = act.dayActivity;
        return line1.trim() || line2?.trim() || line3?.trim();
      });
      const dataToSave = {
        ...editedData,
        activity: filteredActivity,
      };
      try {
        await travelProgramService.updateReviewDay(program._id, editableRow, dataToSave);
        setEditableRow(null);
        setEditedData(null);
      } catch (error) {
        console.error('Failed to save changes:', error);
      }
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditableRow(null);
    setEditedData(null);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editableRow !== null && program?._id) {
      // Проверяем, что это не последний день
      if (reviewData.length <= 1) {
        alert('Нельзя удалить последний день. Должен остаться хотя бы один день.');
        return;
      }

      try {
        await travelProgramService.deleteReviewDay(program._id, editableRow);
        setEditableRow(null);
        setEditedData(null);
      } catch (error) {
        console.error('Failed to delete day:', error);
      }
    }
  };

  const handleMoveUp = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editableRow !== null && editableRow > 0 && program?._id) {
      try {
        await travelProgramService.reorderReviewDays(program._id, editableRow, editableRow - 1);
        setEditableRow(editableRow - 1);
      } catch (error) {
        console.error('Failed to move day up:', error);
      }
    }
  };

  const handleMoveDown = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editableRow !== null && editableRow < reviewData.length - 1 && program?._id) {
      try {
        await travelProgramService.reorderReviewDays(program._id, editableRow, editableRow + 1);
        setEditableRow(editableRow + 1);
      } catch (error) {
        console.error('Failed to move day down:', error);
      }
    }
  };

  const handleAddNewRow = async () => {
    if (program?._id) {
      try {
        const newDay = {
          day: new Date(),
          numOfDay: String(reviewData.length + 1),
          activity: [
            {
              icon: 'none',
              dayActivity: {
                line1: 'Title',
                line2: 'Subtitle',
                line3: 'One More Line',
                isFlight: false,
                more: 'more info',
              },
            },
          ],
        };

        await travelProgramService.updateReviewDay(program._id, reviewData.length, newDay);
      } catch (error) {
        console.error('Failed to add new row:', error);
      }
    }
  };

  const handleAddNewActivity = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Adding new activity, editedData:', editedData);
    setEditedData(prevData => {
      if (!prevData) return null;
      const newActivity = {
        id: crypto.randomUUID(),
        icon: 'none',
        dayActivity: {
          id: crypto.randomUUID(),
          line1: 'Title',
          line2: 'Subtitle',
          line3: 'One More Line',
          isFlight: false,
          more: 'more info',
        },
      };
      return {
        ...prevData,
        activity: [...(prevData.activity || []), newActivity],
      };
    });
  };

  const getIconComponent = (iconValue: string) => {
    const option = ICON_OPTIONS.find(opt => opt.value === iconValue);
    return option ? (
      <option.icon height={20} width={20} className={styles['activity-icon']} />
    ) : (
      <Map height={16} width={16} className={styles['activity-icon']} />
    );
  };

  const isDataValid = () => {
    if (!editedData?.activity) return false;
    return editedData.activity.every(act => {
      const { line1 = '', line2 = '', line3 = '' } = act.dayActivity;
      return line1.trim() || line2.trim() || line3.trim();
    });
  };

  return (
    <>
      <div className={`${styles['details-table']} ${styles['overview-table']}`}>
        {/*<div className={styles['table-header']}>*/}
        {/*  <div className={styles['header-cell']}>День</div>*/}
        {/*  <div className={styles['header-cell']}>Активности</div>*/}
        {/*</div>*/}
        {reviewData.map((dayData, index: number) => {
          const activities =
            (editableRow === index && editedData?.activity
              ? editedData.activity
              : dayData.activity) || [];
          return (
            <div
              key={dayData.id}
              className={styles['table-row']}
              onClick={() => handleRowClick(index)}
              style={{ cursor: isLoggedIn ? 'pointer' : 'default' }}>
              <DayCell
                title={String(dayData.numOfDay)}
                subtitle={dayjs(dayData.day).format('dddd')}
                date={dayjs(dayData.day).format('DD MMMM YYYY')}
                isEditable={editableRow === index}
                onDateChange={handleDateChange}
                onTitleChange={handleTitleChange}
              />
              <div className={styles['activities-cell']}>
                {activities.map((activity, activityIndex) => (
                  <div key={activity.id} className={styles['activity-item']}>
                    {editableRow === index ? (
                      <div className={styles['icon-selector']}>
                        <div
                          className={styles['icon-button']}
                          onClick={e => {
                            e.stopPropagation();
                            setShowIconDropdown(
                              showIconDropdown?.activityIndex === activityIndex
                                ? null
                                : { activityIndex },
                            );
                          }}>
                          {getIconComponent(activity.icon)}
                        </div>
                        {showIconDropdown?.activityIndex === activityIndex && (
                          <div className={styles['icon-dropdown']}>
                            {ICON_OPTIONS.map(option => (
                              <div
                                key={option.value}
                                className={styles['icon-option']}
                                onClick={e => {
                                  e.stopPropagation();
                                  handleIconChange(activityIndex, option.value);
                                }}>
                                <option.icon height={16} width={16} />
                                <span>{option.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      getIconComponent(activity.icon)
                    )}
                    <div className={styles['activity-details']}>
                      {editableRow === index ? (
                        <input
                          type="text"
                          value={activity.dayActivity.line1}
                          className={styles['editable-input']}
                          onClick={e => e.stopPropagation()}
                          onChange={e => handleInputChange(activityIndex, 'line1', e.target.value)}
                        />
                      ) : (
                        <div>{activity.dayActivity.line1}</div>
                      )}
                      {editableRow === index ? (
                        <input
                          type="text"
                          value={activity.dayActivity.line2}
                          className={styles['editable-input']}
                          onClick={e => e.stopPropagation()}
                          onChange={e => handleInputChange(activityIndex, 'line2', e.target.value)}
                        />
                      ) : (
                        <div>{activity.dayActivity.line2}</div>
                      )}
                      {editableRow === index ? (
                        <input
                          type="text"
                          value={activity.dayActivity.line3}
                          className={styles['editable-input']}
                          onClick={e => e.stopPropagation()}
                          onChange={e => handleInputChange(activityIndex, 'line3', e.target.value)}
                        />
                      ) : (
                        <div>{activity.dayActivity.line3}</div>
                      )}
                      {editableRow === index ? (
                        <div className={styles['activity-subtext']}>
                          <div className={styles['more-text']}>Дополнительная информация</div>
                          <input
                            type="text"
                            value={activity.dayActivity.more}
                            className={styles['editable-input']}
                            onClick={e => e.stopPropagation()}
                            onChange={e => handleInputChange(activityIndex, 'more', e.target.value)}
                          />
                        </div>
                      ) : (
                        activity.dayActivity.more && (
                          <div className={styles['activity-subtext']}>
                            <div
                              className={styles['more-text']}
                              onClick={e => toggleActivity(activity.id, e)}>
                              {expandedActivities[activity.id] ? 'СКРЫТЬ' : 'ПОДРОБНЕЕ'}
                            </div>
                            <div
                              className={`${styles['more-details']} ${
                                expandedActivities[activity.id] ? styles.expanded : ''
                              }`}>
                              {activity.dayActivity.more}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
                {editableRow === index && (
                  <div className={styles['edit-icons']}>
                    <button
                      className={styles['edit-icon']}
                      onClick={handleAddNewActivity}
                      type="button">
                      <Plus height={16} width={16} />
                    </button>
                    <button
                      className={`${styles['edit-icon']} ${
                        !isDataValid() ? styles['disabled-icon'] : ''
                      }`}
                      onClick={handleSave}
                      disabled={!isDataValid()}
                      title={
                        !isDataValid()
                          ? 'Заполните хотя бы одно поле в каждой активности'
                          : 'Сохранить'
                      }>
                      <Check height={16} width={16} />
                    </button>
                    <button className={styles['edit-icon']} onClick={handleCancel}>
                      <X height={16} width={16} />
                    </button>
                    {reviewData.length > 1 && (
                      <button
                        className={`${styles['edit-icon']} ${styles['del-icon']}`}
                        onClick={handleDelete}
                        title="Удалить день">
                        <Trash2 height={16} width={16} />
                      </button>
                    )}
                    <div className={styles['move-buttons']}>
                      <button
                        className={`${styles['edit-icon']} ${styles['move-icon']}`}
                        onClick={handleMoveUp}
                        disabled={editableRow === 0}
                        title="Переместить вверх">
                        <ChevronUp height={16} width={16} />
                      </button>
                      <button
                        className={`${styles['edit-icon']} ${styles['move-icon']}`}
                        onClick={handleMoveDown}
                        disabled={editableRow === reviewData.length - 1}
                        title="Переместить вниз">
                        <ChevronDown height={16} width={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {isLoggedIn && (
        <div className={styles['edit-icons-add-new-row']}>
          <button className={styles['edit-icon']} onClick={handleAddNewRow}>
            <Plus height={16} width={16} />
          </button>
        </div>
      )}
    </>
  );
}
