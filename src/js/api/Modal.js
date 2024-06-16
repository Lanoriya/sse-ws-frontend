export default class Modal {
  constructor(root) {
    this.root = root;
  }

  createmodalNickname() {
    const modalNicknameHtml = `
      <div id="nicknameModal" class="modal__form container">
        <div class="modal__background"></div>
        <div class="modal">
          <h2 class="modal__header">Выберите псевдоним</h2>
          <div class="modal__body">
            <form id="form" data-id="addTicket-form">
              <div class="form__group">
                <input rows=1 data-id="name" name="name" required class="form__input" placeholder="Введите псевдоним"></input>
              </div>
              <div class="modal__footer">
                <button type="submit" data-id="ok" class="modal__ok">Продолжить</button>
              </div>
            </form>
          </div>
        </div>
      </div>`;
    this.root.insertAdjacentHTML('beforeend', modalNicknameHtml);
  }

  createmodalChat() {
    const modalMessageSendHtml = `
      <div id="chatModal" class="modal__form">
        <div class="modal__background"></div>
        <div class="modal__content">
          <div class="modal__header">Окно чата</div>
          <div class="modal__body">
            <div class="modalChat__body">
              <div class="modalChat__user">
                <div class="modal__header">Пользователи</div>
                <div id="users" class="chat__userlist"></div>
              </div>
              <div class="modalChat__chat">
                <div class="modal__header">Сообщения</div>
                <div id="messages" class="chat__messages-container"></div>
              </div>
            </div>
            <form id="form" data-id="addMessage">
              <div class="form__group">
                <input rows=1 data-id="message" name="message" class="form__input" placeholder="Введите сообщение"></input>
              </div>
              <div class="modal__footer">
                <button type="submit" data-id="ok" class="modal__ok">Отправить</button>
              </div>
            </form>
          </div>
        </div>
      </div>`;
    this.root.insertAdjacentHTML('beforeend', modalMessageSendHtml);
  }
}
