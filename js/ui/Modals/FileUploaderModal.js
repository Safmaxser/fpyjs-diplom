/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
  constructor(element) {
    super(element);
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: 
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents() {
    this.elementDOM.querySelector('.header i').addEventListener('click', () => {
      this.close();
    });    
    this.elementDOM.querySelector('.close.button').addEventListener('click', () => {
      this.close();
    });
    this.elementDOM.querySelector('.send-all.button').addEventListener('click', () => {
      this.sendAllImages();
    });
    this.elementDOM.querySelector('.content').addEventListener('click', e => {
      const btnUpload = e.target.closest('button');
      if (btnUpload) {
        this.sendImage(btnUpload.closest('.image-preview-container'));
      }
      const inputUpload = e.target.closest('input');
      if (inputUpload) {
        inputUpload.closest('.input').classList.remove('error');
      }
    });
  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages(images) {    
    const imagesListHTML = [];
    images.reverse().forEach(image => {
      imagesListHTML.push(this.getImageHTML(image));
    });
    this.elementDOM.querySelector('.content').insertAdjacentHTML('beforeEnd', imagesListHTML.join('\n'));
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
  getImageHTML(item) {
    return `
      <div class="image-preview-container">
        <img src="${item}" />
        <div class="ui action input">
          <input type="text" placeholder="Путь к файлу">
          <button class="ui button"><i class="upload icon"></i></button>
        </div>
      </div>
      `;
  }

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages() {
    this.elementDOM.querySelectorAll('.image-preview-container').forEach(imageContainer => {
      this.sendImage(imageContainer);
    });
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage(imageContainer) {
    const pathInput = imageContainer.querySelector('input');
    if (!pathInput.value) {
      pathInput.closest('.input').classList.add('error');
    } else {
      pathInput.closest('.input').classList.add('disabled');
      Yandex.uploadFile(pathInput.value, imageContainer.querySelector('img').src, () => {
        imageContainer.remove();
        if (!this.elementDOM.querySelector('.image-preview-container')) {
          this.close();
        }
      });
    }
  }
}