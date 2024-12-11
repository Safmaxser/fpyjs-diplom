/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {

  static ACCESS_TOKEN = '958eb5d439726565e9333aa30e50e0f937ee432e927f0dbd541c541887d919a7c56f95c04217915c32008';
  static lastCallback;

  /**
   * Получает изображения
   * */
  static get(id = '', callback){
    VK.lastCallback = callback;
    const script = document.createElement('script');
    script.src = `https://api.vk.com/method/photos.get?owner_id=${id}&album_id=profile&access_token=${VK.ACCESS_TOKEN}&v=5.199&callback=VK.processData`;
    document.querySelector('head').appendChild(script);
  }

  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result){
    const script = document.querySelector('head > script');
    if (script) {
      script.remove();
    }    
    const response = result.response;
    if (response) {
      const items = Array.from(result.response.items, el => {
        if (el.orig_photo) {
          return el.orig_photo.url;
        } else if (el.sizes) {
          const arrSizes = ['s', 'm', 'x', 'o', 'p', 'q', 'r', 'y', 'z', 'w'];
          let numSize = -1;
          let url;
          el.sizes.forEach(size => {
            if (arrSizes.indexOf(size.type) > numSize) {
              numSize = arrSizes.indexOf(size.type);
              url = size.url;
            }
          });
          if (url) {
            return url;
          }
        }        
      });
      VK.lastCallback(items);
      VK.lastCallback = () => {};
    } else {
      const error = result.error;
      if (error) {
        alert(error.error_msg);
      } else {
        alert('Неизвестная ошибка!');
      }      
    }    
  }
}
