import { FC } from 'react';
import Plus from '../../../assets/icons/plus.svg';
import styles from '../adminLayout.module.css';

interface SectionHeaderProps {
  title: string;
  onCreateClick: () => void;
  isCreating?: boolean;
}

// function getButtonText(title: string) {
//   switch (true) {
//     case /путешествий/i.test(title):
//       return 'Создать программу';
//     case /ресторан/i.test(title):
//       return 'Создать ресторан';
//     case /отелей/i.test(title):
//       return 'Создать отель';
//     default:
//       return 'Создать';
//   }
// }

export const SectionHeader: FC<SectionHeaderProps> = ({
  title,
  onCreateClick,
  isCreating = false,
}) => {
  return (
    <div className={styles.header}>
      <h2>{title}</h2>
      <button className={styles.createButton} onClick={onCreateClick} disabled={isCreating}>
        <Plus height={20} width={20} />
      </button>
    </div>
  );
};
