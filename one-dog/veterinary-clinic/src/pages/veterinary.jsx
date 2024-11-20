import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig"; 
import "./veterinary.css"; 
import vet1 from "../image/veterinary1.jpeg";
import vet2 from "../image/veterina2.jpeg";
import vet3 from "../image/veterinary3.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import vets from "../data/vets.json";
import sevicesVet from '../pages/servicesVet'





const Veterinary = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Ветеринарія';
}, []);

  const handleProfileRedirect = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/profile/history"); // Если пользователь авторизован
      } else {
        navigate("/login"); // Если пользователь не авторизован
      }
    });
  };
  const galleryImages = [
    { id: 1, src: "/src/image/center1.jpg", alt:'Огляд собаки лікарям ' },
    { id: 2, src: "/src/image/center2.jpg", alt:'Кабінет для огляду тварин' }, 
    { id: 3, src: "/src/image/center3.jpg", alt: 'Операційне відділення' },
    { id: 4, src: "/src/image/center4.webp", alt: 'Приймальне відділення' },
    { id: 5, src: "/src/image/center5.jpg", alt:  'Приймальне відділення'}
  ];

  return (
    <section className="container">
      <nav className="breadcrumb my-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Головна</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/Services">Послуги</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Ветеринарія
          </li>
        </ol>
      </nav>
      <div className="veterinary-container">
      <h2 className="veterinary-title">Запишіться на прийом просто зараз</h2>
      <p className="veterinary-description">
        Оберіть зручний спосіб запису: зателефонуйте нам або увійдіть до
        особистого кабінету, щоб обрати зручний час онлайн.
      </p>
      <div className="veterinary-buttons">
        <button
          className="veterinary-button"
          onClick={() => (window.location.href = "tel:+380501234567")}
        >
          Подзвонити
        </button>
        <button className="veterinary-button" onClick={handleProfileRedirect}>
          Увійти в кабінет
        </button>
      </div>
      </div>
      <div>
         {/* Первый блок: текст слева, изображение справа */}
      <div className="veterinary-block mt-4">
        <div className="veterinary-text">
          <h2>Комплексний підхід до здоров'я</h2>
          <p>
            У ветеринарному відділі "One Dog" ми пропонуємо повний спектр
            послуг для вашого улюбленця: від профілактичних оглядів до
            хірургічних втручань. Наші спеціалісти використовують сучасне
            обладнання та новітні методи лікування.
          </p>
        </div>
        <div className="veterinary-image">
          <img src={vet1} alt="veterinary Image" width={'100%'} height={'80%'} />
        </div>
      </div>

      {/* Второй блок: изображение слева, текст справа */}
      <div className="veterinary-block reverse">
        <div className="veterinary-image">
        <img src={vet2} alt="veterinary Image" width={'100%'} height={'80%'} />
        </div>
        <div className="veterinary-text">
          <h2>Вакцинація та профілактика</h2>
          <p>
            Регулярна вакцинація — запорука здоров'я вашого улюбленця. Ми
            працюємо за сучасними протоколами, забезпечуючи надійний захист від
            найпоширеніших захворювань. Оберіть найкраще для свого собаки.
          </p>
        </div>
      </div>

      {/* Третий блок: текст слева, изображение справа */}
      <div className="veterinary-block">
        <div className="veterinary-text">
          <h2>Хірургія та реабілітація</h2>
          <p>
            Наші хірурги мають багаторічний досвід проведення як планових, так і
            екстрених операцій. Ми також пропонуємо комплексну реабілітацію,
            щоб ваш улюбленець швидко відновився після лікування.
          </p>
        </div>
        <div className="veterinary-image">
        <img src={vet3} alt="veterinary Image" width={'100%'} height={'80%'} />      
        </div>
      </div>
      </div>
      <div>
      <div className="pricing-container py-5">
      <h1 className="pricing-header text-center mb-4">Ціни на ветеринарні послуги</h1>
      <p className="pricing-subheader text-center">
        Наші послуги розділені на три пакети, щоб задовольнити різні потреби: від базового догляду до комплексного лікування. Ми гарантуємо високий рівень обслуговування та турботу про вашого улюбленця.
      </p>

      <div className="pricing-row row">
        {/* Basic Plan */}
        <div className="pricing-column col-md-4">
          <div className="pricing-card pricing-basic">
            <div className="pricing-card-header">
              <h3 className="pricing-card-title">Базовий</h3>
            </div>
            <div className="pricing-card-body">
              <h2 className="pricing-card-price">
                300 грн<small className="pricing-card-period">/огляд</small>
              </h2>
              <ul className="pricing-card-features">
                <li>Первинний огляд</li>
                <li>Вакцинація (без вартості вакцини)</li>
                <li>Обробка від паразитів</li>
              </ul>
              <p className="pricing-card-description">
                Для тих, хто хоче провести профілактичний огляд або базові процедури. Ідеально підходить для регулярного догляду.
              </p>
              <button className="pricing-card-button" onClick={() => (window.location.href = "tel:+380501234567")}>Замовити</button>
            </div>
          </div>
        </div>

        {/* Standard Plan */}
        <div className="pricing-column col-md-4">
          <div className="pricing-card pricing-standard">
            <div className="pricing-card-header">
              <h3 className="pricing-card-title">Стандартний</h3>
            </div>
            <div className="pricing-card-body">
              <h2 className="pricing-card-price">
                600 грн<small className="pricing-card-period">/сеанс</small>
              </h2>
              <ul className="pricing-card-features">
                <li>Повний огляд</li>
                <li>Аналіз крові</li>
                <li>УЗД внутрішніх органів</li>
                <li>План лікування</li>
              </ul>
              <p className="pricing-card-description">
                Оптимальний вибір для собак, які потребують діагностики та складання плану лікування. Забезпечує комплексний підхід.
              </p>
              <button className="pricing-card-button pricing-card-highlight" onClick={() => (window.location.href = "tel:+380501234567")}>
                Замовити
              </button>
            </div>
          </div>
        </div>

        {/* Premium Plan */}
        <div className="pricing-column col-md-4">
          <div className="pricing-card pricing-premium">
            <div className="pricing-card-header">
              <h3 className="pricing-card-title">Преміум</h3>
            </div>
            <div className="pricing-card-body">
              <h2 className="pricing-card-price">
                1200 грн<small className="pricing-card-period">/сеанс</small>
              </h2>
              <ul className="pricing-card-features">
                <li>Індивідуальний супровід</li>
                <li>Хірургічні процедури</li>
                <li>Рентген-діагностика</li>
                <li>Післяопераційна реабілітація</li>
              </ul>
              <p className="pricing-card-description">
                Для складних випадків, що вимагають хірургічного втручання, рентгену та реабілітації. Максимальний рівень турботи.
              </p>
              <button className="pricing-card-button" onClick={() => (window.location.href = "tel:+380501234567")}>Замовити</button>
            </div>
          </div>
        </div>
      </div>

      {/* Блок с дополнительным пояснением */}
      <div className="pricing-info mt-5">
        <h2 className="pricing-info-header text-center">Чому обрати нас?</h2>
        <p className="pricing-info-text text-center">
          Ми використовуємо сучасне обладнання, сертифіковані препарати та пропонуємо індивідуальний підхід до кожного клієнта.
          Наші фахівці — це професіонали з багаторічним досвідом, які завжди готові допомогти вашому улюбленцю.
        </p>
      </div>
    </div>
      </div>
      <div className="mt-5 doctors-container">
      <h1 className="pricing-header  fw-bold text-center pt-5 mt-4">Наші Лікарі</h1>
      <Swiper 
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={3}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="doctors-slider"
      >
        {vets.vets.map((vet) => (
          <SwiperSlide key={vet.id} className="doctors-slide">
            <div className="doctors-card text-center">
              <img
                src={vet.image}
                className="doctors-card-img m-2 border border-success rounded-circle"
                alt={vet.name}
                width={'170px'}
                height={'170px'}
              />
              <div className="doctors-card-body">
                <h5 className="doctors-card-title">{vet.name}</h5>
                <p className="doctors-card-text">{vet.specialization}</p>
                <p className="doctors-card-text">
                  <strong>Графік роботи:</strong> <br />
                  Пн-Пт: {vet.workingHours.wednesdayToFriday}{vet.workingHours.mondayToFriday} <br />
                  Сб: {vet.workingHours.saturday} <br />
                  Нд: {vet.workingHours.sunday}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      </div>
      <div className="mt-5">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={1}
        slidesPerView={1}
        className="gallery-slider"
      >
        {galleryImages.map((image) => (
          <SwiperSlide key={image.id}>
            <img src={image.src} alt={`Slide ${image.id}`} className="gallery-image"  />
          </SwiperSlide>
        ))}
      </Swiper>
      </div>
      <div>
        <sevicesVet></sevicesVet>
      </div>
     
    </section>
  );
};

export default Veterinary;