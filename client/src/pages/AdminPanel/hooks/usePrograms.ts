import { useState, useMemo, useEffect } from 'react';
import { travelProgramService } from '../../../services/travelProgram.service';
import { ITravelProgramResponse } from '../../../types/travelProgram.types';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../../../utils/helpers.ts';
import { useSelector } from 'react-redux';
import { selectTravelPrograms } from '../../../store/selectors.ts';

export const usePrograms = () => {
  const navigate = useNavigate();

  const programs = useSelector(selectTravelPrograms);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof ITravelProgramResponse>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (!programs?.length)
      (async () => {
        try {
          setLoading(true);
          setError(null);
          await travelProgramService.getAll();
        } catch (err) {
          setError('Ошибка при загрузке программ: ' + getErrorMessage(err));
          console.error('Error fetching programs:', err);
        } finally {
          setLoading(false);
        }
      })();
  }, []);

  const sortedPrograms = useMemo(() => {
    const arr = [...programs];
    arr.sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [programs, sortField, sortOrder]);

  const handleSortPrograms = (field: keyof ITravelProgramResponse) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleCreateTemplate = () => setIsModalOpen(true);

  const handleCreateTemplateSubmit = async (name: string) => {
    try {
      await travelProgramService.createTemplate(name);
      setIsModalOpen(false);
    } catch (err) {
      setError('Ошибка создания шаблона: ' + getErrorMessage(err));
      console.error('Error creating template:', err);
    }
  };

  const handleDeleteProgram = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту программу?')) return;

    try {
      await travelProgramService.delete(id);
    } catch (err) {
      setError('Ошибка удаления программы: ' + getErrorMessage(err));
      console.error('Error deleting program:', err);
    }
  };

  const handleProgramClick = (name_eng: string) => {
    navigate(`/travel-programm/${name_eng}`);
  };
  const handleProgramEdit = (name_eng: string) => {
    navigate(`/travel-programm/${name_eng}`);
  };

  return {
    programs: sortedPrograms,
    loading,
    error,
    isModalOpen,
    setIsModalOpen,
    sortField,
    sortOrder,
    handleSortPrograms,
    handleCreateTemplate,
    handleCreateTemplateSubmit,
    handleDeleteProgram,
    handleProgramClick,
    handleProgramEdit,
  };
};
