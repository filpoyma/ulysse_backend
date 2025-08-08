import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { referencesService } from '../../../services/references.service';
import { selectReferences } from '../../../store/selectors';
import { IReferencesResponse } from '../../../types/references.types';
import { getErrorMessage } from '../../../utils/helpers';
import { useNavigate } from 'react-router-dom';

export const useReferences = () => {
  const references = useSelector(selectReferences);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof IReferencesResponse>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchReferences();
  }, []);

  const fetchReferences = async () => {
    try {
      setLoading(true);
      setError(null);
      await referencesService.getAll();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSortReferences = (field: keyof IReferencesResponse) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleCreate = async (data: Partial<IReferencesResponse>) => {
    try {
      setError(null);
      await referencesService.create(data);
      setIsModalOpen(false);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await referencesService.delete(id);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleEdit = (name_eng: string) => {
    // Здесь можно добавить навигацию к странице редактирования
    navigate(`/references/${name_eng}`);
  };

  const sortedReferences = [...references].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === 'asc' ? comparison : -comparison;
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      const comparison = aValue.getTime() - bValue.getTime();
      return sortOrder === 'asc' ? comparison : -comparison;
    }

    return 0;
  });

  return {
    references: sortedReferences,
    loading,
    error,
    sortField,
    sortOrder,
    isModalOpen,
    setIsModalOpen,
    handleSortReferences,
    handleCreate,
    handleDelete,
    handleEdit,
  };
}; 