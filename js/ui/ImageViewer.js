/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor( element ) {
    this.imagesWrapper = element;
    this.init();
  }

  init() {
    this.imagesList = this.imagesWrapper.children[0];
    this.imagePreview = this.imagesWrapper.children[1];    
    this.btnSelectAll = this.imagesWrapper.querySelector('.select-all');
    this.btnUploadedFiles = this.imagesWrapper.querySelector('.show-uploaded-files');
    this.btnSend = this.imagesWrapper.querySelector('.send');
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents() {
    this.imagesList.addEventListener('dblclick', e => {
      this.imagePreview.querySelector('img').src = e.target.src;
    });
    this.imagesList.addEventListener('click', e => {
      if (e.target.tagName === 'IMG') {
        e.target.classList.toggle('selected');
      }
      this.checkButtonText();
    });
    this.btnSelectAll.addEventListener('click', () => {
      const selectedList = this.imagesList.querySelectorAll('.selected');     
      if (selectedList.length > 0) {
        selectedList.forEach(element => {
          element.classList.remove('selected');
        });
      } else {
        this.imagesList.querySelectorAll('img').forEach(element => {
          element.classList.add('selected');
        });
      }
      this.checkButtonText();
    });
    this.btnUploadedFiles.addEventListener('click', () => {
      const modalPreviewer = App.getModal('filePreviewer');
      modalPreviewer.open();
      Yandex.getUploadedFiles(result => {
        modalPreviewer.showImages(result);
      });
    });
    this.btnSend.addEventListener('click', () => {
      const selectedList = this.imagesList.querySelectorAll('.selected');
      const imageSrcList = Array.from(selectedList, el => el.src);
      const modalfileUploader = App.getModal('fileUploader');
      modalfileUploader.open();
      modalfileUploader.showImages(imageSrcList);      
    });
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    this.imagesList.querySelectorAll('.image-wrapper').forEach(element => {
      element.remove();
    });
  }

  /**
   * Отрисовывает изображения.
  */
  drawImages(images) {
    images.forEach(image => {
      this.imagesList.querySelector('.row').insertAdjacentHTML('afterBegin', `
        <div class="four wide column ui medium image-wrapper">
          <img src="${image}" />
        </div>
        `);
    }); 
    if (this.imagesList.querySelectorAll('.image-wrapper').length > 0) {
      this.btnSelectAll.classList.remove('disabled');
    } else {
      this.btnSelectAll.classList.add('disabled');
    }   
  }

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText() {
    const selectedList = this.imagesList.querySelectorAll('.selected'); 
    if (selectedList.length > 0) {
      this.btnSelectAll.innerText = 'Снять выделение';
      this.btnSend.classList.remove('disabled');
    } else {
      this.btnSelectAll.innerText = 'Выбрать всё';
      this.btnSend.classList.add('disabled');
    }
  }
}