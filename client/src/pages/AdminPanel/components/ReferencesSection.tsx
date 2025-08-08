import { useReferences } from '../hooks/useReferences';
import { SectionHeader } from './SectionHeader';
import ReferencesTable from './ReferencesTable';
import { Loader } from '../../../components/Loader/Loader';
import styles from '../adminLayout.module.css';
import CreateReferencesModal from '../../../components/CreateReferencesModal/CreateReferencesModal';

const ReferencesSection = () => {
  const {
    references,
    loading,
    error,
    sortField,
    sortOrder,
    isModalOpen,
    setIsModalOpen,
    handleSortReferences,
    handleCreate,
    handleDelete,
    handleEdit
  } = useReferences();

  if (loading) return <Loader />;

  return (
    <>
      <SectionHeader title="Список справочников" onCreateClick={() => setIsModalOpen(true)} />
      {error && <div className={styles.error}>{error}</div>}
      <ReferencesTable
        references={references}
        onReferenceEdit={handleEdit}
        onDeleteReference={handleDelete}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSortReferences}
      />
      <CreateReferencesModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </>
  );
};

export default ReferencesSection;
