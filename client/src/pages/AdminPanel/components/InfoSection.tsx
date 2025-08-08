import { useInfo } from '../hooks/useInfo';
import { SectionHeader } from './SectionHeader';
import InfoTable from './InfoTable';
import { Loader } from '../../../components/Loader/Loader';
import styles from '../adminLayout.module.css';
import CreateInfoModal from '../../../components/CreateInfoModal/CreateInfoModal';

const InfoSection = () => {
  const {
    infos,
    loading,
    error,
    sortField,
    sortOrder,
    isModalOpen,
    setIsModalOpen,
    handleSortInfos,
    handleCreate,
    handleDelete,
    handleEdit
  } = useInfo();


  if (loading) return <Loader />;

  return (
    <>
      <SectionHeader title="Список информационных блоков" onCreateClick={() => setIsModalOpen(true)} />
      {error && <div className={styles.error}>{error}</div>}
      <InfoTable
        infos={infos}
        onInfoEdit={handleEdit}
        onDeleteInfo={handleDelete}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSortInfos}
      />
      <CreateInfoModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </>
  );
};

export default InfoSection;
