import { FC, RefObject } from 'react';
import ChevronDown from '../../../../assets/icons/chevronDown.svg';
import ChevronUp from '../../../../assets/icons/chevronUp.svg';
import X from '../../../../assets/icons/x.svg';
import Edit from '../../../../assets/icons/edit.svg';
import Check from '../../../../assets/icons/check.svg';
import Trash2 from '../../../../assets/icons/trash2.svg';
import styles from '../../adminLayout.module.css';
import { IHotel } from '../../../../types/hotel.types.ts';
import dayjs from 'dayjs';
import { CountryAutocomplete } from '../../../../components/CountryAutocomplete/CountryAutocomplete.tsx';
import { SectionHeader } from '../SectionHeader.tsx';

interface HotelsTableProps {
  hotels: IHotel[];
  onDeleteHotel: (id: string) => void;
  isCreatingHotel?: boolean;
  newHotel?: Partial<IHotel>;
  onNewHotelChange?: (field: keyof IHotel, value: string) => void;
  onSaveNewHotel?: () => void;
  handleCreateHotelClick: () => void;
  handleNavigateToHotelPage: (id: string) => void;
  handleHotelEdit: (id: string) => void;
  onCancelNewHotel?: () => void;
  nameInputRef?: RefObject<HTMLInputElement>;
  sortField?: keyof IHotel;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: keyof IHotel) => void;
}

const HotelsCollectTable: FC<HotelsTableProps> = ({
  hotels,
  onDeleteHotel,
  isCreatingHotel = false,
  newHotel = {},
  onNewHotelChange,
  onSaveNewHotel,
  onCancelNewHotel,
  nameInputRef,
  sortField,
  sortOrder,
  onSort,
  handleCreateHotelClick,
  handleNavigateToHotelPage,
  handleHotelEdit,
}) => {
  const renderSortIcon = (field: keyof IHotel) => {
    if (!sortField || sortField !== field) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp height={16} width={16} className={styles.sortArrow} />
    ) : (
      <ChevronDown height={16} width={16} className={styles.sortArrow} />
    );
  };

  return (
    <>
      <SectionHeader
        title="Список отелей"
        onCreateClick={handleCreateHotelClick}
        isCreating={isCreatingHotel}
      />
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th
                onClick={() => onSort && onSort('name')}
                style={{ cursor: 'pointer', minWidth: 120 }}>
                Название
                <span className={styles.sortArrow}>{renderSortIcon('name')}</span>
              </th>
              <th
                onClick={() => onSort && onSort('country')}
                style={{ cursor: 'pointer', minWidth: 100 }}>
                Страна
                <span className={styles.sortArrow}>{renderSortIcon('country')}</span>
              </th>
              <th
                onClick={() => onSort && onSort('city')}
                style={{ cursor: 'pointer', minWidth: 100 }}>
                Город
                <span className={styles.sortArrow}>{renderSortIcon('city')}</span>
              </th>
              <th
                onClick={() => onSort && onSort('region')}
                style={{ cursor: 'pointer', minWidth: 100 }}>
                Регион
                <span className={styles.sortArrow}>{renderSortIcon('region')}</span>
              </th>
              <th
                onClick={() => onSort && onSort('updatedAt')}
                style={{ cursor: 'pointer', minWidth: 120 }}>
                Дата обновления
                <span className={styles.sortArrow}>{renderSortIcon('updatedAt')}</span>
              </th><th
                onClick={() => onSort && onSort('manager')}
                style={{ cursor: 'pointer', minWidth: 120 }}>
                Менеджер
                <span className={styles.sortArrow}>{renderSortIcon('manager')}</span>
              </th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {isCreatingHotel && (
              <tr className={styles.hotelCreateRow}>
                <td>
                  <input
                    ref={nameInputRef}
                    className={styles.hotelCreateInput}
                    type="text"
                    value={newHotel.name || ''}
                    onChange={(e) => onNewHotelChange && onNewHotelChange('name', e.target.value)}
                    placeholder="Название *"
                  />
                </td>
                <td>
                  <CountryAutocomplete
                    value={newHotel.country || ''}
                    onChange={(value) => onNewHotelChange && onNewHotelChange('country', value)}
                    className={styles.hotelCreateInput}
                  />
                </td>
                <td>
                  <input
                    className={styles.hotelCreateInput}
                    type="text"
                    value={newHotel.city || ''}
                    onChange={(e) => onNewHotelChange && onNewHotelChange('city', e.target.value)}
                    placeholder="Город *"
                  />
                </td>
                <td>
                  <input
                    className={styles.hotelCreateInput}
                    type="text"
                    value={newHotel.region || ''}
                    onChange={(e) => onNewHotelChange && onNewHotelChange('region', e.target.value)}
                    placeholder="Регион"
                  />
                </td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.actionButton}
                      onClick={onSaveNewHotel}
                      title="Сохранить">
                      <Check height={16} width={16} />
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={onCancelNewHotel}
                      title="Отмена">
                      <X height={16} width={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {hotels.map((hotel) => (
              <tr key={hotel._id}>
                <td
                  className={styles.programName}
                  onClick={() => handleNavigateToHotelPage(hotel.name_eng)}>
                  {hotel.name}
                </td>
                <td>{hotel.country}</td>
                <td>{hotel.city}</td>
                <td>{hotel.region}</td>
                <td>{hotel.updatedAt ? dayjs(hotel.updatedAt).format('DD.MM.YYYY') : ''}</td>
                <td>{hotel.manager}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.actionButton}
                      onClick={() => hotel._id && handleHotelEdit(hotel._id)}
                      title="Редактировать">
                      <Edit height={16} width={16} />
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => hotel._id && onDeleteHotel(hotel._id)}
                      title="Удалить">
                      <Trash2 height={16} width={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default HotelsCollectTable;
