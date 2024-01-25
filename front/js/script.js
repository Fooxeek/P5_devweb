const ENDPOINT = "http://localhost:3010/api/products/";

//On récupère tous les produits de l'API
const getAllProducts = async (endpoint = ENDPOINT) => {
  let data = await (await fetch(endpoint)).json();
  console.log("nos produits: ", data);
  return data;
};

//On affiche les produits de l'API dans la balise avec l'id "items"
const displayProducts = (kanapes) => {
  let products = document.getElementById("items");
  kanapes.forEach((kanape) => {
    let kanapInformations = `
        <a href="./product.html?id=${kanape._id}">
            <article>
                <img src="${kanape.imageUrl}" alt="${kanape.altTxt}">
                <h3 class="productName">${kanape.name}</h3>
                <p class="productDescription">${kanape.description}</p>
            </article>
        </a>
        `;
    products.innerHTML += kanapInformations;
  });
};

//Affichage des informations sur la page d'accueil
const loadHomePage = async () => {
  displayProducts(await getAllProducts());
};

loadHomePage();
