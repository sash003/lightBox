;
(function($) {
  "use strict";

  /* Опции по умолчанию */
  var options = {
    selector: 'img',
    divId: 'closeLightBox',
    activeId: 'activeLightBox',
    activeClass: '.activeLightBox',
    // вычислим событие, которое Возбуждается при прокрутке колесом мыши
    weelEvt: (/Firefox/i.test(navigator.userAgent)) ? 'DOMMouseScroll.lightBox' : 'mousewheel.lightBox'
  };

  /* Объект методов для работы плагина */
  var methods = {
    // функция инициализации плагина
    init: function(o) {
      // применяет для каждого элемента methods.Action
      return this.each(methods.Action);
    },

    // создаём блок с картинкой в нём с пустым src (наше модальное окно)
    makeModalWindow: function() {
      var id = options.divId;
      options.modalId = '#' + id;
      options.modalImgI = options.modalId + ' img';
      if ($(options.modalId).size() === 0) {
        $('body').append($('<div id="' + id + '"><img src="" alt="" style="transform: scale(1.0);"/></div>'));
      }
      options.modal = $(options.modalId);
      options.modalImg = $(options.modalImgI);
    },

    // вешаем обработчики событий 
    initHandlers: function() {
      // клик на блоке, на который вешается lightBox
      options.block.on('click.lightBox', function() {
        $('body').find(options.activeClass).removeClass(options.activeId);
        $(this).addClass(options.activeId);
      });

      // клик по картинке
      options.images.on('click.lightBox', methods.functions.imgsClickHandler);

      // скрытие картинки по клику вне 
      options.modal.on('mousedown.lightBox', function(e) {
        var div = options.modalImg;
        if (!div.is(e.target) // если клик был не по нашему блоку
          &&
          div.has(e.target).length === 0) { // и не по его дочерним элементам

          // снимается клик, события клавиатуры и мыши
          options.modalImg.off('click.lightBox', methods.functions.clickHandler);
          $(window).off('keydown.lightBox', methods.functions.keyDownHandler);
          options.modal.off(options.weelEvt, methods.functions.mouseWheelHandler);
          $('body').find(options.activeClass).removeClass(options.activeId);
          options.modal.hide();
        }
      });
    },

    // no comments
    functions: {

      preventdefault: function(e) {
        e = e || window.event;
        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;
      },

      nextElem: function() {
        Array.prototype.nextElem = function(el, n) {
          var i = this.indexOf(el);
          if (n == 'next') {
            return this[i + 1] !== undefined ? this[i + 1] : this[0];
          } else if (n == 'prev') {
            return this[i - 1] !== undefined ? this[i - 1] : this[this.length - 1];
          }
        }
      },

      clickHandler: function() {
        var $this = $(this),
          src = $this.attr('src'),
          nextEl = options.imgsArr.nextElem(src, 'next');
        $this.attr('src', nextEl);
        setTimeout(methods.functions.setWidth(), 1);
      },

      imgsClickHandler: function() {
        var $this = $(this),
          src = $this.attr('src');
        // уже после добавления класса activeLightBox сработает обработчк клика по картинке
        setTimeout(function() {
          // выберем все указанные картинки из блока, на который вешается метод
          options.activeImgs = $(options.activeClass).find(options.selector);
          // вернём массив с путями к картинкам
          options.imgsArr = $.map(options.activeImgs, function(el) {
            return $(el).attr('src');
          });

          if (options.imgsArr.length) {
            options.modal.show();
            options.modalImg.attr('src', src);
            methods.functions.setWidth();
          }

          // вешается клик, события клавиатуры и мыши
          $(window).on('keydown.lightBox', methods.functions.keyDownHandler);
          options.modalImg.on('click.lightBox', methods.functions.clickHandler);
          options.modal.on(options.weelEvt, methods.functions.mouseWheelHandler);

        }, 11);

      },

      keyDownHandler: function(e) {
        e = e || window.event;
        if (e.which == 27) {
          options.modalImg.off('click.lightBox', methods.functions.clickHandler);
          $(window).off('keydown.lightBox', methods.functions.keyDownHandler);
          options.modal.off(options.weelEvt, methods.functions.mouseWheelHandler);
          $('body').find(options.activeClass).removeClass(options.activeId);
          options.modal.hide();
        }
        if (e.which == 37 || e.which == 40) {
          methods.functions.preventdefault(e);
          var src = options.modalImg.attr('src'),
            nextEl = options.imgsArr.nextElem(src, 'prev');
          options.modalImg.attr('src', nextEl);
          methods.functions.setWidth()
        }
        if (e.which == 38 || e.which == 39) {
          methods.functions.preventdefault(e);
          var src = options.modalImg.attr('src'),
            nextEl = options.imgsArr.nextElem(src, 'next');
          options.modalImg.attr('src', nextEl);
          methods.functions.setWidth()
        }
        if (e.which == 107) {
          methods.functions.resize("+");
        }
        if (e.which == 109) {
          methods.functions.resize("-");
        }

      },

      // прокрутка колесом мыши
      mouseWheelHandler: function(e) {
        methods.functions.preventdefault(e);
        var evt = e.originalEvent ? e.originalEvent : e,
          delta = evt.detail ? evt.detail * (-40) : evt.wheelDelta;
        if (delta > 0) {
          methods.functions.resize("+");
        }
        if (delta < 0) {
          methods.functions.resize("-");
        }
      },

      resize: function(direction) {
        var style = options.modalImg.attr('style'),
          newTransform = style.replace(
            /(scale.)(\d(\.\d)?)/,
            function(match, value, value2) {
              var n = parseFloat(value2),
                nn;
              if (direction === "+") {
                nn = n + 0.1;
                if (nn < 1.7) {
                  return value + nn.toFixed(1);
                }
              }
              if (direction === "-") {
                nn = n - 0.1;
                if (nn > 0.5) {
                  return value + nn.toFixed(1);
                }
              }
              return value + n;
            });
        options.modalImg.attr('style', newTransform);
      },

      // рассчёт размеров картинок в зависимости от многих факторов
      setWidth: function() {
        var imW = parseInt(options.modalImg.css('width')),
          imH = parseInt(options.modalImg.css('height')),
          blW = parseInt(options.modal.css('width')),
          blH = parseInt(options.modal.css('height')),
          wW = screen.width,
          wH = screen.height,
          padd;

        options.modal.css({
          paddingTop: 0
        });

        if (imW > imH) {
          options.modalImg.css({
            width: '77%',
            height: 'auto'
          });
          padd = (parseInt(options.modal.css('height')) - parseInt(options.modalImg.css('height'))) / 2;
          options.modal.css({
            paddingTop: padd + 'px'
          });
        } else {
          options.modalImg.css({
            height: '77%',
            width: 'auto'
          });
          padd = (parseInt(options.modal.css('height')) - parseInt(options.modalImg.css('height'))) / 1.33;
          console.log(options.modal.css('height'), options.modalImg.css('height'), padd);
          options.modal.css({
            paddingTop: padd
          });
        }
      }
    },

    // и вот он, весь наш запакованный экшн
    Action: function(o) {
      // $.extend Объединяет содержимое двух или более объектов (расширяет исходный объект, дополняя его свойствами объектов источников):
      options = $.extend(options, o);
      options.block = $(this);
      options.images = $(options.selector, this);
      methods.makeModalWindow();
      if (![].nextElem) methods.functions.nextElem();
      methods.initHandlers();
    }
  };

  ///////////////////////////////////////////
  /* Главное чудо собственной персоной */
  // расширим джейкверю на наш метод loghtBox
  $.fn.lightBox = function(opts) {
    if (publicMethods[opts]) {
      return publicMethods[opts].apply(this, [].slice.call(arguments, 1));
    } else if (typeof opts === 'object' || !opts) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Метод с именем "' + opts + '" не существует!');
    }
  };

  /* Методы для пользователя */
  var publicMethods = {
    // отключение плагина
    disable: function() {
      this.each(function() {
        // снимаем все обработчики событий нашего плагина
        $(this).off(".lightBox");
      });
    },
    // перезапуск плагина
    restart: function() {
      return this.each(function() {
        // снимем обработчики и заново что-то намутил, но главное IT WORKS! :)
        $(this).off(".lightBox");
        $(this).on('click.lightBox', function() {
          $('body').find(options.activeClass).removeClass(options.activeId);
          $(this).addClass(options.activeId);
        });
      });
    }
  };

}(jQuery)); // That`s all folks
