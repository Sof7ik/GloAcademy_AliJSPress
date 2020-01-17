document.addEventListener("DOMContentLoaded", () => {
  const searc = document.querySelector(".search");
  const cartBtm = document.getElementById("cart");
  const wishlistBtn = document.getElementById("wishlist");
  const cart = document.querySelector(".cart");
  const goodsWrapper = document.querySelector(".goods-wrapper");
  const category = document.querySelector(".category");

  const createCardGoods = (id, title, price, img) => {
    const card = document.createElement("div");

    card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3"';
    card.innerHTML = `<div class="card">
                                <div class="card-img-wrapper">
                                    <img class="card-img-top" src="${img}" alt="">
                                    <button class="card-add-wishlist
                                    data-goods-id="${id}"></button>
                                </div>
                                <div class="card-body justify-content-between">
                                    <a href="#" class="card-title">${title}</a>
                                    <div class="card-price">${price} ₽</div>
                                    <div>
                                       <button class="card-add-cart
                                       data-goods-id="${id}">
                                       Добавить в корзину</button>
                                    </div>
                                </div>
                            </div>`;
    return card;
  };

  const createSpinner = () => {
    const spinner = document.createElement("object");
    spinner.type = "image/svg+xml";
    spinner.data = "img/Gear-0.2s-200px.svg";
    return spinner;
  };

  const closeCart = evt => {
    const target = evt.target;
    const closeBtn = target.classList.contains("cart-close");
    let key = evt.key;
    if (key === "Escape" || target === cart || closeBtn) {
      cart.style.display = "";
      document.removeEventListener("keydown", closeCart);
    }
  };

  const openCart = evt => {
    let target = evt.target;
    if (target.tagName == "A") {
      evt.preventDefault();
    }
    cart.style.display = "flex";
    document.addEventListener("keydown", closeCart);
  };

  const renderCard = items => {
    goodsWrapper.textContent = "";
    items.forEach(({ id, title, price, imgMin }) => {
      goodsWrapper.append(createCardGoods(id, title, price, imgMin));
    });
  };

  const getGoods = (Creater, filter) => {
    goodsWrapper.textContent = "";
    goodsWrapper.append(createSpinner());
    setTimeout(() => {
      return fetch("db/db.json")
        .then(response => response.json())
        .then(filter)
        .then(Creater),
        console.log('Загрузка товара завершена');
    }, 2000);
  };

  const randomSort = item => item.sort(() => Math.random() - 0.5);

  const choiceCategory = evt => {
    event.preventDefault();
    const target = evt.target;

    if (target.classList.contains("category-item")) {
      const categoryHtml = target.dataset.category;
      getGoods(renderCard, goods =>
        goods.filter(item => item.category.includes(categoryHtml))
      );
    }
  };

  cartBtm.addEventListener("click", openCart);
  cart.addEventListener("click", closeCart);
  category.addEventListener("click", choiceCategory);

  getGoods(renderCard, randomSort);
});