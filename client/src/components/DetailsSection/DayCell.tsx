import dayjs from 'dayjs';
import styles from './index.module.css';

interface DayCellProps {
  title: string;
  subtitle: string;
  date: string;
  isEditable?: boolean;
  onDateChange?: (newDate: string) => void;
  onTitleChange?: (newTitle: string) => void;
}

export function DayCell({ title, subtitle, date, isEditable, onDateChange, onTitleChange }: DayCellProps) {
  return (
    <div className={'day-cell'}>
      {isEditable ? (
        <input
          type="number"
          defaultValue={title}
          className={styles['editable-input']}
          onChange={e => onTitleChange && onTitleChange(e.target.value)}
        />
      ) : (
        <div className={'day-title'}>{`День ${title}`}</div>
      )}
      <div className={'day-date'}>{subtitle}</div>

      {isEditable ? (
        <input
          type="date"
          defaultValue={dayjs(date, 'DD MMMM YYYY').format('YYYY-MM-DD')}
          className={styles['editable-input']}
          onChange={e => onDateChange && onDateChange(e.target.value)}
        />
      ) : (
        <div className={'day-date'}>{date}</div>
      )}
    </div>
  );
}
