import { useCallback, useState, useRef, useMemo } from 'react';
import { restaurantService } from '../../../services/restaurant.service';
import { IRestaurant } from '../../../types/restaurant.types';
import { useSelector } from 'react-redux';
import { getErrorMessage } from '../../../utils/helpers.ts';
import { selectAdminEmail, selectRestaurants } from '../../../store/selectors.ts';
import { useNavigate } from 'react-router-dom';

const emptyRestaurant: Omit<IRestaurant, '_id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  name_eng: '',
  country: '',
  city: '',
  region: '',
  link: '',
  manager: '',
  address: '',
  description: '',
  coordinates: [0, 0],
  gallery: [],
  titleImage: {} as any,
  stars: 1,
  cookDescription: '',
  shortInfo: [],
};

export const useRestarauntsCollect = () => {
  const navigate = useNavigate();
  const restaraunts = useSelector(selectRestaurants);
  const currentUser = useSelector(selectAdminEmail) || '';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingRestaraunt, setIsCreatingRestaraunt] = useState(false);
  const [newRestaraunt, setNewRestaraunt] = useState<typeof emptyRestaurant>(emptyRestaurant);
  const [sortField, setSortField] = useState<keyof IRestaurant>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const nameInputRef = useRef<HTMLInputElement>(null);

  const sortedRestaraunts = useMemo(() => {
    const arr = [...restaraunts];
    arr.sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [restaraunts, sortField, sortOrder]);

  const handleSortRestaraunts = (field: keyof IRestaurant) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const fetchRestaraunts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await restaurantService.getAll();
    } catch (err) {
      setError('Ошибка загрузки ресторанов: ' + getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateRestarauntClick = () => {
    setIsCreatingRestaraunt(true);
    setNewRestaraunt({
      ...emptyRestaurant,
    });
    setError(null);
  };

  const handleNewRestarauntChange = (field: keyof IRestaurant, value: string | number) => {
    if (field === 'manager') return;
    setNewRestaraunt((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveNewRestaraunt = async () => {
    try {
      setLoading(true);
      await restaurantService.create(newRestaraunt);
      setIsCreatingRestaraunt(false);
      setNewRestaraunt(emptyRestaurant);
      setError(null);
    } catch (err) {
      setError('Ошибка создания ресторана' + getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRestaraunt = async (id: string) => {
    try {
      setLoading(true);
      await restaurantService.copy(id);
      setError(null);
    } catch (err) {
      setError('Ошибка копирования ресторана' + getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelNewRestaraunt = () => {
    setIsCreatingRestaraunt(false);
    setNewRestaraunt(emptyRestaurant);
  };

  const handleDeleteRestaraunt = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот ресторан?')) return;
    try {
      setLoading(true);
      await restaurantService.delete(id);
      setError(null);
    } catch (err) {
      setError('Ошибка удаления ресторана: ' + getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRestarauntEdit = (id: string) => {
    navigate(`/admin/restaurants/restaurant/edit/${id}`);
  };

  return {
    restaraunts: sortedRestaraunts,
    currentUser,
    isCreatingRestaraunt,
    newRestaraunt,
    sortField,
    sortOrder,
    error,
    loading,
    nameInputRef,
    handleSortRestaraunts,
    handleDeleteRestaraunt,
    handleCreateRestarauntClick,
    handleNewRestarauntChange,
    handleSaveNewRestaraunt,
    handleCancelNewRestaraunt,
    handleRestarauntEdit,
    handleCopyRestaraunt,
    fetchRestaraunts,
  };
};
