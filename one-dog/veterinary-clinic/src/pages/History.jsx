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
  const [growthData, setGrowthData] = useState([]);
  const [newGrowthRecord, setNewGrowthRecord] = useState({ date: new Date(), weight: '', height: '' });

  // Завантаження улюбленців
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const petsCollection = collection(db, 'pets');
        const petsSnapshot = await getDocs(petsCollection);
        const petsList = petsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPets(petsList);
      } catch (error) {
        console.error('Помилка при завантаженні улюбленців:', error);
      }
    };

    fetchPets();
  }, []);

  // Завантаження записів
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsCollection = collection(db, 'appointments');
        const appointmentsSnapshot = await getDocs(appointmentsCollection);
        const appointmentsList = appointmentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(appointmentsList);
      } catch (error) {
        console.error('Помилка при завантаженні записів:', error);
      }
    };

    fetchAppointments();
  }, []);

  // Завантаження графіку
  useEffect(() => {
    const fetchGrowthData = async () => {
      if (selectedPetForChart) {
        try {
          const growthQuery = query(collection(db, 'growthData'), where('pet', '==', selectedPetForChart));
          const growthSnapshot = await getDocs(growthQuery);
          const growthList = growthSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setGrowthData(growthList);
        } catch (error) {
          console.error('Помилка при завантаженні даних зросту:', error);
        }
      }
    };

    fetchGrowthData();
  }, [selectedPetForChart]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVet || !selectedPet) {
      alert('Оберіть ветеринара та улюбленця.');
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
      setAppointmentDate(new Date());
      setSelectedVet('');
      setSelectedPet('');
    } catch (error) {
      console.error('Помилка при створенні запису:', error);
    }
  };

  const handleDelete = async (appointmentId) => {
    try {
      await deleteDoc(doc(db, 'appointments', appointmentId));
      setAppointments(appointments.filter((app) => app.id !== appointmentId));
    } catch (error) {
      console.error('Помилка при видаленні запису:', error);
    }
  };

  const handleAddGrowthRecord = async () => {
    try {
      const newRecord = { ...newGrowthRecord, pet: selectedPetForChart };
      const docRef = await addDoc(collection(db, 'growthData'), newRecord);
      setGrowthData([...growthData, { id: docRef.id, ...newRecord }]);
      setNewGrowthRecord({ date: new Date(), weight: '', height: '' });
    } catch (error) {
      console.error('Помилка при додаванні даних зросту:', error);
    }
  };

  const filterDate = (date) => {
    const today = new Date();
    return date >= today;
  };

  const growthChartData = {
    labels: growthData.map((data) => new Date(data.date).toLocaleDateString('uk-UA')),
    datasets: [
      {
        label: 'Вага (кг)',
        data: growthData.map((data) => data.weight),
        borderColor: 'blue',
        backgroundColor: 'blue',
      },
      {
        label: 'Зріст (см)',
        data: growthData.map((data) => data.height),
        borderColor: 'green',
        backgroundColor: 'green',
      },
    ],
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
            className="form-control"
            showTimeSelect
            dateFormat="dd/MM/yyyy HH:mm"
            timeIntervals={30}
            filterDate={filterDate}
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
            {pets.map((pet) => (
              <option key={pet.id} value={pet.name}>
                {pet.name}
              </option>
            ))}
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
          {appointments.map((app) => (
            <tr key={app.id}>
              <td>{new Date(app.dateTime).toLocaleString('uk-UA')}</td>
              <td>{vetsData.vets.find((vet) => vet.id === app.vet)?.name || 'Не знайдено'}</td>
              <td>{app.pet}</td>
              <td>
                <button onClick={() => handleDelete(app.id)} className="btn">
                  <FontAwesomeIcon icon={faTrash} style={{ color: '#f40b0b' }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="mt-4">Графік ваги та зросту</h3>
      <div className="mt-3">
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
      <div className="mt-3">
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
  );
};

export default History;