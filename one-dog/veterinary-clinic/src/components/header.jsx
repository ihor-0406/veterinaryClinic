import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faUser, faMagnifyingGlass, faBell } from '@fortawesome/free-solid-svg-icons';
import './header.css'

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            console.log('Починаємо вихід із системи');
            await signOut(auth);
            console.log('Вихід виконано успішно');
    
            // Видалення токена з localStorage і sessionStorage
            localStorage.clear();
            sessionStorage.clear();
    
            // Перенаправлення на сторінку входу
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Помилка при виході із системи:', error);
        }
    };
    const appVersion = '1.0.0';
    if (localStorage.getItem('appVersion') !== appVersion) {
        localStorage.clear();
        sessionStorage.clear();
        localStorage.setItem('appVersion', appVersion);
    }

    const avatarStyle = {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'white',
    };

    const logoStyle = {
        fontSize: '0.9rem',
    };

    return (
        <header className='container header'>
            <nav className='d-flex justify-content-between align-items-center'> 
                <button className="btn bg-transparent p-1 ms-2 border-black rounded-circle btnMenu" type="button" data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="black" className="bi bi-list" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"></path>
                    </svg>
                </button>
                <div className="offcanvas offcanvas-start menuBox" data-bs-backdrop="static" tabIndex="-1" id="staticBackdrop" aria-labelledby="staticBackdropLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="staticBackdropLabel">Offcanvas</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <Link className="nav-link border-top border-black py-2" to="/">Головна</Link>
                        <Link className="nav-link border-top border-black py-2" to="/services">Послуги</Link>
                        <Link className="nav-link border-top border-black py-2" to="/about">Про нас</Link>
                        <Link className="nav-link border-top border-bottom border-black py-2" to="/contacts">Контакти</Link>
                    </div>
                </div>
                <div className='logo'>
                    <Link className="navbar-brand text-white" to="/">
                        <h2 className="poppins-semibold fw-medium logoOnegog">One<span className="fw-bolder">D<FontAwesomeIcon icon={faPaw} style={{ color: "#078550" }} />g</span></h2>
                    </Link>
                </div>
                {isLoggedIn ? (
                    <div className="d-flex justify-content-start align-items-center">
                        <button className="btn">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                        <button className="btn">
                            <FontAwesomeIcon icon={faBell} />
                        </button>
                        <div className="nav-item dropdown">
                        <button className="nav-link dropdown-toggle p-0 border-0 bg-transparent" data-bs-toggle="dropdown" aria-expanded="false" style={avatarStyle}>
                                <FontAwesomeIcon icon={faUser} />
                            </button>
                            <ul className="dropdown-menu dropdown-menu-start dropdown-menu-dark">
                                <li><Link className="dropdown-item" to="/profile">Профіль</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item" onClick={handleLogout}>Вийти</button></li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-outline-light" onClick={() => navigate('/login')}>Войти</button>
                        <button className="btn btn-warning" onClick={() => navigate('/register')}>Зарегистрироваться</button>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;