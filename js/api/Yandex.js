/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';

  /**
   * Метод формирования и сохранения токена для Yandex API
   */
  static getToken() {
    let tokenUser = localStorage.getItem('tokenUser');
    if (!tokenUser) {
      tokenUser = prompt('Введите Yandex токен для работы с Yandex Диском!');
      localStorage.setItem('tokenUser', tokenUser);
    }
    return tokenUser;  
  }

  /**
   * Метод загрузки файла в облако
   */
  static uploadFile(path, url, callback) {
    createRequest({
      method: 'POST',
      url: `${Yandex.HOST}/resources/upload`,
      headers: {
        'Authorization': `OAuth ${Yandex.getToken()}`,
      },
      data: {
        url: url,
        path: path,
      },
      callback: callback,
    });
  }

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path, callback) {
    createRequest({
      method: 'DELETE',
      url: `${Yandex.HOST}/resources`,
      headers: {
        'Authorization': `OAuth ${Yandex.getToken()}`,
      },
      data: {
        path: path,
      },
      callback: callback,
    });
  }

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static getUploadedFiles(callback) {
    createRequest({
      method: 'GET',
      url: `${Yandex.HOST}/resources/files`,
      headers: {
        'Authorization': `OAuth ${Yandex.getToken()}`,
      },
      callback: callback,
    });
  }

  /**
   * Метод скачивания файлов
   */
  static downloadFileByUrl(url) {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'download.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
