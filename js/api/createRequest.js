/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = async (options = {}) => {
  const paramsURL = new URLSearchParams(options.data);
  const collectedURL = new URL(options.url);
  collectedURL.search = paramsURL;
  try {
    let response = await fetch(collectedURL, {
      method: options.method,
      headers: options.headers,
    });
    if (response.ok) {
      let result = null;
      if (response.statusText === 'OK') {
        result = await response.json();
      } 
      options.callback(result);
    } else {
      alert(`Ошибка: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    alert('Ошибка:', error);
  }
};
