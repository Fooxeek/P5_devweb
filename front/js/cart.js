const cart = JSON.parse(localStorage.getItem('panier')) || []
const cartItems = document.getElementById("cart__items");


//On crée des collections pour les éléments nécessaire
let cartItemCollectionColor = [];
let cartItemCollectionQuantity = [];
let cartItemCollectionPrice = [];
let cartItemCollectionQuantityExact = [];

//Fonction createCart qui injecte dans l'HTML le panier

const createCart = (product, quantity, color) => {

  //On définit la valeur d'un attribut sur l'élément article créé
  let article = document.createElement('article');
  article.setAttribute('class', "cart__item");
  article.setAttribute('data-id', product._id);
  article.setAttribute('data-color', color);

  //On crée une div pour l'image et on l'a définit avec un attribut et son élément img
  let divCartItemImg = document.createElement('div');
  divCartItemImg.setAttribute('class', 'cart__item__img');
  let img = document.createElement('img');
  img.src = product.imageUrl;
  img.alt = product.altTxt;

  //On crée une div qui contiendra la decription et les settings pour la quantité et le bouton supprimé
  let divCartItemContent = document.createElement('div');
  divCartItemContent.setAttribute('class', "cart__item__content");

  //on crée une div pour la description du produit
  let divCartItemContentDescription = document.createElement('div');
  divCartItemContentDescription.setAttribute('class', "cart__item__content__description");

  let price = document.createElement('p');
  let h2 = document.createElement('h2');
  h2.innerHTML = product.name;
  let pColor = document.createElement('p');
  pColor.innerHTML = color;

  //on crée une div pour les settings
  let divCartItemContentSettings = document.createElement('div');
  divCartItemContentSettings.setAttribute('class', "cart__item__content__settings");

  //on crée une div pour la quantité
  let divCartItemContentSettingsQuantity = document.createElement('div');
  divCartItemContentSettingsQuantity.setAttribute('class', "cart__item__content__settings__quantity");
  price.innerHTML = `${product.price} €`

  //Création des élements pour la quantité
  let pQuantity = document.createElement('p');
  let inputQuantity = document.createElement('input');
  inputQuantity.setAttribute('type', 'number');
  inputQuantity.setAttribute('class', 'itemQuantity');
  inputQuantity.setAttribute('name', 'itemQuantity');
  inputQuantity.setAttribute('min', '1');
  inputQuantity.setAttribute('max', '100');
  inputQuantity.setAttribute('value', quantity);

  //On ajoute la fonction modifyQuantity()
  inputQuantity.addEventListener('change', (e) => modifyQuantity(e))
  divCartItemContentSettingsQuantity.appendChild(pQuantity);
  divCartItemContentSettingsQuantity.appendChild(inputQuantity);
  pQuantity.innerHTML = 'Quantité :'

  //on crée une div pour le bouton supprimer
  let divCartItemContentSettingsDelete = document.createElement('div');
  divCartItemContentSettingsDelete.setAttribute('class', "cart__item__content__settings__delete");
  let pDelete = document.createElement('p');
  pDelete.setAttribute('class', 'deleteItem');

  //On ajoute la fonction removeItem()
  pDelete.addEventListener('click', (e) => removeItem(e));
  pDelete.innerHTML = "Supprimer";


  //ajout des nœuds à la fin de la liste des enfants d'un nœud parent spécifié
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
  //Si le panier est vide
  if (cart.length === 0) {
    let article = document.getElementById('cart__items');
    article.innerHTML = 'Votre Panier est vide';
  } else {
    //Sinon pour tous les élements du panier
    for (let i = 0; i < cart.length; i++) {
      fetch("http://localhost:3000/api/products/" + cart[i].id)
        .then((canape) => {
          return canape.json();
        })
        //On crée le produit en y ajoutant les éléments modifications
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

  //Vérifier que la valeur est comprise entre 0 et 100
  if (elmt.value > 0 && elmt.value <= 100) {
    localStorage.setItem("panier", JSON.stringify(cart));
    window.location.reload();
  } else if (elmt.value > 100) {
    alert("La quantité saisie est incorrect");
  } else {
    if (confirm("Voulez-vous supprimer cet article du panier ?") == true) {

      //Si on confirme on supprime le produit du panier
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

  //variable de l'élément qui sera supprimé
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


//Fonction qui permettra d'obtenir la qantité total du panier
const getTotalQuantity = () => {

  let totalQty = 0
  for (let i = 0; i < cart.length; i++) {
    newTotal = parseInt(cart[i].quantity)
    totalQty += newTotal
    totalQuantity.innerHTML = totalQty;
  }
}

//Fonction qui permet d'obtenir le prix total du panier en fonction du nombre de canapé
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


//Vérifier les informations du nom / prénom
const validName = (inputName) => {
    let nameRegExp = new RegExp("^[a-zA-Z.'-]{2,}$", "i");
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

//Vérifier les informations de l'adresse
const validAddress = (inputAddress) => {
    let addressRegExp = new RegExp("^[0-9a-zA-Z]{2,}[a-z0-9 .'-]+[0-9a-zA-Z]{2,}$", "i");
    let testAddress = addressRegExp.test(inputAddress.value);
    let message = inputAddress.nextElementSibling;
    if (!testAddress) {
      message.textContent = "Adresse Non Valide";
      return false;
    } else {
      message.textContent = "";
      return true;
    }
}

//Vérifier les informations du mail
const validEmail = (inputEmail) => {
    let emailRegExp = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-zA-Z]{2,}$", "g");
    let testEmail = emailRegExp.test(inputEmail.value);
    let message = inputEmail.nextElementSibling;
    if (!testEmail) {
      message.textContent = "Mail Non Valide";
      return false;
    } else {
      message.textContent = "";
      return true;
    }
}


//On repère la balise du formulaire
let form = document.querySelector(".cart__order__form");


const validation = () => {

  //On essaye de modifier les valeurs avec nos coordonnées
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

  //on fetch l'api vers la page des commandes pour envoyer le formulaire et la commande
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





