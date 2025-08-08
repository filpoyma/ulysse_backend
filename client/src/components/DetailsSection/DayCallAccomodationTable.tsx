import styles from './index.module.css';

interface DayCellProps {
  daysPeriod: string;
  isEditable: boolean;
  daysPeriodChange: (newDate: string) => void;
}

export function DayCallAccomodationTable({
  daysPeriod,
  isEditable,
  daysPeriodChange,
}: DayCellProps) {
  return (
    <div className={'day-cell'}>
      {isEditable ? (
        <input
          type="text"
          defaultValue={daysPeriod}
          className={styles['editable-input']}
          onChange={e => daysPeriodChange && daysPeriodChange(e.target.value)}
        />
      ) : (
        <div className={'day-date'}>{daysPeriod}</div>
      )}
    </div>
  );
}
