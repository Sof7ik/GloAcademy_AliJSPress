document.addEventListener('DOMContentLoaded', () => {

    const search = document.querySelector('.search');

    const cartBtn = document.getElementById('cart'); //кнопка открытия корзины
    const wishListBtn = document.getElementById('wishlist');//кнопка открытия "Мои желания"
    const cartCounter = cartBtn.querySelector('.counter'); //счетчик корзины
    const wishListCounter = wishListBtn.querySelector('.counter'); //счетчик вишлиста

    const goodsWrapper = document.querySelector('.goods-wrapper'); // Враппер товаров
    const cart = document.querySelector('.cart'); //сама корзина
    const category = document.querySelector('.category'); //Див категорий
    
    const cartWrapper = document.querySelector('.cart-wrapper');

    const wishList = [];
    // const basket = {};
    let basket = {};

    //FUNCTIONS
        const loading = () => {
            goodsWrapper.innerHTML = 
            `<div id="spinner">
                <div class="spinner-loading">
                    <div>
                        <div>
                            <div>	</div>
                        </div>
                        <div>
                            <div>	</div>
                        </div>
                        <div>
                            <div>	</div>
                        </div>
                        <div>
                            <div>	</div>
                        </div>
                    </div>
                </div>
            </div>`
        }

        const loadBasket = () => {
            cartWrapper.innerHTML = `
            <div id="spinner">
                <div class="spinner-loading">
                    <div>
                        <div>
                            <div>	</div>
                        </div>
                        <div>
                            <div>	</div>
                        </div>
                        <div>
                            <div>	</div>
                        </div>
                        <div>
                            <div>	</div>
                        </div>
                    </div>
                </div>
            </div>`
        }

        // Функция получения объектов из JSON
        const getGoods = (hendler, filter, where) => {
            if (where === 'start' || where === 'cat' || where === 'wish' || where === 'search') {
                loading();
            }
            if (where === 'cart') {
                loadBasket();
            }
            fetch('db/db.json')
            .then(response => response.json())
            .then(filter)
            .then(hendler);
        };

        // Добавление карточек на главную странцу

            // Функция генерации карточек товаров на страницу
            const createGoodsCard = (id, title, price, img) => {
                const card = document.createElement('div');
                card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
                card.innerHTML = `<div class="card">
                                    <div class="card-img-wrapper">
                                        <img class="card-img-top" src="${img}" alt="">
                                        <button class="card-add-wishlist ${wishList.includes(id) ? 'active' : ''}"
                                            data-goods-id="${id}"></button>
                                    </div>
                                    <div class="card-body justify-content-between">
                                        <a href="#" class="card-title">${title}</a>
                                        <div class="card-price">${price} ₽</div>
                                        <div>
                                            <button class="card-add-cart" data-goods-id="${id}">Добавить в корзину</button>
                                        </div>
                                    </div>
                                </div>`
                return card;
            };
            
            // Функция добавления карточек товаров на страницу
            const renderCard = goods => {
                goodsWrapper.textContent = '';

                if (goods.length) {
                    goods.forEach(({ id, title, price, imgMin }) => {
                        goodsWrapper.append(createGoodsCard(id, title, price, imgMin));
                    });
                } else {
                    goodsWrapper.textContent = '❌ Извините, мы не нашли товаров по Вашему запросу';
                } 
            };

        // Добавление карточек на главную странцу

        // Функции корзины

            //Показ окна корзины
            const openCart = (event) => {
                event.preventDefault();
                cart.style.display = 'flex';
                document.addEventListener('keydown', closeCart);
                getGoods(renderBasket, showCardBasket, 'cart');
            }

            //Скрытие окна корзины
            const closeCart = (event) => {
                if (event.target.classList.contains('cart') || event.target.classList.contains('cart-close') || (event.keyCode == 27 && event.code == 'Escape')) {
                    cart.style.display = 'none';
                    document.removeEventListener('keydown', closeCart);
                }
            }

            // Функция отображения количества товаров
            const checkCount = () => {
                wishListCounter.textContent = wishList.length;
                cartCounter.textContent = Object.keys(basket).length;
            }

            // Функция генерации карточек товаров в корзину
            const createCardGoodsBasket = (id, title, price, img) => {
                const cartDiv = document.createElement('div');
                cartDiv.className = 'goods';
                cartDiv.innerHTML = `<div class="goods-img-wrapper">
                                        <img class="goods-img" src="${img}" alt="">
                                    </div>
                                    <div class="goods-description">
                                        <h2 class="goods-title">${title}</h2>
                                        <p class="goods-price">${price} ₽</p>

                                    </div>
                                    <div class="goods-price-count">
                                        <div class="goods-trigger">
                                            <button class="goods-add-wishlist ${wishList.includes(id) ? 'active' : ''}"
                                                data-goods-id="${id}"></button>
                                            <button class="goods-delete"
                                                data-goods-id="${id}"></button>
                                        </div>
                                        <div class="goods-count">${basket[id]}</div>
                                    </div>`
                return cartDiv;
            };

            // Функция добавления карточек товаров в корзину
            const renderBasket = goods => {
                cartWrapper.textContent = '';

                if (goods.length) {
                    goods.forEach(({ id, title, price, imgMin }) => {
                        cartWrapper.append(createCardGoodsBasket(id, title, price, imgMin));
                    });
                } else {
                    cartWrapper.innerHTML = '<div id="card-rempty">❌ В вашей корзине пока нет товаров</div>';
                } 
            };

            calcTotalPrice = (goods) => {
                let sum = goods.reduce(
                    (accum, item) => {
                        return accum + (item.price *  basket[item.id]);
                    }, 0
                );

                // let sum = 0;
                // for (const item of goods) {
                //     sum += item.price * basket[item.id];
                // }

                //console.log(sum);
                //console.log(goods);
                cart.querySelector('.cart-total>span').textContent = sum.toFixed(2); //Math.floor(sum);
                
            }

            showCardBasket = goods => {

                const basketGoods = goods.filter(item => basket.hasOwnProperty(item.id))
                calcTotalPrice(basketGoods);
                return basketGoods;
            }

            const addBasket = (id) => {
                if (basket[id]) {
                    basket[id] += 1;
                }
                else {
                    basket[id] = 1;
                }
                checkCount();
                cookieQuery();
                //console.log(basket);
            };

            const removeGoods = (id) => {
                delete basket[id];

                checkCount();
                cookieQuery();
                getGoods(renderBasket, showCardBasket, 'cart');
            };

            const getCookie = (name) => {
                let matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
                ));
                return matches ? decodeURIComponent(matches[1]) : undefined;
            };

            const cookieQuery = (get) => {
                if (get) {
                    if(getCookie('goodsBasket')) {
                        Object.assign(basket, JSON.parse(getCookie('goodsBasket')));
                        basket = JSON.parse(getCookie('goodsBasket'));
                        //console.log(getCookie('goodsBasket')); 
                    }
                    checkCount();   
                } else {
                    document.cookie = `goodsBasket=${JSON.stringify(basket)}; max-age=86400e3`;
                }
                
                //console.log(basket);
            }

            const handlerBasket = () => {
                const target = event.target;
                if (target.classList.contains('goods-add-wishlist')) {
                    //targetGoods.getAttribute('data-goods-id');
                    //targetGoods.dataset.goodsId
                    toggleWishList(target.dataset.goodsId, target);
                }

                if (target.classList.contains('goods-delete')) {
                    removeGoods(target.dataset.goodsId);
                }
            }

        // Функции корзины

        // Функции вишлиста

            // Функция добавления товаров в корзину и вишлист
            const addGoods = (event) => {
                const target = event.target;

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
            }     

            const storageQuery = (get) => {
                if (get) {
                    if (localStorage.getItem('wishlist')) {
                        // Старая обработка
                        // const wishlistStorage = JSON.parse(localStorage.getItem('wishlist'));
                        // wishlistStorage.forEach(id => wishList.push(id));

                        //
                        //wishList.splice(0, 0, ...JSON.parse(localStorage.getItem('wishlist')));

                        //
                        wishList.push(...JSON.parse(localStorage.getItem('wishlist')));
                    }
                    checkCount();
                } else {
                    localStorage.setItem('wishlist', JSON.stringify(wishList));
                }
                //console.log('wishList из LocalStorage', wishList); 
            }

            const toggleWishList = (id, elem) => {
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
            }

            // Отображение товаров, которые есть в вишлисте
            const showWishList = (event) => {
                event.preventDefault();
                getGoods(renderCard, goods => goods.filter(item => wishList.includes(item.id)), 'wish');
            }

        // Функции вишлиста 

        // Случайная сортировка товаров
        const randomSort = goods => goods.sort(() => Math.random() - 0.5);

        // Обработчик клика на категорию
        const chooseCategory = event => {
            event.preventDefault();
            const target = event.target;

            if (target.classList.contains('category-item')) {
                const category = target.dataset.category;
                getGoods(renderCard, goods => goods.filter(item => item.category.includes(category)), 'cat')}
        };

        // Функция поиска по товарам
        const searchGoods = (event) => {
            event.preventDefault();

            const input = event.target.elements.searchGoods;
            const inputValue = input.value.trim();
            if (inputValue !== '') {
                // Создание регулярного выражиение
                const searchString = new RegExp(inputValue, 'i');
                getGoods(renderCard, goods => goods.filter(item => searchString.test(item.title)), 'search');
                //.test() - метод, возвращает True/False если нашел в товарах
            } else {
                search.classList.add('error');
                setTimeout( () => {
                    search.classList.remove('error');
                }, 2000)
            }

            input.value = '';
        }

    // END FUNCTIONS 

    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    wishListBtn.addEventListener('click', showWishList);

    // Вешаем событие на ВСЮ форму поиска
    search.addEventListener('submit', searchGoods);

    category.addEventListener('click', chooseCategory);
    goodsWrapper.addEventListener('click', addGoods);
    cartWrapper.addEventListener('click', handlerBasket)

    getGoods(renderCard, randomSort, 'start');

    storageQuery(true);
    cookieQuery(true);
    
});