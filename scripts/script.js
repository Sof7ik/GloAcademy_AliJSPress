document.addEventListener('DOMContentLoaded', () => {

    const cartBtn = document.getElementById('cart'); //кнопка открытия корзины
    const wishListBtn = document.getElementById('wishlist');//кнопка открытия "Мои желания"
    const goodsWrapper = document.querySelector('.goods-wrapper'); // Враппер товаров
    const cart = document.querySelector('.cart'); //сама корзина

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
    }

    //Скрытие окна корзины
    const closeCart = (event) => {
        if (event.target.classList.contains('cart') || event.target.classList.contains('cart-close') || (event.ketCode == 27 && event.code == 'Escape')) {
            cart.style.display = 'none';
        }
    }

    //Отмена перехода по ссылке на кнопку "Добавить в мои желания"
    const exampleFunc = (event) => {
        event.preventDefault();
    }

    // END FUNCTIONS 

    let price = 123124;

    for (let i=1; i < 6; i++) {
        goodsWrapper.appendChild(createGoodsCard(i, 'AOKFLY BR 2205', 1517.76, 'img/temp/flamingo.jpg'));
    }

    document.addEventListener('keydown', closeCart)
    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    wishListBtn.addEventListener('click', exampleFunc);
    
});