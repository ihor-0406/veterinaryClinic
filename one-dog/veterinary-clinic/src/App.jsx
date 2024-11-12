import React from 'react';
import './App.css';
import Header from './components/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Register from './components/Register';
import Home from './pages/Home'; // Главная страница
import Footer from './components/Footer';
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Главная страница с Header */}
        <Route path="/" element={<LayoutWithHeader />}>
          <Route index element={<Home />} /> 
          {/* Путь к профилю */}
          <Route path="profile" element={<Profile />} />
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