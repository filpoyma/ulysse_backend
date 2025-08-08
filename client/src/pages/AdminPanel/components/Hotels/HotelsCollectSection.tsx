import { FC, useEffect } from 'react';
import { useHotelsCollect } from '../../hooks/useHotelsCollect.ts';
import HotelsCollectTable from './HotelsCollectTable.tsx';
import { Loader } from '../../../../components/Loader/Loader.tsx';
import styles from '../../adminLayout.module.css';

const HotelsCollectSection: FC = () => {
  const {
    hotels,
    isCreatingHotel,
    newHotel,
    sortField,
    sortOrder,
    error,
    loading,
    nameInputRef,
    handleSortHotels,
    handleDeleteHotel,
    handleCreateHotelClick,
    handleNewHotelChange,
    handleSaveNewHotel,
    handleCancelNewHotel,
    handleNavigateToHotelPage,
    handleHotelEdit,
    fetchHotels,
  } = useHotelsCollect();

  useEffect(() => {
    if (!hotels.length) fetchHotels();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      {error && <div className={styles.error}>{error}</div>}
      <HotelsCollectTable
        hotels={hotels}
        onDeleteHotel={handleDeleteHotel}
        isCreatingHotel={isCreatingHotel}
        newHotel={newHotel}
        onNewHotelChange={handleNewHotelChange}
        onSaveNewHotel={handleSaveNewHotel}
        onCancelNewHotel={handleCancelNewHotel}
        nameInputRef={nameInputRef}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSortHotels}
        handleCreateHotelClick={handleCreateHotelClick}
        handleNavigateToHotelPage={handleNavigateToHotelPage}
        handleHotelEdit={handleHotelEdit}
      />
    </>
  );
};

export default HotelsCollectSection;
