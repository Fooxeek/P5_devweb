//On récupère l'id du canape correspondant dans le lien
const idProduct = new URL(window.location.href).searchParams.get("id");

const ENDPOINT = "http://127.0.0.1:3010/api/products/";

//fonction qui récupère le produit souhaité
const getInfoProduct = async (endpoint = ENDPOINT) => {
  let data = await (await fetch(endpoint + idProduct)).json();
  console.log("information du produit: ", data);
  return data;
};

//fonction qui injecte dans l'HTML les éléments du produit
const elementKanape = (infoCanape) => {
  //On récupére les élements via leur class / Id
  let canape_image = document.getElementsByClassName("item__img");
  let canape_title = document.getElementById("title");
  let canape_price = document.getElementById("price");
  let canape_description = document.getElementById("description");

  //On remplace dans le code HTML
  canape_title.innerHTML += infoCanape.name;
  canape_price.innerHTML += infoCanape.price;
  canape_description.innerHTML += infoCanape.description;

  //On initialise une variable text qui contiendra les informations de nos images
  let infoImage = `<img src=${infoCanape.imageUrl} alt=${infoCanape.altText}></img>`;

  //On précise bien l'index [0] car c'est un selecteur class et non Id donc stocké dans un Array
  canape_image[0].innerHTML = infoImage;

  //On initalise la constante qu'on utilisera pour stocker les couleurs de nos canapés
  let canape_colors = infoCanape.colors;
  let textColor = "";

  canape_colors.forEach((canape_colors, index) => {
    textColor =
      textColor + ` <option value="${canape_colors}">${canape_colors}</option>`;
  });

  //On remplace les couleurs dans le menu <option> du HTML
  let colorChoice = document.getElementById("colors");
  colorChoice.innerHTML = textColor;
};

const findItem = (Array, value) => {
  let bool = false;

  for (elem of Array) {
    if (elem.id == value) {
      return (bool = true);
    }
  }
  return bool;
};

const findColor = (Array, value, id) => {
  let bool = false;

  for (elem of Array) {
    if (elem.color == value && elem.id == id) {
      return (bool = true);
    }
  }
  return bool;
};

//Fonction qui ajoute dans le panier en fonction de la quantité le produit et sa couleur
const addCart = () => {
  //On définie la fonction d'ajout au panier qui répond au 'click' utilisateur sur le bouton 'Ajouter au panier'
  let addToCart = document.getElementById("addToCart");
  addToCart.addEventListener("click", function () {
    let name = document.getElementById("title").textContent;

    //On définit le format de l'objet qu'on souhaite avoir dans le panier
    let canape = {
      id: idProduct,
      color: colors.value,
      quantity: parseInt(quantity.value),
      name: name,
    };

    if (canape.quantity == 0) {
      console.log("Entrez une quantité");
    } else {
      console.log(canape);
    }

    //Condition, si la quantité est comprise entre 1 et 100 on ajoute le produit au panier ou alors on incrémente la quantité
    if (quantity.value >= 1 && quantity.value <= 100) {
      //si il y'a déjà un panier dans le local storage
      if (localStorage.getItem("panier")) {
        panierStorage = JSON.parse(localStorage.getItem("panier"));
        if (findItem(panierStorage, canape.id)) {
          if (findColor(panierStorage, canape.color, canape.id)) {
            panierStorage.forEach((elem) => {
              if (elem.id == canape.id && elem.color == canape.color) {
                elem.quantity += canape.quantity;
                localStorage.setItem("panier", JSON.stringify(panierStorage));
                alert("Article ajouté au panier");
              }
            });
          } else {
            panierStorage.push(canape);
            localStorage.setItem("panier", JSON.stringify(panierStorage));
            alert("Article ajouté au panier");
          }
        } else {
          panierStorage.push(canape);
          localStorage.setItem("panier", JSON.stringify(panierStorage));
        }
      } else {
        let panierStorage = [];
        panierStorage.push(canape);
        localStorage.setItem("panier", JSON.stringify(panierStorage));
        alert("Article ajouté au panier");
        // console.log('panier vide')
      }
    } else {
      alert("Veuillez choisir un nombre d'article compris entre 1 et 100");
    }
  });
};

//fonction qui charge la page
const loadproductPage = async () => {
  elementKanape(await getInfoProduct());
  addCart();
};

//Affichage du produit et de la fonction pour ajotué au panier
loadproductPage();
