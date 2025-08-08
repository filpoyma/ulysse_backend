import { FC } from 'react';
import ChevronDown from '../../../assets/icons/chevronDown.svg';
import Edit from '../../../assets/icons/edit.svg';
import Trash2 from '../../../assets/icons/trash2.svg';
import ChevronUp from '../../../assets/icons/chevronUp.svg';
import { IReferencesResponse } from '../../../types/references.types';
import styles from '../adminLayout.module.css';

interface ReferencesTableProps {
  references: IReferencesResponse[];
  onReferenceEdit: (id: string) => void;
  onDeleteReference: (id: string) => void;
  sortField?: keyof IReferencesResponse;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: keyof IReferencesResponse) => void;
}

const ReferencesTable: FC<ReferencesTableProps> = ({
  references,
  onReferenceEdit,
  onDeleteReference,
  sortField,
  sortOrder,
  onSort,
}) => {
  const renderSortIcon = (field: keyof IReferencesResponse) => {
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
              onClick={() => onSort && onSort('manager')}
              style={{ cursor: 'pointer', minWidth: 120 }}>
              Менеджер
              <span className={styles.sortArrow}>{renderSortIcon('manager')}</span>
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
          {references.map((reference) => (
            <tr key={reference._id}>
              <td style={{ cursor: 'pointer' }} onClick={() => onReferenceEdit(reference.name_eng)}>
                {reference.name}
              </td>
              <td>{reference.manager}</td>
              <td>{new Date(reference.updatedAt).toLocaleString()}</td>
              <td>
                <div className={styles.actions}>
                  <button
                    className={styles.actionButton}
                    onClick={() => onReferenceEdit(reference.name_eng)}
                    title="Редактировать">
                    <Edit height={16} width={16} />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => onDeleteReference(reference._id)}
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

export default ReferencesTable; 