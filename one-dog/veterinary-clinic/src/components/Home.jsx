import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'; // Импорт функции
import { auth } from '../config/firebaseConfig'; // Импорт конфигурации Firebase
import './Home.css';

function Home() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate(); // Инициализация навигации

    // Масив із варіантами відгуків
    const reviewTexts = [
        "Прекрасне обслуговування та турбота про мого улюбленця. Всім рекомендую!",
        "Дуже задоволений якістю послуг та увагою до мого улюбленця!",
        "Найкращий ветеринарний центр! Завжди впевнений у професіоналізмі команди.",
        "Дякую за доброту та турботу про нашого улюбленця.",
        "Рекомендую всім! Чудовий сервіс і приємний персонал.",
        "Мій собака завжди щасливий після візиту сюди. Дякую за вашу роботу!"
    ];

    // Функція для вибору випадкового відгуку
    const getRandomReview = () => {
        const randomIndex = Math.floor(Math.random() * reviewTexts.length);
        return reviewTexts[randomIndex];
    };

    // Завантаження даних користувачів із API
    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch('https://randomuser.me/api/?results=10');
                const data = await response.json();
                setUsers(data.results);
            } catch (error) {
                console.error('Помилка завантаження даних:', error);
            }
        }

        fetchUsers();
    }, []);

    // Функція для перенаправлення користувача
    const handleProfileRedirect = () => {
        // Проверка авторизации пользователя через Firebase
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Если пользователь авторизован, перенаправляем в профиль
                navigate('/Profile/History');
            } else {
                // Если пользователь не авторизован, перенаправляем на страницу логина
                navigate('/login');
            }
        });
    };

    return (
        <section className="container">
            {/* Блок із загальною інформацією про центр */}
            <div className="container home-page">
                <div className="center-info">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="poppins-semibold fw-medium logoOnegog">
                            One<span className="fw-bolder">D<FontAwesomeIcon icon={faPaw} style={{ color: "#078550" }} />g</span> Center
                        </h2>
                    </div>
                    <div className="col-6">
                        <p>
                            <FontAwesomeIcon icon={faPaw} style={{ color: "#000000" }} /> Повний спектр послуг для домашніх улюбленців. <br />
                            <FontAwesomeIcon icon={faPaw} style={{ color: "#000000" }} /> Висококваліфіковані ветеринари та кінологи. <br />
                            <FontAwesomeIcon icon={faPaw} style={{ color: "#000000" }} /> Професійний грумінг для доглянутого вигляду.<br />
                            <FontAwesomeIcon icon={faPaw} style={{ color: "#000000" }} /> Індивідуальний підхід та турбота про кожного улюбленця.
                        </p>
                    </div>
                    <div className="col-12 d-flex justify-content-center gap-2 mb-3">
                        <Link to="/services" className="btn btn-primary">Дізнатись більше про наші послуги</Link>
                    </div>
                </div>
            </div>

            {/* Блок для запису на прийом */}
            <div className="container py-5 ">
                <div className="p-2 mb-4 bg-light rounded-3 shadow appointment">
                    <div className="container-fluid py-5">
                        <h1 className="display-5 fw-bold text-primary">Запишіться на прийом просто зараз</h1>
                        <p className="col-md-8 fs-4 text-muted">
                        Оберіть зручний спосіб запису: зателефонуйте нам або увійдіть до особистого кабінету, щоб обрати зручний час онлайн.
                        </p>
                        <div className="d-flex flex-column flex-md-row gap-3">
                            <a href="tel:+380123456789" className="btn btn-success btn-lg">
                                Подзвонити
                            </a>
                            <button onClick={handleProfileRedirect} className="btn btn-primary btn-lg">
                                Увійти в кабінет
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Блок із відгуками */}
            <div className="reviews-section mt-5">
                <Swiper
                    modules={[Pagination]}
                    spaceBetween={20}
                    slidesPerView={3}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                >
                    {users.map((user, index) => (
                        <SwiperSlide key={index}>
                            <div className="card h-100 shadow-sm review-card cardWiper">
                                {/* Аватар */}
                                <img
                                    src={user.picture.large}
                                    alt={`${user.name.first} ${user.name.last}`}
                                    className="card-img-top rounded-circle mx-auto mt-3"
                                    style={{ width: "80px", height: "80px" }}
                                />
                                <div className="card-body text-center">
                                    {/* Відгук */}
                                    <p className="card-text text-muted mb-3">"{getRandomReview()}"</p>
                                    {/* Нік */}
                                    <h5 className="card-title">{user.name.first} {user.name.last}</h5>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}

export default Home;