import React from 'react';
import './App.css';
import Header from './components/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Register from './components/Register';
import Home from './pages/Home';
import Footer from './components/Footer';
import Profile from './components/Profile';
import Pet from './pages/Pet';
import History from './pages/History';
import Achievements from './pages/Achievements';
import Album from './pages/Album';

function App() {
  return (
    <Router>
      <Routes>
        {/* Главная страница с Header */}
        <Route path="/" element={<LayoutWithHeader />}>
          <Route index element={<Home />} /> 
          {/* Путь к профилю и его вкладкам */}
          <Route path="profile" element={<Profile />}>
            <Route path="pet" element={<Pet />} />
            <Route path="history" element={<History />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="album" element={<Album />} />
          </Route>
        </Route>
        
        {/* Страницы входа и регистрации */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

function LayoutWithHeader() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer/>
    </>
  );
}

export default App;