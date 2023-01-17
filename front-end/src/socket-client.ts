import { Manager, Socket } from 'socket.io-client';

let socket: Socket;

export const connetToServer = (token: string) => {
  const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {
    extraHeaders: {
      authentication: token,
    },
  });

  socket?.removeAllListeners();

  socket = manager.socket('/');
  addListenners();
};

const addListenners = () => {
  const clientsUl = document.querySelector('#client-ul');
  const messageForm = document.querySelector<HTMLFormElement>('#message-form');
  const messageInput = document.querySelector<HTMLInputElement>('#message-input');
  const messageUl = document.querySelector<HTMLInputElement>('#message-ul');
  const severStatusLabel: HTMLElement = document.querySelector('#server-status');

  socket.on('connect', () => {
    severStatusLabel.textContent = 'Connected';
  });

  socket.on('disconnect', () => {
    severStatusLabel.textContent = 'disconnected';
  });

  socket.on('clients-updated', (clients: string[]) => {
    let cliensHtml = '';
    clients.forEach((clientId) => {
      cliensHtml += `
        <li>${clientId}</li>
      `;
    });
    clientsUl.innerHTML = cliensHtml;
  });

  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!messageInput.value.trim().length) return;

    socket.emit('message-from-client', { id: 'yo', message: messageInput.value });
    messageInput.value = '';
  });

  socket.on('messages-from-server', (payload: { fullName: string; message: string }) => {
    const newMessage = `
    <li>
      <strong>${payload.fullName}</strong>
      <span>${payload.message}</span>
    </li>
    `;

    const li = document.createElement('li');
    li.innerHTML = newMessage;
    messageUl.append(li);
  });
};
