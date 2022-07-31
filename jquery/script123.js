// $(function () {...}); вызывает функцию после загрузки страницы
$(function() {
  'use strict';

  /**
   * Конструктор, инициализирующий логику списка дел
   * на элементе с правильной версткой
   * Параметры:
   *  - DOM-элемент, являющийся контейнером списка 
   *    (уже с нужными дочерними элементами)
   */ 
  function Todo(elem) {
    // Ищем вложенные элементы, которые будут использованы в дальнейшем
    // Если их не будет - ошибки не возникнет, просто создадутся пустые jQuery-объекты
    this.eList = elem.find('.todo__list');
    this.eText = elem.find('.todo__text');
    this.eButton = elem.find('.todo__add');

    // Кешируем контекст вызова (созданный объект), 
    // чтобы использовать его в обработчиках
    var that = this;

    // Добавляем обработчик изменения поля ввода
    this.eText.on('input', function () {
      // Поле ввода не пусто => разблокируем кнопку "Добавить", иначе блокируем
      that.eButton.prop('disabled', !this.value);
      // здесь this - это тот элемент, на котором случилось событие
    });

    // Добавляем обработчик нажатия на кнопку "Добавить"
    // (не сработает, если кнопка заблокирована)
    this.eButton.on('click', function () {
      var val = that.eText.val();

      // Если поле ввода не пусто
      if (val) {
        // вызываем метод добавления элемента в список
        that.addItem(val);
        
        // очищаем поле и блокируем кнопку 
        // (при изменении поля в коде обработчик изменения поля не вызывается)
        that.eText.val('');
        that.eButton.prop('disabled', true);
      }
    });
    
    // Добавляем обработчик изменения статусов элементов списка (на сам список)
    // jQuery позволяет обрабатывать событие на всех дочерних элементах,
    // попадающих в условие селектора (второй параметр) - 
    // в данном случае, на всех элементах списка
    // это позволяет не подписывать обработчик на каждый элемент отдельно
    this.eList.on('click', '.todo__list-item', function () {
      var COMPLETED_CLASS = 'todo__list-item_completed_yes';
      var item = $(this);
      
      item.hasClass(COMPLETED_CLASS) ?
        item.removeClass(COMPLETED_CLASS) :
        item.addClass(COMPLETED_CLASS);
    });
    
    // Добавляем обработчик клика по удалялке внутри элемента списка
    // Добавляем тоже на список, чтобы не возиться с каждым элементом по отдельности
    this.eList.on('click', '.todo__list-item-remove', function (e) {
      // Ищем ближайший предок, являющийся элементом списка, и удаляем его из DOM.
      // Если у него были бы првязанные обработчики, .remove() бы их почистил,
      // но их нет - они заданы на самом списке
      $(this).closest('.todo__list-item').remove();
    });
  }

  /**
   * Метод добавления задачи в список
   * Параметры
   *  - Текст задачи
   *  - Флаг "выполнена" (сейчас не используется)
   */
  Todo.prototype.addItem = function(text, isCompleted) {
    // jQuery позволяет создавать DOM-объекты из HTML-строки
    var item = $(
      '<li class="todo__list-item">'+ 
        '<span class="todo__list-item-text"></span>' +
        '<span class="todo__list-item-remove">&#10060;</span>' +
      '</li>'
    );

    // Выставляем правильное состояние завершения в зависимости от isCompleted
    if (isCompleted) {
      // метод .addClass уже реализован в jQuery, и нам не нужно писать его самим
      item.addClass('todo__list-item_completed_yes');
    }
    
    // Мы в принципе могли подставить текст в строку, из которой создался элемент списка,
    // но тогда он был бы воспринят как HTML, а это очень небезопасно - 
    // нельзя вставлять в страницу HTML от пользователя, не заэкранировав его
    // см. https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)
    item.find('.todo__list-item-text').text(text);
    
    // Вставляем созданный элемент в список
    this.eList.append(item);
  }
  
  // Инициализируем логику списка задач на элементе с id="list"
  // Поскольку мы не используем прямые селекторы внутри конструктора,
  // на странице может одновременно быть несколько списков, 
  // которые никак друг другу не мешают
  var todo = new Todo($('#list'));
});
