import React, { useState } from 'react';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]); // Список достижений
  const [formVisible, setFormVisible] = useState(false); // Видимость формы добавления
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    date: '',
    image: null
  });

  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAchievement({ ...newAchievement, [name]: value });
  };

  // Обработчик загрузки изображения
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewAchievement((prevAchievement) => ({ ...prevAchievement, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    // Добавляем новое достижение в список
    setAchievements([...achievements, { ...newAchievement, id: Date.now() }]);
    setFormVisible(false); // Скрываем форму после добавления
    // Сбрасываем поля формы
    setNewAchievement({
      title: '',
      description: '',
      date: '',
      image: null
    });
  };

  return (
    <div>
      <h2>Достижения</h2>

      {/* Список достижений */}
      <div className="d-flex flex-wrap">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="card mb-3 me-3" style={{ width: '18rem' }}>
            {achievement.image && (
              <img src={achievement.image} alt="Achievement" className="card-img-top" style={{ maxHeight: '200px', objectFit: 'cover' }} />
            )}
            <div className="card-body">
              <h5 className="card-title">{achievement.title}</h5>
              <p><strong>Описание:</strong> {achievement.description}</p>
              <p><strong>Дата:</strong> {achievement.date}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary" onClick={() => setFormVisible(!formVisible)}>
        Добавить достижение
      </button>

      {/* Форма добавления достижения */}
      {formVisible && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label className="form-label">Название достижения</label>
            <input
              type="text"
              name="title"
              value={newAchievement.title}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Описание</label>
            <textarea
              name="description"
              value={newAchievement.description}
              onChange={handleInputChange}
              className="form-control"
              rows="3"
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Дата</label>
            <input
              type="date"
              name="date"
              value={newAchievement.date}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Загрузить изображение/сертификат</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-success">Сохранить достижение</button>
        </form>
      )}
    </div>
  );
};

export default Achievements;