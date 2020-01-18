document.addEventListener('DOMContentLoaded', () => {

    const search = document.querySelector('.search');
    const cartBtn = document.getElementById('cart'); //кнопка открытия корзины
    const wishListBtn = document.getElementById('wishlist');//кнопка открытия "Мои желания"
    const goodsWrapper = document.querySelector('.goods-wrapper'); // Враппер товаров
    const cart = document.querySelector('.cart'); //сама корзина
    const category = document.querySelector('.category'); //Див категорий
    const cartCounter = cartBtn.querySelector('.counter');
    const wishListCounter = wishListBtn.querySelector('.counter');
    const cartWrapper = document.querySelector('.cart-wrapper');

    const wishList = [];
    let basket = {};

    const loading = () => {
        goodsWrapper.innerHTML = `<div id="spinner">
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

    //FUNCTIONS
    //функция вывода товаров на страницу (в будущем обработчик AJAX)
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

    const createGoodsCart = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'goods';
        card.innerHTML = `<div class="goods-img-wrapper">
                            <img class="goods-img" src="${img}" alt="">
                        </div>
                        <div class="goods-description">
                            <h2 class="goods-title">${title}</h2>
                            <p class="goods-price">${price} ₽</p>
                        </div>
                        <div class="goods-price-count">
                            <div class="goods-trigger">
                                <button class="goods-add-wishlist" ${wishList.includes(id) ? 'active' : ''} 
                                data-goods-id="${id}"></button>
                                <button class="goods-delete" data-goods-id="${id}></button>
                            </div>
                            <div class="goods-count">1</div>
                        </div>`
        return card;
    };

    //Показ окна корзины
    const openCart = (event) => {
        event.preventDefault();
        cart.style.display = 'flex';
        document.addEventListener('keydown', closeCart);
        getGoods(renderCart, showCardBasket);
    }

    const showCardBasket = (goods) => {
        goods.filter(item => basket.hasOwnProperty(item.id));
    }

    //Скрытие окна корзины
    const closeCart = (event) => {
        if (event.target.classList.contains('cart') || event.target.classList.contains('cart-close') || (event.keyCode == 27 && event.code == 'Escape')) {
            cart.style.display = 'none';
            document.removeEventListener('keydown', closeCart);
        }
    }

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

    const renderCart = goods => {
        cartWrapper.textContent = '';

        if (goods.length) {
            goods.forEach(({ id, title, price, imgMin }) => {
                cartWrapper.append(createGoodsCart(id, title, price, imgMin));
            });
        } else {
            cartWrapper.innerHTML = `<div id="cart-empty">
                Ваша корзина пока пуста
            </div>`;
        } 
    };
    
    const getGoods = (hendler, filter) => {
        loading();
        fetch('db/db.json')
        .then(response => response.json())
        .then(filter)
        .then(hendler);
    };
    
    const randomSort = goods => goods.sort(() => Math.random() - 0.5);
    
    const chooseCategory = event => {
        event.preventDefault();
        const target = event.target;

        if (target.classList.contains('category-item')) {
            const category = target.dataset.category;
            getGoods(renderCard, goods => goods.filter(item => item.category.includes(category)))}
    };

    const searchGoods = (event) => {
        event.preventDefault();

        const input = event.target.elements.searchGoods;
        const inputValue = input.value.trim();
        if (inputValue !== '') {
            const searchString = new RegExp(inputValue, 'i');
            getGoods(renderCard, goods => goods.filter(item => searchString.test(item.title)));
        } else {
            search.classList.add('error');
            setTimeout( () => {
                search.classList.remove('error');
            }, 2000)
        }

        input.value = '';
    }

    const getCookie = (name) => {
        let matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
      }

    const cookieQuery = (get) => {
        if (get) {
            //console.log(getCookie('goodsBasket')); 
            basket = JSON.parse(getCookie('goodsBasket'));
            checkCount();
        } else {
            document.cookie = `goodsBasket=${JSON.stringify(basket)}; max-age=86400e3`; //max-age=86400e3 - сутки
        }
    };

    const checkCount = () => {
        wishListCounter.textContent = wishList.length;
        cartCounter.textContent = Object.keys(basket).length;
    }

    const storageQuery = (get) => {
        if (get) {
            if (localStorage.getItem('wishList')) {
                const wishListStorage = JSON.parse(localStorage.getItem('wishList'));
                wishListStorage.forEach(id => wishList.push(id));
                checkCount();
            }
            else {
                localStorage.setItem('wishlist', JSON.stringify(wishList));
            }
        }

        checkCount();
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

        //console.log(wishList);
    }

    const addBasket = (id) => {
        if (basket[id]) {
            basket[id] += 1;
        } else {
            basket[id] = 1;
        }
        checkCount();
        cookieQuery();
    }

    const addGoods = (event) => {
        const targetGoods = event.target;

        if (target.classList.contains('card-add-wishlist')) {
            //targetGoods.getAttribute('data-goods-id');
            //targetGoods.dataset.goodsId
            toggleWishList(target.dataset.goodsId, targetGoods);
        }

        if (targetGoods.classList.contains('card-add-cart')) {
            //targetGoods.getAttribute('data-goods-id');
            //targetGoods.dataset.goodsId
            addBasket(target.dataset.goodsId);
        }
    }

    const showWishList = (event) => {
        event.preventDefault();
        getGoods(renderCard, goods => goods.filter(item => wishList.includes(item.id)));
    }

    // END FUNCTIONS 

    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    wishListBtn.addEventListener('click', showWishList);
    search.addEventListener('submit', searchGoods);

    category.addEventListener('click', chooseCategory);
    goodsWrapper.addEventListener('click', addGoods);

    getGoods(renderCard, randomSort);
    storageQuery(true);
    cookieQuery(true);
    
});