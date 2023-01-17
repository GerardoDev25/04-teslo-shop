import { connetToServer } from './socket-client';
import './style.css';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h2>Web socket</h2>

    <input id="jwt-token"/>
    <button id="btn-connect">Connect</button>
    <br/>
    
    <span id="server-status">offline</span>
    <ul id="client-ul">
    </ul>
    <form id="message-form">
      <input id="message-input"/>
    </form>

    <h3>Messages</h3>
    <ul id="message-ul"></ul>
  </div>
`;
// connetToServer();

const jwtToken = document.querySelector<HTMLInputElement>('#jwt-token');
const btnConnect = document.querySelector<HTMLButtonElement>('#btn-connect');

btnConnect.addEventListener('click', () => {
  if (!jwtToken.value.trim().length) return alert('enter a valid jwt');
  connetToServer(jwtToken.value.trim());
});
