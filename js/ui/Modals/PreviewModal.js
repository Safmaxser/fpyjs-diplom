/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {
  constructor(element) {
    super(element);
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения: 
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    this.elementDOM.querySelector('.header i').addEventListener('click', () => {
      this.close();
    });
    this.elementDOM.querySelector('.content').addEventListener('click', e => {
      const btnDelete = e.target.closest('.delete');
      if (btnDelete) {    
        btnDelete.querySelector('i').className = 'icon spinner loading';
        btnDelete.classList.add('disabled');
        Yandex.removeFile(btnDelete.dataset['path'], result => {
          if (!result) {
            btnDelete.closest('.image-preview-container').remove();
          }  
        });        
      }
      const inputDownload = e.target.closest('.download');
      if (inputDownload) {
        Yandex.downloadFileByUrl(inputDownload.dataset['file']);
      }
    });
  }

  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  showImages(data) { 
    const loading = this.elementDOM.querySelector('.loading').className = '';
    const imagesListHTML = [];
    data.items.reverse().forEach(item => {
      imagesListHTML.push(this.getImageInfo(item));
    });
    this.elementDOM.querySelector('.content').insertAdjacentHTML('beforeEnd', imagesListHTML.join('\n'));
  }

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   * */
  formatDate(date) {
    const dateResult = new Date(date);
    return dateResult.toLocaleString('ru', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timezone: 'UTC',
      hour: 'numeric',
      minute: 'numeric',
    });
  }

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  getImageInfo(item) {
    return `
      <div class="image-preview-container">
        <img src="${item.sizes['6'].url}" />
        <table class="ui celled table">
        <thead>
          <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
        </thead>
        <tbody>
          <tr><td>${item.name}</td><td>${this.formatDate(item.created)}</td><td>${item.size/1000}Кб</td></tr>
        </tbody>
        </table>
        <div class="buttons-wrapper">
          <button class="ui labeled icon red basic button delete" data-path="${item.path}">
            Удалить
            <i class="trash icon"></i>
          </button>
          <button class="ui labeled icon violet basic button download" data-file="${item.file}">
            Скачать
            <i class="download icon"></i>
          </button>
        </div>
      </div>
      `;
  }
}
