const cart = JSON.parse(localStorage.getItem('panier')) || []
const cartItems = document.getElementById("cart__items");

let cartItemCollectionColor = [];
let cartItemCollectionQuantity = [];
let cartItemCollectionPrice = [];
let cartItemCollectionQuantityExact = [];

//Fonction createCart qui injecte dans l'HTML le panier

const createCart = (product, quantity, color) => {
    let article = document.createElement('article');
    article.setAttribute('class', "cart__item");
    article.setAttribute('data-id', product._id);
    article.setAttribute('data-color', color);

    let divCartItemImg = document.createElement('div');
    divCartItemImg.setAttribute('class', 'cart__item__img');
    let img = document.createElement('img');
    img.src = product.imageUrl;
    img.alt = product.altTxt;

    let divCartItemContent = document.createElement('div');
    divCartItemContent.setAttribute('class', "cart__item__content");

    let divCartItemContentDescription = document.createElement('div');
    divCartItemContentDescription.setAttribute('class', "cart__item__content__description");

    let price = document.createElement('p');
    let h2 = document.createElement('h2');
    h2.innerHTML = product.name;
    let pColor = document.createElement('p');
    pColor.innerHTML = color;
    let divCartItemContentSettings = document.createElement('div');
    divCartItemContentSettings.setAttribute('class', "cart__item__content__settings");
    let divCartItemContentSettingsQuantity = document.createElement('div');
    divCartItemContentSettingsQuantity.setAttribute('class', "cart__item__content__settings__quantity");
    price.innerHTML = `${product.price} €`

    let pQuantity = document.createElement('p');
    let inputQuantity = document.createElement('input');
    inputQuantity.setAttribute('type', 'number');
    inputQuantity.setAttribute('class', 'itemQuantity');
    inputQuantity.setAttribute('name', 'itemQuantity');
    inputQuantity.setAttribute('min', '1');
    inputQuantity.setAttribute('max', '100');
    inputQuantity.setAttribute('value', quantity);
    divCartItemContentSettingsQuantity.appendChild(pQuantity);
    divCartItemContentSettingsQuantity.appendChild(inputQuantity);
    pQuantity.innerHTML = 'Quantité :'

    let divCartItemContentSettingsDelete = document.createElement('div');
    divCartItemContentSettingsDelete.setAttribute('class', "cart__item__content__settings__delete");
    let pDelete = document.createElement('p');
    pDelete.setAttribute('class', 'deleteItem');
    pDelete.innerHTML = "Supprimer";

    divCartItemContentSettingsDelete.appendChild(pDelete);
    divCartItemContentSettings.appendChild(divCartItemContentSettingsQuantity);
    divCartItemContentSettings.appendChild(divCartItemContentSettingsDelete);
    divCartItemContentDescription.appendChild(h2);
    divCartItemContentDescription.appendChild(pColor);
    divCartItemContentDescription.appendChild(price);
    divCartItemContent.appendChild(divCartItemContentDescription);
    divCartItemContent.appendChild(divCartItemContentSettings);
    divCartItemImg.appendChild(img);
    article.appendChild(divCartItemImg);
    article.appendChild(divCartItemContent);
    cartItems.appendChild(article);

    //Récuperation de données dans un objet pour réutiliser dans boucleForPrice et boucleForQuantity
    let modifications = {
        suppression: pDelete,
        modifyQuantity: inputQuantity,
        quantityExact: inputQuantity.value,
        price: product.price
    }
    return modifications;
};

//fonction qui affiche le panier

const displayProducts = () => {
    if (cart.length === 0) {
        let article = document.getElementById('cart__items');
        article.innerHTML = 'Votre Panier est vide';
    } else {
        for (let i = 0; i < cart.length; i++) {
            fetch("http://localhost:3000/api/products/" + cart[i].id)
                .then((canape) => {
                    return canape.json();
                })
                .then((product) => {
                    const modifications = createCart(product, cart[i].quantity, cart[i].color,);
                    cartItemCollectionColor.push(modifications.suppression);
                    cartItemCollectionQuantity.push(modifications.modifyQuantity);
                    cartItemCollectionPrice.push(modifications.price)
                    cartItemCollectionQuantityExact.push(modifications.quantityExact);
                })
        }
    }
}

//Fonction verifyCart qui compare l'id et la couleur de tous les items du panier pour supprimer le bon élément

const verifyCart = () => {

}

//Fonction modifyQuantity qui cherche quel input est modifié et qui compare pour modifier la quantitée correspondante
const modifyQuantity = () => {

}

//Fonction removeCart qui supprime l'élément souhaité
const removeCart = () => {

}


displayProducts()

