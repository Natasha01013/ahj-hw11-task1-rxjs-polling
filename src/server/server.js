import express from 'express'; //Библиотека Express.js используется для создания веб-сервера и обработки HTTP-запросов
import { faker } from '@faker-js/faker'; //Библиотека Faker используется для генерации случайных данных (email-адресов, текстов, времени)
import { v4 as uuidv4 } from 'uuid'; //Импортируем функцию uuidv4 из библиотеки UUID, которая используется для генерации уникальных идентификаторов
import cors from 'cors'; // Библиотека CORS используется для обработки запросов с других доменов (разрешение CORS)

const app = express(); //Создаем новый экземпляр приложения Express, который будет использоваться для обработки запросов
const port = 3000;

app.use(cors()); // middleware cors, чтобы разрешить запросы с других доменов, т.к. клиентская часть работает на др.порту 9000.

app.get('/messages/unread', (req, res) => {//Определяем маршрут /messages/unread, который будет обрабатывать GET-запросы. req - запрос, res - ответ
  const messages = [];
  const messageCount = Math.floor(Math.random() * 5) + 1; //Генерируем случайное количество сообщений (от 1 до 5)

  for (let i = 0; i < messageCount; i++) {
    messages.push({
      id: uuidv4(), //Генерируем уникальный идентификатор с помощью uuidv4()
      //allowSpecialCharacters: false - значит, что email-адреса не будут содержать специальные символы перед символом @
      from: faker.internet.email({ allowSpecialCharacters: false }), //Генерируем случайный email-адрес с помощью faker.internet.email()
      subject: faker.lorem.sentence(), //Генерируем случайный заголовок с помощью faker.lorem.sentence()
      body: faker.lorem.paragraphs(),//Генерируем случайный текст сообщения
      received: faker.date.past().getTime() / 1000,//Генерируем случайную дату получения сообщения в прошлом в формате timestamp и делим результат на 1000, чтобы получить секунды
    });
  }

  res.json({ //Отправляем ответ в формате JSON
    status: 'ok',
    timestamp: Date.now() / 1000, //Делим результат на 1000, чтобы получить секунды
    messages,
  });
});

app.listen(port, () => { //Запускаем сервер на указанном порту (3000)
  console.log(`Server listening at http://localhost:${port}`);
});