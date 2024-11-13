import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { uk } from 'date-fns/locale'; // Импортируем локаль для украинского языка
import { db } from '../config/firebaseConfig'; // Импорт Firebase-конфигурации
import { collection, getDocs, query, where } from 'firebase/firestore';
import vetsData from '../data/vets.json'; // Импорт JSON с врачами
import './History.css';

registerLocale('uk', uk); // Регистрируем локаль для календаря

const History = ({ userId }) => {
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [selectedVet, setSelectedVet] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [pets, setPets] = useState([]); // Состояние для хранения питомцев

  // Функция для загрузки питомцев из Firebase
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const petsCollection = collection(db, 'pets'); // Путь к коллекции с питомцами
        const petsQuery = query(petsCollection, where('userId', '==', userId)); // Фильтр по userId
        const petsSnapshot = await getDocs(petsQuery);

        const petsList = petsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setPets(petsList); // Сохраняем питомцев в состояние
      } catch (error) {
        console.error("Ошибка при загрузке питомцев:", error);
      }
    };

    if (userId) {
      fetchPets();
    }
  }, [userId]);

  // Фильтр доступных дней
  const filterDate = (date) => {
    const day = date.getDay();
    return day !== 0; // Доступны только Пн-Сб
  };

  // Фильтр доступных временных интервалов
  const filterTime = (time) => {
    const date = new Date(time);
    const day = date.getDay();
    const hours = date.getHours();

    if (day >= 1 && day <= 5) {
      return hours >= 8 && hours < 19;
    }
    if (day === 6) {
      return hours >= 9 && hours < 15;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVet || !selectedPet) {
      alert("Оберіть ветеринара та улюбленця.");
      return;
    }

    try {
      alert(`Запис до ветеринара створено успішно!`);
      setAppointmentDate(new Date());
      setSelectedVet('');
      setSelectedPet('');
    } catch (error) {
      console.error("Помилка при створенні запису:", error);
    }
  };

  return (
    <div className="history-container">
      <h2>Запис до ветеринара</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Оберіть дату та час</label>
          <DatePicker
            selected={appointmentDate}
            onChange={setAppointmentDate}
            className="form-control custom-datepicker"
            showTimeSelect
            dateFormat="dd/MM/yyyy HH:mm"
            timeIntervals={30}
            filterDate={filterDate}
            filterTime={filterTime}
            locale="uk" // Используем "uk" для украинской локали
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Оберіть ветеринара</label>
          <select
            name="vet"
            value={selectedVet}
            onChange={(e) => setSelectedVet(e.target.value)}
            className="form-control"
            required
          >
            <option value="">Оберіть ветеринара</option>
            {vetsData.vets.map((vet) => (
              <option key={vet.id} value={vet.id}>
                {vet.name} - {vet.specialization}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Оберіть улюбленця</label>
          <select
            name="pet"
            value={selectedPet}
            onChange={(e) => setSelectedPet(e.target.value)}
            className="form-control"
            required
          >
            <option value="">Оберіть улюбленця</option>
            {pets.length > 0 ? (
              pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))
            ) : (
              <option disabled>Немає доступних улюбленців</option>
            )}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Створити запис</button>
      </form>
    </div>
  );
};

export default History;