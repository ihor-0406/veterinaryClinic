import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { uk } from 'date-fns/locale';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, query, where, addDoc, deleteDoc, doc } from 'firebase/firestore';
import vetsData from '../data/vets.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './History.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

registerLocale('uk', uk);

const History = () => {
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [selectedVet, setSelectedVet] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [selectedPetForChart, setSelectedPetForChart] = useState('');
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [newGrowthRecord, setNewGrowthRecord] = useState({ date: new Date(), weight: '', height: '' });

  // Загрузка питомцев при монтировании
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const petsCollection = collection(db, 'pets');
        const petsSnapshot = await getDocs(petsCollection);
        const petsList = petsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPets(petsList);
      } catch (error) {
        console.error("Ошибка при загрузке питомцев:", error);
      }
    };

    fetchPets();
  }, []);

  // Загрузка записей о посещениях при монтировании
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsCollection = collection(db, 'appointments');
        const appointmentsSnapshot = await getDocs(appointmentsCollection);
        const appointmentsList = appointmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(appointmentsList);
      } catch (error) {
        console.error("Ошибка при загрузке записей о посещениях:", error);
      }
    };

    fetchAppointments();
  }, []);

  // Загрузка истории болезней и данных для графика при выборе питомца
  useEffect(() => {
    const fetchMedicalHistory = async () => {
      if (selectedPet) {
        try {
          const historyQuery = query(collection(db, 'medicalHistory'), where('pet', '==', selectedPet));
          const historySnapshot = await getDocs(historyQuery);
          const historyList = historySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setMedicalHistory(historyList);
        } catch (error) {
          console.error("Ошибка при загрузке истории болезней:", error);
        }
      }
    };

    const fetchGrowthData = async () => {
      if (selectedPetForChart) {
        try {
          const growthQuery = query(collection(db, 'growthData'), where('pet', '==', selectedPetForChart));
          const growthSnapshot = await getDocs(growthQuery);
          const growthList = growthSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setGrowthData(growthList);
        } catch (error) {
          console.error("Ошибка при загрузке данных роста:", error);
        }
      }
    };

    fetchMedicalHistory();
    fetchGrowthData();
  }, [selectedPet, selectedPetForChart]);

  // Добавление новой записи о росте и весе
  const handleAddGrowthRecord = async () => {
    try {
      const newRecord = { ...newGrowthRecord, pet: selectedPetForChart };
      const docRef = await addDoc(collection(db, 'growthData'), newRecord);
      setGrowthData([...growthData, { id: docRef.id, ...newRecord }]);
      setNewGrowthRecord({ date: new Date(), weight: '', height: '' });
    } catch (error) {
      console.error("Ошибка при добавлении данных роста и веса:", error);
    }
  };

  const growthChartData = {
    labels: growthData.map(data => new Date(data.date).toLocaleDateString('uk-UA')),
    datasets: [
      {
        label: 'Вес (кг)',
        data: growthData.map(data => data.weight),
        borderColor: 'blue',
        backgroundColor: 'blue',
      },
      {
        label: 'Рост (см)',
        data: growthData.map(data => data.height),
        borderColor: 'green',
        backgroundColor: 'green',
      },
    ],
  };

  // Фильтры для дней и времени
  const filterDate = (date) => {
    const day = date.getDay();
    return day !== 0;
  };

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

    const newAppointment = {
      pet: selectedPet,
      vet: selectedVet,
      dateTime: appointmentDate.toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, 'appointments'), newAppointment);
      setAppointments([...appointments, { id: docRef.id, ...newAppointment }]);
      alert("Запис до ветеринара створено успішно!");
      setAppointmentDate(new Date());
      setSelectedVet('');
      setSelectedPet('');
    } catch (error) {
      console.error("Помилка при створенні запису:", error);
    }
  };
  const handleDelete = async (appointmentId) => {
    try {
      console.log(`Попытка удалить запись с id: ${appointmentId}`);
      await deleteDoc(doc(db, 'appointments', appointmentId)); // Удаляем запись из Firebase
  
      // Обновляем состояние, удаляя запись из списка
      setAppointments(prevAppointments => {
        const updatedAppointments = prevAppointments.filter(app => app.id !== appointmentId);
        console.log(`Оставшиеся записи после удаления:`, updatedAppointments);
        return updatedAppointments;
      });
  
      alert("Запис успішно видалено!");
    } catch (error) {
      console.error("Помилка при видаленні запису:", error);
    }
  };

  return (
    <div className="container history-container">
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
            locale="uk"
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
                <option key={pet.id} value={pet.name}>
                  {pet.name}
                </option>
              ))
            ) : (
              <option disabled>Немає доступних улюбленців</option>
            )}
          </select>
        </div>
        <button type="submit" className="btn btn-outline-success">Створити запис</button>
      </form>

      <h3 className="mt-4">Історія записів</h3>
      <table className="table table-bordered mt-2">
        <thead>
          <tr>
            <th>Дата та час</th>
            <th>Ветеринар</th>
            <th>Улюбленець</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((app) => (
              <tr key={app.id}>
                <td>{new Date(app.dateTime).toLocaleString('uk-UA')}</td>
                <td>{vetsData.vets.find(vet => vet.id === app.vet)?.name || 'Не знайдено'}</td>
                <td>{app.pet}</td>
                <td>
                  <button onClick={() => handleDelete(app.id)} className="btn">
                    <FontAwesomeIcon icon={faTrash} style={{ color: "#f40b0b" }} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Немає записів</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="d-flex flex-column flex-md-row mt-4">
        <div className="flex-fill">
          <h3>Історія хвороб</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Хвороба</th>
                <th>Лікування</th>
              </tr>
            </thead>
            <tbody>
              {medicalHistory.map((record) => (
                <tr key={record.id}>
                  <td>{new Date(record.date).toLocaleDateString('uk-UA')}</td>
                  <td>{record.illness}</td>
                  <td>{record.treatment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex-fill d-flex flex-column align-items-center mt-3 mt-md-0">
          <div className="w-100" style={{ maxWidth: '400px' }}>
            <h3>Графік ваги та зросту</h3>
            <select
              className="form-select mb-3"
              value={selectedPetForChart}
              onChange={(e) => setSelectedPetForChart(e.target.value)}
            >
              <option value="">Оберіть улюбленця для графіка</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.name}>
                  {pet.name}
                </option>
              ))}
            </select>
            <Line data={growthChartData} />
          </div>
          <div className="mt-3 w-100">
            <h4>Додати дані росту та ваги</h4>
            <DatePicker
              selected={newGrowthRecord.date}
              onChange={(date) => setNewGrowthRecord({ ...newGrowthRecord, date })}
              className="form-control mb-2"
              dateFormat="dd/MM/yyyy"
              locale="uk"
            />
            <input
              type="number"
              placeholder="Вага (кг)"
              value={newGrowthRecord.weight}
              onChange={(e) => setNewGrowthRecord({ ...newGrowthRecord, weight: e.target.value })}
              className="form-control mb-2"
            />
            <input
              type="number"
              placeholder="Зріст (см)"
              value={newGrowthRecord.height}
              onChange={(e) => setNewGrowthRecord({ ...newGrowthRecord, height: e.target.value })}
              className="form-control mb-2"
            />
            <button onClick={handleAddGrowthRecord} className="btn btn-outline-success">Додати дані</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;