import { FC, RefObject } from 'react';
import Trash2 from '../../../../assets/icons/trash2.svg';
import Edit from '../../../../assets/icons/edit.svg';
import Check from '../../../../assets/icons/check.svg';
import X from '../../../../assets/icons/x.svg';
import ChevronDown from '../../../../assets/icons/chevronDown.svg';
import ChevronUp from '../../../../assets/icons/chevronUp.svg';
import styles from '../../adminLayout.module.css';
import dayjs from 'dayjs';
import { SectionHeader } from '../SectionHeader.tsx';
import { IRestaurantsList } from '../../../../types/restaurantsList.types.ts';
import { useNavigate } from 'react-router-dom';

interface RestaurantsListTableProps {
  restaurantsLists: IRestaurantsList[];
  onDeleteList: (id: string) => void;
  isCreatingList?: boolean;
  newList?: Partial<IRestaurantsList>;
  onNewListChange?: (field: keyof IRestaurantsList, value: string) => void;
  onSaveNewList?: () => void;
  handleCreateListClick: () => void;
  handleNavigateToListPage: (id: string) => void;
  onCancelNewList?: () => void;
  nameInputRef?: RefObject<HTMLInputElement>;
  sortField?: keyof IRestaurantsList;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: keyof IRestaurantsList) => void;
}

const RestaurantsListTable: FC<RestaurantsListTableProps> = ({
  restaurantsLists,
  onDeleteList,
  isCreatingList = false,
  newList = {},
  onNewListChange,
  onSaveNewList,
  onCancelNewList,
  nameInputRef,
  sortField,
  sortOrder,
  onSort,
  handleCreateListClick,
  handleNavigateToListPage,
}) => {
  const navigate = useNavigate();
  const renderSortIcon = (field: keyof IRestaurantsList) => {
    if (!sortField || sortField !== field) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp className={styles.sortArrow} />
    ) : (
      <ChevronDown className={styles.sortArrow} />
    );
  };

  const handleEditListPage = (id: string) => navigate(`/admin/restaurants/list/edit/${id}`);

  return (
    <>
      <SectionHeader
        title="Списки ресторанов"
        onCreateClick={handleCreateListClick}
        isCreating={isCreatingList}
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
                onClick={() => onSort && onSort('description')}
                style={{ cursor: 'pointer', minWidth: 200 }}>
                Описание
                <span className={styles.sortArrow}>{renderSortIcon('description')}</span>
              </th>
              <th style={{ minWidth: 80 }}>Количество ресторанов</th>
              <th
                onClick={() => onSort && onSort('isActive')}
                style={{ cursor: 'pointer', minWidth: 100 }}>
                Статус
                <span className={styles.sortArrow}>{renderSortIcon('isActive')}</span>
              </th>
              <th
                onClick={() => onSort && onSort('updatedAt')}
                style={{ cursor: 'pointer', minWidth: 120 }}>
                Дата обновления
                <span className={styles.sortArrow}>{renderSortIcon('updatedAt')}</span>
              </th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {isCreatingList && (
              <tr className={styles.hotelCreateRow}>
                <td>
                  <input
                    ref={nameInputRef}
                    className={styles.hotelCreateInput}
                    type="text"
                    value={newList.name || ''}
                    onChange={(e) => onNewListChange && onNewListChange('name', e.target.value)}
                    placeholder="Название списка"
                  />
                </td>
                <td>
                  <input
                    className={styles.hotelCreateInput}
                    type="text"
                    value={newList.description || ''}
                    onChange={(e) =>
                      onNewListChange && onNewListChange('description', e.target.value)
                    }
                    placeholder="Описание"
                  />
                </td>
                <td>0</td>
                <td>
                  <span className={styles.statusActive}>Активен</span>
                </td>
                <td>{dayjs().format('DD.MM.YYYY')}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.actionButton}
                      onClick={onSaveNewList}
                      title="Сохранить">
                      <Check />
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={onCancelNewList}
                      title="Отмена">
                      <X />
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {restaurantsLists.map((list) => (
              <tr key={list._id}>
                <td
                  className={styles.programName}
                  onClick={() => handleNavigateToListPage(list._id)}>
                  {list.name}
                </td>
                <td>{list.description || '-'}</td>
                <td>{list.metadata?.totalRestaurants || list.restaurants?.length || 0}</td>
                <td>
                  <span className={list.isActive ? styles.statusActive : styles.statusInactive}>
                    {list.isActive ? 'Активен' : 'Неактивен'}
                  </span>
                </td>
                <td>{list.updatedAt ? dayjs(list.updatedAt).format('DD.MM.YYYY') : ''}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.actionButton}
                      onClick={() => list._id && handleEditListPage(list._id)}
                      title="Редактировать список">
                      <Edit />
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => list._id && onDeleteList(list._id)}
                      title="Удалить">
                      <Trash2 />
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

export default RestaurantsListTable;
