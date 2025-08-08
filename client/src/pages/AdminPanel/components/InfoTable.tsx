import { FC } from 'react';
import ChevronDown from '../../../assets/icons/chevronDown.svg';
import Edit from '../../../assets/icons/edit.svg';
import Trash2 from '../../../assets/icons/trash2.svg';
import ChevronUp from '../../../assets/icons/chevronUp.svg';
import { IInfoResponse } from '../../../types/info.types';
import styles from '../adminLayout.module.css';
import dayjs from 'dayjs';

interface InfoTableProps {
  infos: IInfoResponse[];
  onInfoEdit: (id: string) => void;
  onDeleteInfo: (id: string) => void;
  sortField?: keyof IInfoResponse;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: keyof IInfoResponse) => void;
}

const InfoTable: FC<InfoTableProps> = ({
  infos,
  onInfoEdit,
  onDeleteInfo,
  sortField,
  sortOrder,
  onSort,
}) => {
  const renderSortIcon = (field: keyof IInfoResponse) => {
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
              Имя блока
              <span className={styles.sortArrow}>{renderSortIcon('name')}</span>
            </th>
            {/* <th
              onClick={() => onSort && onSort('title')}
              style={{ cursor: 'pointer', minWidth: 120 }}>
              Заголовок
              <span className={styles.sortArrow}>{renderSortIcon('title')}</span>
            </th> */}
            <th
              onClick={() => onSort && onSort('createdAt')}
              style={{ cursor: 'pointer', minWidth: 120 }}>
              Менеджер
              <span className={styles.sortArrow}>{renderSortIcon('createdAt')}</span>
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
          {infos.map((info) => (
            <tr key={info._id}>
              <td style={{ cursor: 'pointer' }} onClick={() => onInfoEdit(info.name_eng)}>{info.name} </td>
              <td>{info.manager}</td>
    
              <td>{dayjs(info.updatedAt).format('DD.MM.YYYY')}</td>
              <td>
                <div className={styles.actions}>
                  <button
                    className={styles.actionButton}
                    onClick={() => onInfoEdit(info.name_eng)}
                    title="Редактировать">
                    <Edit height={16} width={16} />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => onDeleteInfo(info._id)}
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
  );
};

export default InfoTable; 