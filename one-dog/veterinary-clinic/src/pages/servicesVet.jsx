import React, { useState } from "react";
import "../pages/servicesVet.css";

const servicesList = [
  {
    id: 1,
    title: "Загальний огляд",
    description: "Консультація ветеринара та діагностика загального стану.",
    icon: "fas fa-stethoscope",
    fullList: [
      "Огляд тварини",
      "Консультація з лікування",
      "Призначення додаткових обстежень"
    ]
  },
  {
    id: 2,
    title: "Діагностика",
    description: "УЗД, аналізи крові, сечі, калу, рентгенографія.",
    icon: "fas fa-vial",
    fullList: [
      "Ультразвукове дослідження (УЗД)",
      "Загальний аналіз крові",
      "Біохімічний аналіз крові",
      "Рентгенологічне дослідження"
    ]
  },
  {
    id: 3,
    title: "Вакцинація",
    description: "Проведення первинної та повторної вакцинації.",
    icon: "fas fa-syringe",
    fullList: [
      "Вакцинація проти сказу",
      "Вакцинація проти інфекційних хвороб",
      "Складання індивідуального графіка вакцинації"
    ]
  },
  {
    id: 4,
    title: "Хірургія",
    description: "Планові та екстрені операції.",
    icon: "fas fa-user-md",
    fullList: [
      "Стерилізація та кастрація",
      "Лікування травм",
      "Видалення новоутворень"
    ]
  },
  {
    id: 5,
    title: "Стоматологія",
    description: "Чистка зубів, видалення зубного каменю, лікування.",
    icon: "fas fa-tooth",
    fullList: [
      "Чистка зубів від зубного каменю",
      "Лікування карієсу",
      "Видалення хворих зубів"
    ]
  },
  {
    id: 6,
    title: "Грумінг",
    description: "Стрижка, догляд за шерстю, купання та чистка вух.",
    icon: "fas fa-cut",
    fullList: [
      "Гігієнічна стрижка",
      "Комплексний догляд за шерстю",
      "Купання з використанням спеціальних засобів"
    ]
  }
];

const Services = () => {
  const [expandedCard, setExpandedCard] = useState(null);

  const handleCardClick = (id) => {
    setExpandedCard((prev) => (prev === id ? null : id)); // Переключение между открытием и закрытием
  };

  return (
    <section className="services-section">
      <h2 className="services-header text-center">Наші Послуги</h2>
      <div className="services-container">
        {servicesList.map((service) => (
          <div
            key={service.id}
            className={`service-card ${expandedCard === service.id ? "expanded" : ""}`}
            onClick={() => handleCardClick(service.id)}
          >
            <div className="service-icon">
              <i className={service.icon}></i>
            </div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
            {expandedCard === service.id && (
              <ul className="service-full-list">
                {service.fullList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;