import { useState, useMemo, useEffect } from 'react';
import { infoService } from '../../../services/info.service';
import { IInfoResponse } from '../../../types/info.types';
import { useSelector } from 'react-redux';
import { selectInfos } from '../../../store/selectors';
import { getErrorMessage } from '../../../utils/helpers';
import { useNavigate } from 'react-router-dom';

export const useInfo = () => {
  const infos = useSelector(selectInfos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof IInfoResponse>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!infos?.length)
      (async () => {
        try {
          setLoading(true);
          setError(null);
          await infoService.getAll();
        } catch (err) {
          setError('Ошибка при загрузке информации: ' + getErrorMessage(err));
        } finally {
          setLoading(false);
        }
      })();
  }, []);

  const sortedInfos = useMemo(() => {
    const arr = [...infos];
    arr.sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [infos, sortField, sortOrder]);

  const handleSortInfos = (field: keyof IInfoResponse) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleCreate = async (data: Partial<IInfoResponse>) => {
    try {
      setLoading(true);
      await infoService.create(data);
      setIsModalOpen(false);
    } catch (err) {
      setError('Ошибка создания блока: ' + getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить блок?')) return;
    try {
      setLoading(true);
      await infoService.delete(id);
    } catch (err) {
      setError('Ошибка удаления блока: ' + getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<IInfoResponse>) => {
    try {
      setLoading(true);
      await infoService.update(id, data);
      setIsModalOpen(false);
    } catch (err) {
      setError('Ошибка обновления блока: ' + getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (name_eng: string) => {
    navigate(`/info/${name_eng}`);
  };

  return {
    infos: sortedInfos,
    loading,
    error,
    sortField,
    sortOrder,
    isModalOpen,
    setIsModalOpen,
    handleSortInfos,
    handleCreate,
    handleDelete,
    handleUpdate,
    handleEdit
  };
}; 