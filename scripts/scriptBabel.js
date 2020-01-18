"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

document.addEventListener('DOMContentLoaded', function () {
  var search = document.querySelector('.search');
  var cartBtn = document.getElementById('cart'); //кнопка открытия корзины

  var wishListBtn = document.getElementById('wishlist'); //кнопка открытия "Мои желания"

  var cartCounter = cartBtn.querySelector('.counter'); //счетчик корзины

  var wishListCounter = wishListBtn.querySelector('.counter'); //счетчик вишлиста

  var goodsWrapper = document.querySelector('.goods-wrapper'); // Враппер товаров

  var cart = document.querySelector('.cart'); //сама корзина

  var category = document.querySelector('.category'); //Див категорий

  var cartWrapper = document.querySelector('.cart-wrapper');
  var wishList = []; // const basket = {};

  var basket = {}; //FUNCTIONS

  var loading = function loading() {
    goodsWrapper.innerHTML = "<div id=\"spinner\">\n                <div class=\"spinner-loading\">\n                    <div>\n                        <div>\n                            <div>\t</div>\n                        </div>\n                        <div>\n                            <div>\t</div>\n                        </div>\n                        <div>\n                            <div>\t</div>\n                        </div>\n                        <div>\n                            <div>\t</div>\n                        </div>\n                    </div>\n                </div>\n            </div>";
  };

  var loadBasket = function loadBasket() {
    cartWrapper.innerHTML = "\n            <div id=\"spinner\">\n                <div class=\"spinner-loading\">\n                    <div>\n                        <div>\n                            <div>\t</div>\n                        </div>\n                        <div>\n                            <div>\t</div>\n                        </div>\n                        <div>\n                            <div>\t</div>\n                        </div>\n                        <div>\n                            <div>\t</div>\n                        </div>\n                    </div>\n                </div>\n            </div>";
  }; // Функция получения объектов из JSON


  var getGoods = function getGoods(hendler, filter, where) {
    if (where === 'start' || where === 'cat' || where === 'wish' || where === 'search') {
      loading();
    }

    if (where === 'cart') {
      loadBasket();
    }

    fetch('db/db.json').then(function (response) {
      return response.json();
    }).then(filter).then(hendler);
  }; // Добавление карточек на главную странцу
  // Функция генерации карточек товаров на страницу


  var createGoodsCard = function createGoodsCard(id, title, price, img) {
    var card = document.createElement('div');
    card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
    card.innerHTML = "<div class=\"card\">\n                                    <div class=\"card-img-wrapper\">\n                                        <img class=\"card-img-top\" src=\"".concat(img, "\" alt=\"\">\n                                        <button class=\"card-add-wishlist ").concat(wishList.includes(id) ? 'active' : '', "\"\n                                            data-goods-id=\"").concat(id, "\"></button>\n                                    </div>\n                                    <div class=\"card-body justify-content-between\">\n                                        <a href=\"#\" class=\"card-title\">").concat(title, "</a>\n                                        <div class=\"card-price\">").concat(price, " \u20BD</div>\n                                        <div>\n                                            <button class=\"card-add-cart\" data-goods-id=\"").concat(id, "\">\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443</button>\n                                        </div>\n                                    </div>\n                                </div>");
    return card;
  }; // Функция добавления карточек товаров на страницу


  var renderCard = function renderCard(goods) {
    goodsWrapper.textContent = '';

    if (goods.length) {
      goods.forEach(function (_ref) {
        var id = _ref.id,
            title = _ref.title,
            price = _ref.price,
            imgMin = _ref.imgMin;
        goodsWrapper.append(createGoodsCard(id, title, price, imgMin));
      });
    } else {
      goodsWrapper.textContent = '❌ Извините, мы не нашли товаров по Вашему запросу';
    }
  }; // Добавление карточек на главную странцу
  // Функции корзины
  //Показ окна корзины


  var openCart = function openCart(event) {
    event.preventDefault();
    cart.style.display = 'flex';
    document.addEventListener('keydown', closeCart);
    getGoods(renderBasket, showCardBasket, 'cart');
  }; //Скрытие окна корзины


  var closeCart = function closeCart(event) {
    if (event.target.classList.contains('cart') || event.target.classList.contains('cart-close') || event.keyCode == 27 && event.code == 'Escape') {
      cart.style.display = 'none';
      document.removeEventListener('keydown', closeCart);
    }
  }; // Функция отображения количества товаров


  var checkCount = function checkCount() {
    wishListCounter.textContent = wishList.length;
    cartCounter.textContent = Object.keys(basket).length;
  }; // Функция генерации карточек товаров в корзину


  var createCardGoodsBasket = function createCardGoodsBasket(id, title, price, img) {
    var cartDiv = document.createElement('div');
    cartDiv.className = 'goods';
    cartDiv.innerHTML = "<div class=\"goods-img-wrapper\">\n                                        <img class=\"goods-img\" src=\"".concat(img, "\" alt=\"\">\n                                    </div>\n                                    <div class=\"goods-description\">\n                                        <h2 class=\"goods-title\">").concat(title, "</h2>\n                                        <p class=\"goods-price\">").concat(price, " \u20BD</p>\n\n                                    </div>\n                                    <div class=\"goods-price-count\">\n                                        <div class=\"goods-trigger\">\n                                            <button class=\"goods-add-wishlist ").concat(wishList.includes(id) ? 'active' : '', "\"\n                                                data-goods-id=\"").concat(id, "\"></button>\n                                            <button class=\"goods-delete\"\n                                                data-goods-id=\"").concat(id, "\"></button>\n                                        </div>\n                                        <div class=\"goods-count\">").concat(basket[id], "</div>\n                                    </div>");
    return cartDiv;
  }; // Функция добавления карточек товаров в корзину


  var renderBasket = function renderBasket(goods) {
    cartWrapper.textContent = '';

    if (goods.length) {
      goods.forEach(function (_ref2) {
        var id = _ref2.id,
            title = _ref2.title,
            price = _ref2.price,
            imgMin = _ref2.imgMin;
        cartWrapper.append(createCardGoodsBasket(id, title, price, imgMin));
      });
    } else {
      cartWrapper.innerHTML = '<div id="card-rempty">❌ В вашей корзине пока нет товаров</div>';
    }
  };

  calcTotalPrice = function calcTotalPrice(goods) {
    var sum = goods.reduce(function (accum, item) {
      return accum + item.price * basket[item.id];
    }, 0); // let sum = 0;
    // for (const item of goods) {
    //     sum += item.price * basket[item.id];
    // }
    //console.log(sum);
    //console.log(goods);

    cart.querySelector('.cart-total>span').textContent = sum.toFixed(2); //Math.floor(sum);
  };

  showCardBasket = function showCardBasket(goods) {
    var basketGoods = goods.filter(function (item) {
      return basket.hasOwnProperty(item.id);
    });
    calcTotalPrice(basketGoods);
    return basketGoods;
  };

  var addBasket = function addBasket(id) {
    if (basket[id]) {
      basket[id] += 1;
    } else {
      basket[id] = 1;
    }

    checkCount();
    cookieQuery(); //console.log(basket);
  };

  var removeGoods = function removeGoods(id) {
    delete basket[id];
    checkCount();
    cookieQuery();
    getGoods(renderBasket, showCardBasket, 'cart');
  };

  var getCookie = function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  };

  var cookieQuery = function cookieQuery(get) {
    if (get) {
      if (getCookie('goodsBasket')) {
        Object.assign(basket, JSON.parse(getCookie('goodsBasket')));
        basket = JSON.parse(getCookie('goodsBasket')); //console.log(getCookie('goodsBasket')); 
      }

      checkCount();
    } else {
      document.cookie = "goodsBasket=".concat(JSON.stringify(basket), "; max-age=86400e3");
    }

    console.log(basket);
  };

  var handlerBasket = function handlerBasket() {
    var target = event.target;

    if (target.classList.contains('goods-add-wishlist')) {
      //targetGoods.getAttribute('data-goods-id');
      //targetGoods.dataset.goodsId
      toggleWishList(target.dataset.goodsId, target);
    }

    if (target.classList.contains('goods-delete')) {
      removeGoods(target.dataset.goodsId);
    }
  }; // Функции корзины
  // Функции вишлиста
  // Функция добавления товаров в корзину и вишлист


  var addGoods = function addGoods(event) {
    var target = event.target;

    if (target.classList.contains('card-add-wishlist')) {
      //targetGoods.getAttribute('data-goods-id');
      //targetGoods.dataset.goodsId
      toggleWishList(target.dataset.goodsId, target);
    }

    if (target.classList.contains('card-add-cart')) {
      //targetGoods.getAttribute('data-goods-id');
      //targetGoods.dataset.goodsId
      addBasket(target.dataset.goodsId);
    }
  };

  var storageQuery = function storageQuery(get) {
    if (get) {
      if (localStorage.getItem('wishlist')) {
        // Старая обработка
        // const wishlistStorage = JSON.parse(localStorage.getItem('wishlist'));
        // wishlistStorage.forEach(id => wishList.push(id));
        //
        //wishList.splice(0, 0, ...JSON.parse(localStorage.getItem('wishlist')));
        //
        wishList.push.apply(wishList, _toConsumableArray(JSON.parse(localStorage.getItem('wishlist'))));
      }

      checkCount();
    } else {
      localStorage.setItem('wishlist', JSON.stringify(wishList));
    }

    console.log('wishList из LocalStorage', wishList);
  };

  var toggleWishList = function toggleWishList(id, elem) {
    if (wishList.includes(id)) {
      wishList.splice(wishList.indexOf(id), 1);
      elem.classList.remove('active');
    } else {
      wishList.push(id);
      elem.classList.add('active');
    }

    checkCount();
    storageQuery();
    console.log(wishList);
  }; // Отображение товаров, которые есть в вишлисте


  var showWishList = function showWishList(event) {
    event.preventDefault();
    getGoods(renderCard, function (goods) {
      return goods.filter(function (item) {
        return wishList.includes(item.id);
      });
    }, 'wish');
  }; // Функции вишлиста 
  // Случайная сортировка товаров


  var randomSort = function randomSort(goods) {
    return goods.sort(function () {
      return Math.random() - 0.5;
    });
  }; // Обработчик клика на категорию


  var chooseCategory = function chooseCategory(event) {
    event.preventDefault();
    var target = event.target;

    if (target.classList.contains('category-item')) {
      var _category = target.dataset.category;
      getGoods(renderCard, function (goods) {
        return goods.filter(function (item) {
          return item.category.includes(_category);
        });
      }, 'cat');
    }
  }; // Функция поиска по товарам


  var searchGoods = function searchGoods(event) {
    event.preventDefault();
    var input = event.target.elements.searchGoods;
    var inputValue = input.value.trim();

    if (inputValue !== '') {
      // Создание регулярного выражиение
      var searchString = new RegExp(inputValue, 'i');
      getGoods(renderCard, function (goods) {
        return goods.filter(function (item) {
          return searchString.test(item.title);
        });
      }, 'search'); //.test() - метод, возвращает True/False если нашел в товарах
    } else {
      search.classList.add('error');
      setTimeout(function () {
        search.classList.remove('error');
      }, 2000);
    }

    input.value = '';
  }; // END FUNCTIONS 


  cartBtn.addEventListener('click', openCart);
  cart.addEventListener('click', closeCart);
  wishListBtn.addEventListener('click', showWishList); // Вешаем событие на ВСЮ форму поиска

  search.addEventListener('submit', searchGoods);
  category.addEventListener('click', chooseCategory);
  goodsWrapper.addEventListener('click', addGoods);
  cartWrapper.addEventListener('click', handlerBasket);
  getGoods(renderCard, randomSort, 'start');
  storageQuery(true);
  cookieQuery(true);
});