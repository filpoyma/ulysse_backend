import { FC, RefObject } from 'react';
import ChevronDown from '../../../../assets/icons/chevronDown.svg';
import ChevronUp from '../../../../assets/icons/chevronUp.svg';
import Check from '../../../../assets/icons/check.svg';
import X from '../../../../assets/icons/x.svg';
import Edit from '../../../../assets/icons/edit.svg';
import Trash2 from '../../../../assets/icons/trash2.svg';
import Copy from '../../../../assets/icons/copy.svg';
import styles from '../../adminLayout.module.css';
import { IRestaurant } from '../../../../types/restaurant.types.ts';
import { CountryAutocomplete } from '../../../../components/CountryAutocomplete/CountryAutocomplete.tsx';
import { useNavigate } from 'react-router-dom';

interface Props {
  restaraunts: IRestaurant[];
  currentUser: string;
  isCreatingRestaraunt?: boolean;
  newRestaraunt?: Partial<IRestaurant>;
  onNewRestarauntChange?: (field: keyof IRestaurant, value: string | number) => void;
  onSaveNewRestaraunt?: () => void;
  onCancelNewRestaraunt?: () => void;
  nameInputRef?: RefObject<HTMLInputElement>;
  onRestarauntEdit: (id: string) => void;
  onDeleteRestaraunt?: (id: string) => void;
  onCopyRestaraunt: (id: string) => void;
  sortField?: keyof IRestaurant;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: keyof IRestaurant) => void;
}

const RestarauntsCollectTable: FC<Props> = ({
  restaraunts,
  currentUser,
  isCreatingRestaraunt = false,
  newRestaraunt = {},
  onNewRestarauntChange,
  onSaveNewRestaraunt,
  onCancelNewRestaraunt,
  nameInputRef,
  onRestarauntEdit,
  onDeleteRestaraunt,
  onCopyRestaraunt,
  sortField,
  sortOrder,
  onSort,
}) => {
  const navigate = useNavigate();
  const renderSortIcon = (field: keyof IRestaurant) => {
    if (!sortField || sortField !== field) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp height={16} width={16} className={styles.sortArrow} />
    ) : (
      <ChevronDown height={16} width={16} className={styles.sortArrow} />
    );
  };

  return (
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
              onClick={() => onSort && onSort('stars')}
              style={{ cursor: 'pointer', minWidth: 80 }}>
              Звёзды
              <span className={styles.sortArrow}>{renderSortIcon('stars')}</span>
            </th>
            <th
              onClick={() => onSort && onSort('manager')}
              style={{ cursor: 'pointer', minWidth: 100 }}>
              Менеджер
              <span className={styles.sortArrow}>{renderSortIcon('manager')}</span>
            </th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {isCreatingRestaraunt && (
            <tr className={styles.hotelCreateRow}>
              <td>
                <input
                  ref={nameInputRef}
                  className={styles.hotelCreateInput}
                  type="text"
                  value={newRestaraunt.name || ''}
                  onChange={(e) =>
                    onNewRestarauntChange && onNewRestarauntChange('name', e.target.value)
                  }
                  placeholder="Название *"
                />
              </td>
              <td>
                <CountryAutocomplete
                  value={newRestaraunt.country || ''}
                  onChange={(value) =>
                    onNewRestarauntChange && onNewRestarauntChange('country', value)
                  }
                  className={styles.hotelCreateInput}
                />
              </td>
              <td>
                <input
                  className={styles.hotelCreateInput}
                  type="text"
                  value={newRestaraunt.city || ''}
                  onChange={(e) =>
                    onNewRestarauntChange && onNewRestarauntChange('city', e.target.value)
                  }
                  placeholder="Город *"
                />
              </td>
              <td>
                <input
                  className={styles.hotelCreateInput}
                  type="text"
                  value={newRestaraunt.region || ''}
                  onChange={(e) =>
                    onNewRestarauntChange && onNewRestarauntChange('region', e.target.value)
                  }
                  placeholder="Регион"
                />
              </td>
              <td>
                <input
                  className={styles.hotelCreateInput}
                  type="text"
                  value={newRestaraunt.manager || ''}
                  disabled
                  placeholder="Менеджер"
                />
              </td>
              <td>
                <input
                  className={styles.hotelCreateInput}
                  type="number"
                  min={1}
                  max={5}
                  value={newRestaraunt.stars || 1}
                  onChange={(e) =>
                    onNewRestarauntChange && onNewRestarauntChange('stars', Number(e.target.value))
                  }
                  placeholder="Звёзды"
                />
              </td>
              <td>
                <div className={styles.actions}>
                  <>
                    <button
                      className={styles.actionButton}
                      onClick={onSaveNewRestaraunt}
                      title="Сохранить">
                      <Check height={16} width={16} />
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={onCancelNewRestaraunt}
                      title="Отмена">
                      <X height={16} width={16} />
                    </button>
                  </>
                </div>
              </td>
            </tr>
          )}
          {restaraunts.map((restaraunt) => (
            <tr key={restaraunt._id}>
              <td
                className={styles.programName}
                style={{ cursor: 'pointer' }}
                onClick={() => restaraunt._id && navigate(`/restaurant/${restaraunt.name_eng}`)}>
                {restaraunt.name}
              </td>
              <td>{restaraunt.country}</td>
              <td>{restaraunt.city}</td>
              <td>{restaraunt.region}</td>
              <td>{restaraunt.stars}</td>
              <td>{restaraunt.manager}</td>

              <td>
                <div className={styles.actions}>
                  {restaraunt.manager === currentUser ? (
                    <>
                      <button
                        className={styles.actionButton}
                        onClick={() => restaraunt._id && onRestarauntEdit(restaraunt._id)}
                        title="Редактировать">
                        <Edit height={16} width={16} />
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => restaraunt._id && onDeleteRestaraunt?.(restaraunt._id)}
                        title="Удалить">
                        <Trash2 height={16} width={16} />
                      </button>
                    </>
                  ) : (
                    <button
                      className={styles.actionButton}
                      onClick={() => restaraunt._id && onCopyRestaraunt(restaraunt._id)}
                      title="Копировать в свой профиль">
                      <Copy height={16} width={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RestarauntsCollectTable;
