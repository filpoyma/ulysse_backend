import { ChangeEvent, useEffect, useState } from 'react';
import { IHotel } from '../../../../types/hotel.types.ts';
import { hotelsListService } from '../../../../services/hotelsList.service.ts';
import styles from '../../adminLayout.module.css';
import { Loader } from '../../../../components/Loader/Loader.tsx';
import { hotelService } from '../../../../services/hotel.service.ts';
import { useSelector } from 'react-redux';
import { selectHotels } from '../../../../store/selectors.ts';
import { getErrorMessage, getImagePath } from '../../../../utils/helpers.ts';
import ChevronUp from '../../../../assets/icons/chevronUp.svg';
import ChevronDown from '../../../../assets/icons/chevronDown.svg';
import { useNavigate, useParams } from 'react-router-dom';
import ImageUploadHotels from '../../../../components/ImageUploadModal/ImageUploadHotels.tsx';
import Edit from '../../../../assets/icons/edit.svg';
import X from '../../../../assets/icons/x.svg';
import Plus from '../../../../assets/icons/plus.svg';

const HotelsListEditPage = () => {
  const { id } = useParams();
  const allHotels = useSelector(selectHotels);
  const [selectedHotels, setSelectedHotels] = useState<IHotel[]>([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [listHeaders, setListHeaders] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEdited, setIsEdited] = useState(false);
  const [titleImage, setTitleImage] = useState<{ _id: string; path: string; filename: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Загрузка списка и всех отелей
  useEffect(() => {
    async function fetchData(id: string) {
      setLoading(true);
      try {
        await hotelService.getAll();
        const listRes = await hotelsListService.getById(id);
        setListHeaders({
          name: listRes.data.name || '',
          description: listRes.data.description || '',
        });
        console.log(listRes)
        //@ts-ignore
        setSelectedHotels(listRes.data.hotels);
        setTitleImage(listRes.data.titleImage || null);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData(id);
  }, [id]);

  // Фильтрация по поиску и исключение уже выбранных
  const filteredHotels = allHotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(search.toLowerCase()) &&
      !selectedHotels.some((sel) => sel._id === hotel._id),
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setListHeaders((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddHotel = (hotel: IHotel) => {
    setIsEdited(true);
    setSelectedHotels((prev) => [...prev, hotel]);
  };

  const handleRemoveHotel = (hotelId: string) => {
    setIsEdited(true);
    setSelectedHotels((prev) => prev.filter((h) => h._id !== hotelId));
  };

  const handleReturnToHotelsList = () => navigate('/admin/hotels/lists');

  const moveHotelUp = (index: number) => {
    if (index === 0) return; // Нельзя поднять первый элемент
    setIsEdited(true);
    setSelectedHotels((prev) => {
      const newHotels = [...prev];
      [newHotels[index - 1], newHotels[index]] = [newHotels[index], newHotels[index - 1]];
      return newHotels;
    });
  };

  const moveHotelDown = (index: number) => {
    if (index === selectedHotels.length - 1) return; // Нельзя опустить последний элемент
    setIsEdited(true);
    setSelectedHotels((prev) => {
      const newHotels = [...prev];
      [newHotels[index], newHotels[index + 1]] = [newHotels[index + 1], newHotels[index]];
      return newHotels;
    });
  };

  const handleSelectTitleImage = (img: { _id: string; path: string; filename: string }) => {
    setTitleImage(img);
    setIsEdited(true);
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    if (!id) return;
    if (!listHeaders.name.trim() || selectedHotels.length === 0) {
      setError('Заполните название и выберите хотя бы один отель');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await hotelsListService.update(id, {
        name: listHeaders.name,
        description: listHeaders.description,
        hotels: selectedHotels.map((h) => h._id),
        titleImage: titleImage ? titleImage._id : undefined,
      });
      setIsEdited(false);
      handleReturnToHotelsList();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.editPageWrapper}>
      <ImageUploadHotels
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isMany={false}
        belongsToId={id}
        onSelectImage={handleSelectTitleImage}
      />
      <div className={styles.formRow}>
        <button
          className={styles.backButton}
          onClick={() => {
            if (isEdited && window.confirm('Сохранить изменеия?')) handleSave();
            else handleReturnToHotelsList();
          }}>
          К списку
        </button>
      </div>
      <h2>Редактировать список отелей</h2>
      <div className={styles.formRow}>
        <input
          className={styles.hotelCreateInput}
          type="text"
          name="name"
          placeholder="Название списка"
          value={listHeaders.name}
          onChange={handleChange}
        />
        <input
          className={styles.hotelCreateInput}
          type="text"
          name="description"
          placeholder="Описание"
          value={listHeaders.description}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formRow}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
          <label>Обложка списка:</label>
          <div onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
            {titleImage ? (
              <img src={getImagePath(titleImage.path)} alt="title" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
            ) : (
              <div style={{ width: 120, height: 120, background: '#eee', borderRadius: 8, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
                Нет изображения
              </div>
            )}
          </div>
      
        </div>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {loading ? (
        <Loader />
      ) : (
        <div className={styles.tablesRow}>
          {/* Таблица выбранных отелей */}
          <div className={styles.tableWrapper} style={{ flex: 1 }}>
            <div className={styles.tableHeader}>Выбранные отели</div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Страна</th>
                  <th>Город</th>
                  <th>Порядок</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {selectedHotels.map((hotel, index) => (
                  <tr key={hotel._id}>
                    <td>{hotel.name}</td>
                    <td>{hotel.country}</td>
                    <td>{hotel.city}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionButton}
                          onClick={() => moveHotelUp(index)}
                          disabled={index === 0}
                          title="Поднять выше">
                          <ChevronUp />
                        </button>
                        <button
                          className={styles.actionButton}
                          onClick={() => moveHotelDown(index)}
                          disabled={index === selectedHotels.length - 1}
                          title="Опустить ниже">
                          <ChevronDown />
                        </button>
                      </div>
                    </td>
                    <td>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleRemoveHotel(hotel._id)}
                        title="Удалить">
                        <X height={16} width={16} />
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={() => navigate(`/admin/hotels/hotel/edit/${hotel._id}`)}
                        title="Редактировать"
                        >
                        <Edit height={16} width={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.saveBtnContainer}>
            <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
              {saving ? 'Сохраняю...' : 'Сохранить список'}
            </button>
          </div>
          {/* Таблица всех отелей */}
          <div className={styles.tableWrapper} style={{ flex: 1 }}>
            <div className={styles.tableHeader}>
              <input
                className={styles.hotelCreateInput}
                type="text"
                placeholder="Поиск отеля"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginBottom: 8, width: '100%' }}
              />
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Страна</th>
                  <th>Город</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredHotels.map((hotel) => (
                  <tr key={hotel._id}>
                    <td>{hotel.name}</td>
                    <td>{hotel.country}</td>
                    <td>{hotel.city}</td>
                    <td>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleAddHotel(hotel)}
                        title="Добавить">
                        <Plus height={16} width={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelsListEditPage;
