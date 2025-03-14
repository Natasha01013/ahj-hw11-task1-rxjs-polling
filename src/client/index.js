import './style.css';

import { interval } from 'rxjs';
import { ajax } from 'rxjs/ajax'; //ajax - позволяет выполнять HTTP-запросы с помощью Observable
import { catchError, map, concatMap } from 'rxjs/operators';

const messagesTable = document.getElementById('messagesTable').getElementsByTagName('tbody')[0]; //Место, куда будут добавляться новые сообщения

//interval - создает Observable, который испускает последовательность чисел через заданные промежутки времени
interval(5000) // Создаем Observable, который создает числа (0, 1, 2, ...) каждые 5 секунд
  .pipe(
    concatMap(() => //преобразует каждое значение в новый Observable
      ajax.getJSON('http://localhost:3000/messages/unread').pipe( // Выполняем GET-запрос к серверу и возвращаем Observable с данными в формате JSON
        catchError(() => []) // Если запрос завершается ошибкой, он возвращается пустой массив, чтобы предотвратить прерывание Observable
      )
    ),
    map((response) => response.messages || []) //Преобразуем ответ сервера, извлекая массив сообщений
  )
  .subscribe((messages) => {
    messages.forEach((message) => {
      const row = messagesTable.insertRow(0); // Добавляем новую строку в начало таблицы (сверху). Для этого используем 0
      const fromCell = row.insertCell(0); //Добавляем первый столбец первой строки
      const subjectCell = row.insertCell(1); //Добавляем второй столбец первой строки
      const receivedCell = row.insertCell(2); //Добавляем третий столбец первой строки

      fromCell.textContent = message.from; //Берем данные из свойства from объекта message
      subjectCell.textContent =
        message.subject.length > 15 //Берем данные из свойства subject
          ? message.subject.substring(0, 15) + '...' //Обрезаем, если больше 15 символов
          : message.subject;
      receivedCell.textContent = formatDate(message.received); //Берем данные из свойства received
    });
  });

function formatDate(timestamp) { //Преобразуем timestamp в строку в формате "ЧЧ:ММ ДД.ММ.ГГГГ"
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day}.${month}.${year}`;
}