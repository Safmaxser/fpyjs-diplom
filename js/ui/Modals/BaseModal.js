/**
 * Класс BaseModal
 * Используется как базовый класс всплывающего окна
 */
class BaseModal {
  constructor(element) {
    this.semanticElement = element;
    this.elementDOM = element[0];
  }

  /**
   * Открывает всплывающее окно
   */
  open() {
    this.semanticElement.modal('refresh');
    this.semanticElement.modal('show');
  }

  /**
   * Закрывает всплывающее окно
   */
  close() {
    this.semanticElement.modal('hide');
  }
}