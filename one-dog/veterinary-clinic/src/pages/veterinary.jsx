import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import vetsData from '../data/vets.json'; // Данные о врачах
import './veterinary.css';

const Veterinary = () => {
  return (
    <div className="veterinary-container">
      {/* Блок записи на прием */}
      <div className="appointment-section">
        <h2>Запис на прийом</h2>
        <button className="btn btn-success">Записатися</button>
      </div>

      {/* Блок подробностей о ветеринарных услугах */}
      <div className="services-info-section">
        <h2>Подробиці про ветеринарні послуги</h2>
        <p>
          Ми пропонуємо широкий спектр ветеринарних послуг, включаючи профілактичні огляди, вакцинацію, хірургічне втручання та багато іншого.
        </p>
      </div>

      {/* Блок "Які послуги ми надаємо" */}
      <div className="services-list-section">
        <h2>Які послуги ми надаємо</h2>
        <ul>
          <li>Профілактичні огляди</li>
          <li>Вакцинація</li>
          <li>Хірургічне втручання</li>
          <li>Діагностика</li>
          <li>Стоматологічні послуги</li>
        </ul>
      </div>

      {/* Карточки с прайсом */}
      <div className="pricing-section">
        <h2>Прайс-лист</h2>
        <div className="pricing-cards">
          <div className="pricing-card">
            <h3>Огляд</h3>
            <p>Ціна: 500 грн</p>
          </div>
          <div className="pricing-card">
            <h3>Вакцинація</h3>
            <p>Ціна: 700 грн</p>
          </div>
          <div className="pricing-card">
            <h3>Хірургія</h3>
            <p>Ціна: від 2000 грн</p>
          </div>
        </div>
      </div>

      {/* Swiper з нашими лікарями */}
      <div className="vets-swiper-section">
        <h2>Наші лікарі</h2>
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {vetsData.vets.map((vet) => (
            <SwiperSlide key={vet.id}>
              <div className="vet-card">
                <h3>{vet.name}</h3>
                <p>Спеціалізація: {vet.specialization}</p>
                <p>Контакти: {vet.contact.phone}</p>
                <p>Email: {vet.contact.email}</p>
                <p>
                  Години роботи:
                  <br />
                  Пн-Пт: {vet.workingHours.mondayToFriday}
                  <br />
                  Сб: {vet.workingHours.saturday}
                  <br />
                  Нд: {vet.workingHours.sunday}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Veterinary;