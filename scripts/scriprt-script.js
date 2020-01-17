'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const search = document.querySelector('.search'), // получаем всю форму поиска
        cartBtn = document.getElementById('cart'), // получим кнопочку (иконку) корзины
        wishlistBtn = document.getElementById('wishlist'), // получим иконку понравившихся товаров
        goodsWrapper = document.querySelector('.goods-wrapper'), // получим обертку карточки товара
        cart = document.querySelector('.cart'), // получим саму корзину
        categoryWrapper = document.querySelector('.category'); // получим блок списка категорий товаров


  // функция создания элементов карточки товара
  const createCarGoods = (id, title, price, img) => {
    const card = document.createElement('div'); // создаем карточку
    card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3'; // добавим классы css этой каторочке
    // сформируем нашу карточку товара
    card.insertAdjacentHTML('afterbegin', `
      <div class="card">
        <div class="card-img-wrapper">
          <img class="card-img-top" src="${img}" alt="${title}">
          <button class="card-add-wishlist" data-goods-id = "${id}"></button>
        </div>
        <div class="card-body justify-content-between">
          <a href="#" class="card-title">${title}</a>
          <div class="card-price">${price} ₽</div>
          <div>
            <button class="card-add-cart" data-goods-id = "${id}">Добавить в корзину</button>
          </div>
        </div>
      </div>
    `);
    return card;
  };


  // функция вставки спинера(лоадера) пока грузятся товары из бд
  const showLoader = () => {
    goodsWrapper.textContent = '';
    goodsWrapper.insertAdjacentHTML('afterbegin', `
      <div class="loadingio-spinner-spinner-v8jhmp8puq">
        <div class="ldio-pjtl4f0feoo">
          <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
        </div>
      </div>
    `);
  };


  // функция заполнения данными из бд карточек товаров
  const renderCard = items => {
    goodsWrapper.textContent = '';
    items.forEach( ({ id, title, price, imgMin }) => { // Деструктурирующее присваивание массива
      goodsWrapper.append(createCarGoods(id, title, price, imgMin));
    });
  };


  // функия получения товаров из бд (в нашем случае из json файла)
  const getGoods = (data, filter) => {
    fetch('db/db.json')
      .then(response => {
        showLoader();
          return response.json();
      })
      //FIXME: добавить setTimeout для имитации длительности загрузки
      .then(filter)
      .then(data);
  };


  // функция закрытия корзыны (ее скрытие с экрана)
  const closeCart = e =>{
    const target = e.target;
    if (target === cart || target.classList.contains('cart-close') || e.code == 'Escape') {
      cart.style.display = '';
      document.removeEventListener('keydown', closeCart);
    }
  };


  // функция открытия корзины (ее вывод на экран)
  const openCart = e => {
    e.preventDefault();
    cart.style.display = 'flex';
    document.addEventListener('keydown', closeCart);
  };


  // функция рандомной сортировки карточек товаров
  const randomSort = items => items.sort(() => Math.random() - 0.5);


  // функция выбора категорий товаров
  const chooseCategory = e => {
    e.preventDefault();
    const target = e.target;
    if (target.classList.contains('category-item')) {
      const category = target.dataset.category;
      getGoods(renderCard, goods => goods.filter(item => item.category.includes(category)));
    }
  };










cartBtn.addEventListener('click', openCart);
cart.addEventListener('click', closeCart);
categoryWrapper.addEventListener('click', chooseCategory);


getGoods(renderCard, randomSort);



});