import { FC, useEffect } from 'react';
import { useRestaurantsList } from '../../hooks/useRestaurantsList.ts';
import RestaurantsListTable from './RestaurantsListTable.tsx';
import { Loader } from '../../../../components/Loader/Loader.tsx';
import styles from '../../adminLayout.module.css';

const RestaurantsListSection: FC = () => {
  const {
    restaurantsLists,
    isCreatingList,
    newList,
    sortField,
    sortOrder,
    error,
    loading,
    nameInputRef,
    handleSortLists,
    handleDeleteList,
    handleCreateListClick,
    handleNewListChange,
    handleSaveNewList,
    handleCancelNewList,
    handleNavigateToListPage,
    fetchRestaurantsLists,
  } = useRestaurantsList();

  useEffect(() => {
    if (!restaurantsLists.length) fetchRestaurantsLists();
  }, []);

  const handleEditSuccess = () => {
    fetchRestaurantsLists();
  };

  return (
    <>
      {error && <div className={styles.error}>{error}</div>}
      {loading ? (
        <Loader />
      ) : (
        <RestaurantsListTable
          restaurantsLists={restaurantsLists}
          onDeleteList={handleDeleteList}
          isCreatingList={isCreatingList}
          newList={newList}
          onNewListChange={handleNewListChange}
          onSaveNewList={handleSaveNewList}
          onCancelNewList={handleCancelNewList}
          nameInputRef={nameInputRef}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSortLists}
          handleCreateListClick={handleCreateListClick}
          handleNavigateToListPage={handleNavigateToListPage}
        />
      )}
    </>
  );
};

export default RestaurantsListSection;
