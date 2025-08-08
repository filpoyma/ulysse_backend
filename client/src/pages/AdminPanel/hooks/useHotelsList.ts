import { useState, useRef, useMemo } from 'react';
import { hotelsListService } from '../../../services/hotelsList.service';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../../../utils/helpers.ts';
import { ICreateHotelsListData, IHotelsList } from '../../../types/hotelsList.types.ts';
import { useSelector } from 'react-redux';
import { selectHotelsList } from '../../../store/selectors.ts';

export const useHotelsList = () => {
  const navigate = useNavigate();

  const hotelsLists = useSelector(selectHotelsList);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newList, setNewList] = useState<ICreateHotelsListData>({
    name: '',
    description: '',
  });
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingListData, setEditingListData] = useState<ICreateHotelsListData>({
    name: '',
    description: '',
  });
  const [sortField, setSortField] = useState<keyof IHotelsList>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const sortedHotelsLists = useMemo(() => {
    const arr = [...hotelsLists];
    arr.sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [hotelsLists, sortField, sortOrder]);

  const fetchHotelsLists = async () => {
    try {
      setLoading(true);
      setError(null);
      await hotelsListService.getAll();
    } catch (err) {
      setError('Ошибка при загрузке списков отелей: ' + getErrorMessage(err));
      console.error('Error fetching hotels lists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSortLists = (field: keyof IHotelsList) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleListClick = (id: string) => {
    const list = hotelsLists.find((l: IHotelsList) => l._id === id);
    if (!list) return;
    setEditingListId(id);
    setEditingListData({
      name: list.name,
      description: list.description,
    });
  };

  const handleEditListChange = (field: keyof IHotelsList, value: string) => {
    setEditingListData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEditList = async () => {
    if (!editingListId) return;
    if (!editingListData.name) {
      setError('Заполните название списка');
      return;
    }
    try {
      setError(null);
      await hotelsListService.update(editingListId, editingListData);
      setEditingListId(null);
      setEditingListData({ name: '', description: '' });
      await fetchHotelsLists(); // Обновляем список
    } catch (err) {
      setError('Ошибка при редактировании списка: ' + getErrorMessage(err));
      console.error('Error editing list:', err);
    }
  };

  const handleCancelEditList = () => {
    setEditingListId(null);
    setEditingListData({ name: '', description: '' });
  };

  const handleDeleteList = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот список отелей?')) return;
    try {
      setError(null);
      await hotelsListService.delete(id);
      await fetchHotelsLists(); // Обновляем список
    } catch (err: any) {
      setError('Ошибка удаления списка: ' + getErrorMessage(err));
      console.error('Error deleting list:', err);
    }
  };

  const handleCreateListClick = () => {
    setIsCreatingList(true);
    setNewList({ name: '', description: '' });
    setTimeout(() => nameInputRef.current?.focus(), 0);
  };

  const handleNewListChange = (field: keyof IHotelsList, value: string) => {
    setNewList((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveNewList = async () => {
    if (!newList.name) {
      setError('Заполните название списка');
      return;
    }
    try {
      setError(null);
      await hotelsListService.create(newList);
      setIsCreatingList(false);
      setNewList({ name: '', description: '' });
      await fetchHotelsLists(); // Обновляем список
    } catch (err) {
      setError(`Ошибка при создании списка ${getErrorMessage(err)}`);
      console.error('Error creating list:', err);
    }
  };

  const handleCancelNewList = () => {
    setIsCreatingList(false);
    setError(null);
    setNewList({ name: '', description: '' });
  };

  const handleNavigateToListPage = (id: string) => {
    navigate(`/hotels/${id}`);
  };

  return {
    hotelsLists: sortedHotelsLists,
    isCreatingList,
    newList,
    editingListId,
    editingListData,
    sortField,
    sortOrder,
    error,
    loading,
    nameInputRef,
    handleSortLists,
    handleListClick,
    handleEditListChange,
    handleSaveEditList,
    handleCancelEditList,
    handleDeleteList,
    handleCreateListClick,
    handleNewListChange,
    handleSaveNewList,
    handleCancelNewList,
    handleNavigateToListPage,
    fetchHotelsLists,
  };
};
