import Modal from './api/Modal';

export default class Chat {
  constructor(container) {
    this.container = container;
    this.Modal = new Modal(container);
    this.you = '';
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeNicknameModal();
    });
  }

  initializeNicknameModal() {
    this.Modal.createmodalNickname();
    this.modalNickname = document.getElementById('nicknameModal');
    this.formNickname = this.modalNickname?.querySelector('form');
    this.inputNickname = this.formNickname?.querySelector('input');

    if (this.formNickname && this.inputNickname) {
      this.formNickname.addEventListener('submit', (e) => this.handleNicknameSubmit(e));
    }
  }

  handleNicknameSubmit(e) {
    e.preventDefault();
    const nickname = this.inputNickname.value.trim();
    if (nickname) {
      this.you = nickname;
      fetch('https://sse-ws-backend-26ol.onrender.com/new-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nickname }),
      })
        .then((response) => response.json())
        .then((data) => this.handleNicknameResponse(data))
        .catch((error) => console.error('Error:', error));
    }
  }

  handleNicknameResponse(data) {
    if (data.status === 'error') {
      alert(data.message);
    } else if (data.status === 'ok') {
      this.formNickname.removeEventListener('submit', (e) => this.handleNicknameSubmit(e));
      this.modalNickname.remove();
      this.initializeChatModal(data.user.name);
    }
  }

  initializeChatModal(username) {
    this.Modal.createmodalChat();
    this.initializeWebSocket();
    this.setupMessageForm(username);
    this.setupUnloadEvent(username);
  }

  initializeWebSocket() {
    this.ws = new WebSocket('wss://sse-ws-backend-26ol.onrender.com');
    this.userArea = this.container.querySelector('#users');
    this.chatArea = this.container.querySelector('#messages');

    this.ws.addEventListener('message', (e) => this.handleWebSocketMessage(e));
  }

  handleWebSocketMessage(e) {
    const data = JSON.parse(e.data);
    console.log('Received data:', data);

    if (!data.type) {
      this.clearUserList();
    }
    if (Array.isArray(data)) {
      this.updateUserList(data);
    }
    if (data.user != undefined) {
      this.updateChatMessages(data);
    }
  }

  clearUserList() {
    const userContainer = document.querySelectorAll('.user');
    userContainer.forEach((user) => user.remove());
  }

  updateUserList(data) {
    data.forEach((user) => {
      let username = user.name === this.you ? 'YOU' : user.name;
      const userHTML = `<div class="user">${username}</div>`;
      this.userArea.insertAdjacentHTML('beforeend', userHTML);
    });
  }

  updateChatMessages(data) {
    const timestamp = new Date().toLocaleString();
    const messageClass = data.user === this.you ? 'chatRight' : 'chatUser';
    const username = data.user === this.you ? 'YOU' : data.user;
    const messageHTML = `<p class="${messageClass}">${username}: ${data.msg} <span class="timestamp">${timestamp}</span></p>`;
    this.chatArea.insertAdjacentHTML('beforeend', messageHTML);
  }

  setupMessageForm(username) {
    const addMessageForm = this.container.querySelector('#form');
    const addMessageInput = addMessageForm?.querySelector('[data-id="message"]');

    if (addMessageForm && addMessageInput) {
      addMessageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = addMessageInput.value.trim();
        if (message) {
          this.ws.send(JSON.stringify({ msg: message, type: 'send', user: username }));
          addMessageInput.value = '';
        }
      });
    }
  }

  setupUnloadEvent(username) {
    window.addEventListener('unload', () => {
      this.ws.send(JSON.stringify({ msg: 'вышел', type: 'exit', user: { name: username } }));
    });
  }
}
