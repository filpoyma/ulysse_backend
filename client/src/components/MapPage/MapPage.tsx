import React, { useEffect, useState } from 'react';
import styles from './MapPage.module.css';
import IconElipses from '../../assets/icons/mapIcons/list/elipses.svg';
import { useSelector } from 'react-redux';
import { selectTravelProgram } from '../../store/selectors.ts';
import iconsMapList from '../../assets/icons/mapIcons/list';
import MoveDown from '../../assets/icons/chevronDown.svg';
import MoveUp from '../../assets/icons/chevronUp.svg';
import Check from '../../assets/icons/check.svg';
import X from '../../assets/icons/x.svg';
import Edit from '../../assets/icons/edit.svg';
import Plus from '../../assets/icons/plus.svg';
import Trash2 from '../../assets/icons/trash2.svg';
import { mapService } from '../../services/map.service';
import { ILogistics, TRouteType, TSourceListIcon } from '../../types/travelProgram.types';
import { validateCoordinates } from '../../utils/helpers.ts';
import { validateClipboardCoordinates } from '../MapBox/map.utils.ts';
import { selectLogisticsData } from '../../store/reSelect.ts';

const routeTypeLabels: Record<string, string> = {
  driving: 'Автомобиль',
  helicopter: 'Вертолет',
  flight: 'Самолет',
  yacht: 'Яхта',
  train: 'Поезд',
};

const locationTypeLabels: Record<string, string> = {
  flightArrivalMarker: 'Прилет',
  flightDepartureMarker: 'Вылет',
  hotelMarker: 'Отель',
  parkMarker: 'Нац. парк',
  photoSpotMarker: 'Фото-спот',
  sightMarker: 'Достопримечательность',
  restMarker: 'Ресторан',
};

const MapPage: React.FC<{ isLoggedIn: boolean; setMarkerId: (id: string) => void }> = ({
  isLoggedIn,
  setMarkerId,
}) => {
  const logistics = useSelector(selectLogisticsData);
  const program = useSelector(selectTravelProgram);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLogistics, setEditedLogistics] = useState(logistics);
  const [isSaving, setIsSaving] = useState(false);
  const [coordinateError, setCoordinateError] = useState<{
    isValid: boolean;
    error: string | null;
    fieldNumber: number;
  } | null>(null);
  const [coordinates, setCoordinates] = useState<string[]>([]);
  const [isNewPoint, setIsNewPoint] = useState(false);

  useEffect(() => {
    setCoordinates(logistics.map((item) => `${item.coordinates[1]} ${item.coordinates[0]}`));
  }, [logistics]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedLogistics(logistics);
    setCoordinateError(null);
  };

  const handleSave = async () => {
    if (!program?._id) return;

    // Валидация координат перед сохранением
    const validation = validateCoordinates(coordinates);
    console.log(validation);
    if (!validation.isValid) {
      setCoordinateError(validation);
      return;
    }

    // Преобразуем текстовые координаты в числа перед валидацией
    const logisticsWithParsedCoordinates = editedLogistics.map((item, i) => ({
      ...item,
      coordinates: coordinates[i]
        ?.split(' ')
        .map((coord) => parseFloat(coord.trim()))
        .reverse() as [number, number],
    }));

    try {
      setIsSaving(true);
      await mapService.updateLogistics(program._id, logisticsWithParsedCoordinates);
      setIsEditing(false);
      setCoordinateError(null);
    } catch (error) {
      console.error('Failed to save logistics:', error);
    } finally {
      setIsSaving(false);
    }
    setIsNewPoint(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedLogistics(logistics);
    setCoordinateError(null);
    setIsNewPoint(false);
  };

  const handleDelete = (index: number) => {
    setEditedLogistics((prev) => prev.filter((_, i) => i !== index));
    setCoordinates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return; // Can't move first item up

    setEditedLogistics((prev) => {
      const newLogistics = [...prev];
      [newLogistics[index - 1], newLogistics[index]] = [
        newLogistics[index],
        newLogistics[index - 1],
      ];
      return newLogistics;
    });

    setCoordinates((prev) => {
      const newCoordinates = [...prev];
      [newCoordinates[index - 1], newCoordinates[index]] = [
        newCoordinates[index],
        newCoordinates[index - 1],
      ];
      return newCoordinates;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === editedLogistics.length - 1) return; // Can't move last item down

    setEditedLogistics((prev) => {
      const newLogistics = [...prev];
      [newLogistics[index], newLogistics[index + 1]] = [
        newLogistics[index + 1],
        newLogistics[index],
      ];
      return newLogistics;
    });

    setCoordinates((prev) => {
      const newCoordinates = [...prev];
      [newCoordinates[index], newCoordinates[index + 1]] = [
        newCoordinates[index + 1],
        newCoordinates[index],
      ];
      return newCoordinates;
    });
  };

  const handleAddNewPoint = () => {
    setIsNewPoint(true);
    const newLogisticsItem: Omit<ILogistics, '_id'> = {
      city: '',
      coordinates: [0, 0] as [number, number],
      hotel: '',
      routeType: '' as TRouteType,
      sourceListIcon: '' as TSourceListIcon,
      sourceMapIcon: 'startPoint' as const,
      time: '',
      distance: '',
    };

    setEditedLogistics((prev) => [...prev, newLogisticsItem as ILogistics]);
    setCoordinates((prev) => [...prev, '0 0']);
  };

  const handleInputChange = (id: string, field: string, value: string | number[] | TRouteType) => {
    setEditedLogistics((prev) =>
      prev.map((item) => (item._id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleCoordinatesChange = (id: number, value: string) => {
    setCoordinates((prev) => prev.map((coord, i) => (i === id ? value : coord)));
    setCoordinateError((prev) => (coordinateError?.fieldNumber === id ? null : prev));
  };

  const handleCoordinatesClick = async (index: number) => {
    try {
      const text = await navigator.clipboard.readText();
      validateClipboardCoordinates(text);
      handleCoordinatesChange(index, text);
    } catch (err) {
      console.error('Failed to read coordinates:', err);
    }
  };

  const time = (time: string) => {
    if (!time) return '';
    const hours = time.split(':')[0];
    const mins = time.split(':')[1];
    return hours === '0' || hours === '00' ? `${mins}мин` : `${hours}ч ${mins}мин`;
  };

  return (
    <div className={styles.container} id="map">
      <div className={styles.header}>КАРТА / ЛОГИСТИКА ПУТЕШЕСТВИЯ</div>

      {isLoggedIn && !isEditing && (
        <div className={styles.headerContainer}>
          <button className={styles.editIcon} onClick={handleEdit}>
            <Edit height={16} width={16} />
          </button>
        </div>
      )}

      {isEditing ? (
        <>
          <div className={styles.editTable}>
            {editedLogistics.map((item, i) => (
              <div key={item._id} className={styles.routeBlock}>
                {/* Первая строка: точка */}
                <div className={styles.routeRow}>
                  <input
                    type="text"
                    value={coordinates[i] === '0 0' ? '' : coordinates[i]}
                    onChange={(e) => handleCoordinatesChange(i, e.target.value)}
                    onClick={() => handleCoordinatesClick(i)}
                    placeholder="Координаты"
                    className={coordinateError?.fieldNumber === i ? styles.error : styles.input}
                  />
                  <select
                    value={item.sourceListIcon}
                    onChange={(e) => handleInputChange(item._id, 'sourceListIcon', e.target.value)}
                    className={styles.select}
                    style={!item.sourceListIcon ? { opacity: 0.7 } : {}}>
                    {!item.sourceListIcon && <option value={''}>Маркер</option>}
                    {Object.entries(locationTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={item.city}
                    onChange={(e) => handleInputChange(item._id, 'city', e.target.value)}
                    placeholder="Место"
                    className={styles.input}
                  />
                  <input
                    type="text"
                    value={item.hotel}
                    onChange={(e) => handleInputChange(item._id, 'hotel', e.target.value)}
                    placeholder="Отель"
                    className={styles.input}
                  />
                </div>
                {/* Вторая строка: транспорт */}
                <div className={styles.routeRow}>
                  <div className={styles.moveButtons}>
                    <button
                      className={styles.iconBtn}
                      onClick={() => handleMoveUp(i)}
                      disabled={i === 0 || isSaving}>
                      <MoveUp height={16} width={16} />
                    </button>
                    <button
                      className={`${styles.iconBtn} ${styles.delIcon}`}
                      onClick={() => handleDelete(i)}
                      disabled={isSaving}>
                      <Trash2 height={16} width={16} />
                    </button>
                    <button
                      className={styles.iconBtn}
                      onClick={() => handleMoveDown(i)}
                      disabled={i === editedLogistics.length - 1 || isSaving}>
                      <MoveDown height={16} width={16} />
                    </button>
                  </div>
                  <select
                    value={item.routeType}
                    onChange={(e) =>
                      handleInputChange(item._id, 'routeType', e.target.value as TRouteType)
                    }
                    className={styles.select}
                    style={!item.routeType ? { opacity: 0.7 } : {}}>
                    {!item.routeType && <option value={''}>Маршрут</option>}
                    {Object.entries(routeTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={item.time}
                    onChange={(e) => handleInputChange(item._id, 'time', e.target.value)}
                    placeholder="Час : Мин"
                    className={styles.input}
                  />
                  <input
                    type="text"
                    value={item.distance}
                    onChange={(e) => handleInputChange(item._id, 'distance', e.target.value)}
                    placeholder="Км"
                    className={styles.input}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.editControls}>
            <button className={styles.editIcon} onClick={handleCancel} disabled={isSaving}>
              <X height={16} width={16} />
            </button>
            {!isNewPoint && (
              <button className={styles.editIcon} onClick={handleAddNewPoint} disabled={isSaving}>
                <Plus height={16} width={16} />
              </button>
            )}
            <button className={styles.editIcon} onClick={handleSave} disabled={isSaving}>
              {isSaving ? <div className={styles.spinner} /> : <Check height={16} width={16} />}
            </button>
          </div>
        </>
      ) : (
        <div className={styles.timeline}>
          {logistics.map((item, idx) => (
            <div key={item._id}>
              <div className={styles.timelineItem}>
                <div className={styles.iconCol}>
                  <div className={styles.iconCircle}>{iconsMapList[item.sourceListIcon]}</div>
                  {idx < logistics.length - 1 && (
                    <div className={styles.dottedLine}>
                      <IconElipses />
                    </div>
                  )}
                </div>
                <div
                  className={`${styles.infoCol} ${styles.infoColPointer}`}
                  onClick={() => setMarkerId(item._id)}>
                  <div className={styles.city}>{item.city}</div>
                  <div className={styles.hotel}>{item.hotel}</div>
                </div>
              </div>
              {idx < logistics.length - 1 && (
                <div className={styles.timelineItem}>
                  <div className={styles.iconCol}>
                    <div className={styles.iconCircle}>
                      {iconsMapList[item.routeType || 'train']}
                    </div>
                    <div className={styles.dottedLine}>
                      <IconElipses />
                    </div>
                  </div>
                  <div className={styles.infoCol}>
                    <div className={styles.transportInfo}>
                      <span className={styles.transportTime}>{time(item.time)}</span>
                      {' / '}
                      <span className={styles.transportDistance}>{item.distance}км</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapPage;
