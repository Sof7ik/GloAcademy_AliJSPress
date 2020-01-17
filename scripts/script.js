document.addEventListener('DOMContentLoaded', () => {

    const cartBtn = document.getElementById('cart'); //кнопка открытия корзины
    const wishListBtn = document.getElementById('wishlist');//кнопка открытия "Мои желания"
    const goodsWrapper = document.querySelector('.goods-wrapper'); // Враппер товаров
    const cart = document.querySelector('.cart'); //сама корзина
    const category = document.querySelector('.category'); //Див категорий

    //FUNCTIONS
    //функция вывода товаров на страницу (в будущем обработчик AJAX)
    const createGoodsCard = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        card.innerHTML = `<div class="card">
                            <div class="card-img-wrapper">
                                <img class="card-img-top" src="${img}" alt="">
                                <button class="card-add-wishlist" data-goods-id="${id}"></button>
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

    //Показ окна корзины
    const openCart = (event) => {
        event.preventDefault();
        cart.style.display = 'flex';
        document.addEventListener('keydown', closeCart);
    }

    //Скрытие окна корзины
    const closeCart = (event) => {
        if (event.target.classList.contains('cart') || event.target.classList.contains('cart-close') || (event.keyCode == 27 && event.code == 'Escape')) {
            cart.style.display = 'none';
            document.removeEventListener('keydown', closeCart);
        }
    }

    //Отмена перехода по ссылке на кнопку "Добавить в мои желания"
    const exampleFunc = (event) => {
        event.preventDefault();
    }

    const renderCard = (items) => {
        goodsWrapper.textContent = '';
        console.log('render card', items);
        items.forEach( ({ id, title, price, imgMin }) => {
            goodsWrapper.appendChild(createGoodsCard(id, title, price, imgMin));
        });
    }

    // const getGoods = (renderCard, filter) => {
    //     //запрос к БД
    //     fetch('db/db.json') //API
    //     .then( (response) => { return (response.json()); })
    //     .then(filter)
    //     .then(renderCard)
    // }

    // const getGoods = (renderCard, filter) => {
    //     //запрос к БД
    //     setTimeout ( () => {
    //         return fetch('db/db.json') //API
    //         .then( (response) => { return (response.json()); })
    //         .then(filter)
    //         .then(renderCard),
    //         document.getElementById('spinner').style.display = 'none',
    //         console.log('Загрузка товара завершена');
    //     }, 2000)
        
    // }

    const getGoods = (renderCard, filter) => {
        const request = new XMLHttpRequest;
        const url = 'db/db.json';

        request.open('POST', url, true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
        request.addEventListener('readystatechange', () => {
            if (request.readyState === 3) {
                console.log('Гружу!')
            }

            if(request.readyState === 4 && request.status === 200) {
                const res = JSON.parse(request.responseText);
                filter(res);
                renderCard(filteredItems);
            }
        })
                   
        request.send();
    }

    const randomSort = (item) => {
        console.log('random sort', item);
        return filteredItems = item.sort( () => Math.random() - 0.5);
    }

    const chooseCategory = (event) => {
        event.preventDefault();
        const target = event.target;

        if (target.classList.contains('category-item')) {
            //const cat = event.target.dataset.category;
            console.log('event.target.dataset.category: ', event.target.dataset.category);

            //console.log(cat);

            getGoods(renderCard,
                (goods) => {
                    goods.filter(
                        (item) => {
                            return filteredItems = item.category.includes(event.target.dataset.category)
                    })
                }
            );
         }
    };

    // END FUNCTIONS 

    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    wishListBtn.addEventListener('click', exampleFunc);

    getGoods(renderCard, randomSort)

    category.addEventListener('click', chooseCategory);
    
});