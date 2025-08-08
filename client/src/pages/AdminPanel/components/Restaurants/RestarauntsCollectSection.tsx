import { useEffect } from 'react';
import { SectionHeader } from '../SectionHeader.tsx';
import RestarauntsCollectTable from './RestarauntsCollectTable.tsx';
import { useRestarauntsCollect } from '../../hooks/useRestarauntsCollect.ts';
import styles from '../../adminLayout.module.css';
import { Loader } from '../../../../components/Loader/Loader.tsx';

const RestaurantsCollectSection = () => {
  const {
    restaraunts,
    loading,
    error,
    isCreatingRestaraunt,
    newRestaraunt,
    sortField,
    sortOrder,
    nameInputRef,
    handleSortRestaraunts,
    handleDeleteRestaraunt,
    handleCreateRestarauntClick,
    handleNewRestarauntChange,
    handleSaveNewRestaraunt,
    handleCancelNewRestaraunt,
    fetchRestaraunts,
    handleRestarauntEdit,
  } = useRestarauntsCollect();

  useEffect(() => {
    if (!restaraunts.length) fetchRestaraunts();
  }, []);

  return (
    <div className={styles.section}>
      <SectionHeader
        title="Список ресторанов"
        onCreateClick={handleCreateRestarauntClick}
        isCreating={isCreatingRestaraunt}
      />
      {error && <div className={styles.error}>{error}</div>}
      {loading ? (
        <Loader />
      ) : (
        <RestarauntsCollectTable
          restaraunts={restaraunts}
          onRestarauntEdit={handleRestarauntEdit}
          onDeleteRestaraunt={handleDeleteRestaraunt}
          isCreatingRestaraunt={isCreatingRestaraunt}
          newRestaraunt={newRestaraunt}
          onNewRestarauntChange={handleNewRestarauntChange}
          onSaveNewRestaraunt={handleSaveNewRestaraunt}
          onCancelNewRestaraunt={handleCancelNewRestaraunt}
          nameInputRef={nameInputRef}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSortRestaraunts}
        />
      )}
    </div>
  );
};

export default RestaurantsCollectSection;
