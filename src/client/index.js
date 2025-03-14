import './style.css';

import { interval } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, map, concatMap } from 'rxjs/operators';

const messagesTable = document.getElementById('messagesTable').getElementsByTagName('tbody')[0];

interval(5000) // Запрос каждые 5 секунд
  .pipe(
    concatMap(() =>
      ajax.getJSON('http://localhost:3000/messages/unread').pipe(
        catchError(() => []) // Обработка ошибок
      )
    ),
    map((response) => response.messages || [])
  )
  .subscribe((messages) => {
    messages.forEach((message) => {
      const row = messagesTable.insertRow(0); // Добавляем сверху
      const fromCell = row.insertCell(0);
      const subjectCell = row.insertCell(1);
      const receivedCell = row.insertCell(2);

      fromCell.textContent = message.from;
      subjectCell.textContent =
        message.subject.length > 15
          ? message.subject.substring(0, 15) + '...'
          : message.subject;
      receivedCell.textContent = formatDate(message.received);
    });
  });

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day}.${month}.${year}`;
}