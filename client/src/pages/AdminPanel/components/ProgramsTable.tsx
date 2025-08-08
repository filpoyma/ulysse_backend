import { FC } from 'react';
import ChevronDown from '../../../assets/icons/chevronDown.svg';
import Edit from '../../../assets/icons/edit.svg';
import Trash2 from '../../../assets/icons/trash2.svg';
import ChevronUp from '../../../assets/icons/chevronUp.svg';
import { ITravelProgramResponse } from '../../../types/travelProgram.types.ts';
import styles from '../adminLayout.module.css';
import dayjs from 'dayjs';

interface ProgramsTableProps {
  programs: ITravelProgramResponse[];
  onProgramClick: (id: string) => void;
  onProgramEdit: (id: string) => void;
  onDeleteProgram: (id: string) => void;
  sortField?: keyof ITravelProgramResponse;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: keyof ITravelProgramResponse) => void;
}

const ProgramsTable: FC<ProgramsTableProps> = ({
  programs,
  onProgramClick,
  onDeleteProgram,
  onProgramEdit,
  sortField,
  sortOrder,
  onSort,
}) => {
  const renderSortIcon = (field: keyof ITravelProgramResponse) => {
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
              Имя программы
              <span className={styles.sortArrow}>{renderSortIcon('name')}</span>
            </th>
            {/* <th
              onClick={() => onSort && onSort('createdAt')}
              style={{ cursor: 'pointer', minWidth: 120 }}>
              Дата создания
              <span className={styles.sortArrow}>{renderSortIcon('createdAt')}</span>
            </th> */}
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
          {programs.map((program) => (
            <tr key={program._id}>
              <td>
                <span
                  className={styles.programName}
                  onClick={() => onProgramClick(program.name_eng)}>
                  {program.name}
                </span>
              </td>
              {/* <td>{new Date(program.createdAt).toLocaleString()}</td> */}
              <td>{program.manager}</td>
              <td>{dayjs(program.updatedAt).format('DD.MM.YYYY')}</td>
              <td>
                <div className={styles.actions}>
                  <button
                    className={styles.actionButton}
                    onClick={() => onProgramEdit(program._id)}
                    title="Редактировать">
                    <Edit height={16} width={16} />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => onDeleteProgram(program._id)}
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

export default ProgramsTable;
