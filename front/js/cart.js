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
  inputQuantity.addEventListener('change', (e) => modifyQuantity(e))
  divCartItemContentSettingsQuantity.appendChild(pQuantity);
  divCartItemContentSettingsQuantity.appendChild(inputQuantity);
  pQuantity.innerHTML = 'Quantité :'

  let divCartItemContentSettingsDelete = document.createElement('div');
  divCartItemContentSettingsDelete.setAttribute('class', "cart__item__content__settings__delete");
  let pDelete = document.createElement('p');
  pDelete.setAttribute('class', 'deleteItem');
  pDelete.addEventListener('click', (e) => removeItem(e));
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
        .then(() => {
          getTotalQuantity()
          displayPrice(cartItemCollectionPrice)
        })
    }
  }
}

//Fonction modifyQuantity qui cherche quel input est modifié et qui compare pour modifier la quantitée correspondante
const modifyQuantity = (e) => {
  e.preventDefault();
  let elmt = e.target;
  let idItem = elmt.closest("article").dataset.id;
  let colorItem = elmt.closest(".cart__item").dataset.color;
  let produit = cart.find((e) => e.id === idItem && e.color === colorItem);
  produit.quantity = elmt.value;
  if (elmt.value > 0 && elmt.value <= 100) {
    localStorage.setItem("panier", JSON.stringify(cart));
    window.location.reload();
  } else if (elmt.value > 100) {
    alert("La quantité saisie est incorrect");
  } else {
    if (confirm("Voulez-vous supprimer cet article du panier ?") == true) {

      let itemToRemoveId = idItem;
      let itemToRemoveColor = colorItem;

      newCart = cart.filter(e => e.id !== itemToRemoveId || e.color !== itemToRemoveColor);

      localStorage.setItem("panier", JSON.stringify(newCart));
      window.location.reload();
    }
  }

}


//Fonction removeItem qui supprime l'élément souhaité
const removeItem = (e) => {

  let elmt = e.target;
  let idItem = elmt.closest(".cart__item").dataset.id;
  let colorItem = elmt.closest(".cart__item").dataset.color;

  let elementToRemove = document.querySelector(
    `article[data-id="${idItem}"][data-color="${colorItem}"]`
  );
  document.querySelector("#cart__items").removeChild(elementToRemove);

  newCart = cart.filter(item => item.id !== idItem || (item.id === idItem && item.color !== colorItem));
  localStorage.setItem("panier", JSON.stringify(newCart));

  //elmt.remove();
  window.location.reload();
}

let totalQuantity = document.getElementById('totalQuantity');
let totalPrice = document.getElementById('totalPrice');

const getTotalQuantity = () => {

  let totalQty = 0
  for (let i = 0; i < cart.length; i++) {
    newTotal = parseInt(cart[i].quantity)
    totalQty += newTotal
    totalQuantity.innerHTML = totalQty;
  }
}

const displayPrice = (array) => {
  let getTotalPrice = 0
  let newCart = JSON.parse(localStorage.getItem('panier'));
  for (let i = 0; i < array.length; i++) {
    getTotalPrice += (parseInt(array[i]) * (newCart[i].quantity));
  }
  totalPrice.innerHTML = getTotalPrice
}

displayProducts();


/* Validation du formulaire */

const validName = (inputName) => {
    let nameRegExp = new RegExp("^[a-zA-Z]{2,}[a-z .'-]+$", "i");
    let testName = nameRegExp.test(inputName.value);
    let message = inputName.nextElementSibling;
    if (!testName) {
      message.textContent = "Renseignement Non Valide";
      return false;
    } else {
      message.textContent = "";
      return true;
    }
}

const validAddress = (inputAddress) => {
    let addressRegExp = new RegExp("^[a-z0-9 .'-]+$", "i");
    let testAddress = addressRegExp.test(inputAddress.value);
    let message = inputAddress.nextElementSibling;
    if (!testAddress) {
      message.textContent = "Renseignement Non Valide";
      return false;
    } else {
      message.textContent = "";
      return true;
    }
}

const validEmail = (inputEmail) => {
    let emailRegExp = new RegExp( "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$", "g");
    let testEmail = emailRegExp.test(inputEmail.value);
    let message = inputEmail.nextElementSibling;
    if (!testEmail) {
      message.textContent = "Adresse Non Valide";
      return false;
    } else {
      message.textContent = "";
      return true;
    }
}


let form = document.querySelector(".cart__order__form");


const validation = () => {
  try {
    form.email.addEventListener("change", function (e) {
      validEmail(e.target);
    });
    form.firstName.addEventListener("change", function (e) {
      validName(e.target);
    });
    form.lastName.addEventListener("change", function (e) {
      validName(e.target);
    });
    form.address.addEventListener("change", function (e) {
      validAddress(e.target);
    });
    form.city.addEventListener("change", function (e) {
      validName(e.target);
    });
    commander();
  } catch (error) {
    console.log(error);
  }
};
validation();

//Fonction pour envoyer la requete post avec les infos contacts à L'API
const postApi = (command) => {
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      'Accept': "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  })
    .then(res => res.json())
    .then(value => value.orderId)
    .then(function (orderId) {
      window.location.href = "confirmation.html?" + `orderId=${orderId}`;
      localStorage.clear();
      return orderId;
    })
    .catch(function (error) {
      console.log("Request failed", error);
    });
}



//Validation avec Bouton Commander
function commander () {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log(form.firstName.value);
    if (validName(form.firstName) && validName(form.lastName) && validName(form.city) && validAddress(form.address) && validEmail(form.email)) {
      let contact = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        city: form.city.value,
        address: form.address.value,
        email: form.email.value,
      };
      let products = [];
      for (let article of cart) {
        products.push(article.id);
      }
      let command = { contact: contact, products: products };
      postApi(command);
    }
  });
}





