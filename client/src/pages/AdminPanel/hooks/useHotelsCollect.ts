import { useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hotelService } from '../../../services/hotel.service';
import { hotelActions } from '../../../store/reducers/hotel';
import { IHotel, IHotelCreate } from '../../../types/hotel.types.ts';
import { selectHotels } from '../../../store/selectors.ts';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../../../utils/helpers.ts';

const defaultHotel = {
  name: '',
  country: '',
  city: '',
  region: '',
};

export const useHotelsCollect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const hotels = useSelector(selectHotels);
  const [isCreatingHotel, setIsCreatingHotel] = useState(false);
  const [newHotel, setNewHotel] = useState<IHotelCreate>(defaultHotel);
  const [editingHotelId, setEditingHotelId] = useState<string | null>(null);
  const [editingHotelData, setEditingHotelData] = useState<IHotelCreate>(defaultHotel);
  const [sortField, setSortField] = useState<keyof IHotel>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const sortedHotels = useMemo(() => {
    const sortedHotels = [...hotels];
    sortedHotels.sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sortedHotels;
  }, [hotels, sortField, sortOrder]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError(null);
      await hotelService.getAll();
    } catch (err) {
      setError(getErrorMessage(err));
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSortHotels = (field: keyof IHotel) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleHotelClick = (id: string) => {
    const hotel = hotels.find((h: IHotel) => h._id === id);
    if (!hotel) return;
    setEditingHotelId(id);
    setEditingHotelData({
      name: hotel.name,
      country: hotel.country,
      city: hotel.city,
      region: hotel.region,
    });
    //setTimeout(() => nameInputRef.current?.focus(), 0);
  };

  const handleEditHotelChange = (field: keyof IHotel, value: string) => {
    setEditingHotelData((prev) => ({ ...prev, [field]: value }));
  };

  const handleHotelEdit = (id: string) => {
    navigate(`/admin/hotels/hotel/edit/${id}`);
  };

  const handleSaveEditHotel = async () => {
    if (!editingHotelId) return;
    if (!editingHotelData.name || !editingHotelData.country || !editingHotelData.city) {
      setError('Заполните все обязательные поля');
      return;
    }
    try {
      setError(null);
      await hotelService.update(editingHotelId, editingHotelData);
      setEditingHotelId(null);
      setEditingHotelData(defaultHotel);
    } catch (err) {
      setError('Ошибка при редактировании отеля: ' + getErrorMessage(err));
      console.error('Error editing hotel:', err);
    }
  };

  const handleCancelEditHotel = () => {
    setEditingHotelId(null);
    setEditingHotelData(defaultHotel);
  };

  const handleDeleteHotel = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот отель?')) return;
    try {
      setError(null);
      await hotelService.delete(id);
    } catch (err) {
      setError('Ошибка удаления отеля: ' + getErrorMessage(err));
      console.error('Error deleting hotel:', err);
    }
  };

  const handleCreateHotelClick = () => {
    setIsCreatingHotel(true);
    setNewHotel(defaultHotel);
    setTimeout(() => nameInputRef.current?.focus(), 0);
  };

  const handleNewHotelChange = (field: keyof IHotel, value: string) => {
    setNewHotel((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveNewHotel = async () => {
    if (!newHotel.name || !newHotel.country || !newHotel.city) {
      setError('Заполните обязательные поля');
      return;
    }
    try {
      setError(null);
      const res = await hotelService.create({
        name: newHotel.name,
        country: newHotel.country,
        city: newHotel.city,
        region: newHotel.region,
      });
      dispatch(hotelActions.addHotel(res.data));
      setIsCreatingHotel(false);
      setNewHotel({ name: '', country: '', city: '', region: '' });
    } catch (err) {
      setError(`Ошибка при создании отеля: ${getErrorMessage(err)}`);
      console.error('Error creating hotel:', err);
    }
  };

  const handleCancelNewHotel = () => {
    setIsCreatingHotel(false);
    setError(null);
    setNewHotel({ name: '', country: '', city: '', region: '' });
  };

  const handleNavigateToHotelPage = (id: string) => {
    navigate(`/hotel/${id}`);
  };

  return {
    hotels: sortedHotels,
    isCreatingHotel,
    newHotel,
    editingHotelId,
    editingHotelData,
    sortField,
    sortOrder,
    error,
    loading,
    nameInputRef,
    handleSortHotels,
    handleHotelClick,
    handleEditHotelChange,
    handleSaveEditHotel,
    handleCancelEditHotel,
    handleDeleteHotel,
    handleCreateHotelClick,
    handleNewHotelChange,
    handleSaveNewHotel,
    handleCancelNewHotel,
    handleNavigateToHotelPage,
    handleHotelEdit,
    fetchHotels,
  };
};
