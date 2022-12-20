const idProduct = new URL(window.location.href).searchParams.get("id");
/*fetch('http://localhost:3000/api/products/' + idProduct).then(res => res.json())

    .then(function (infoCanape) {
        let canape_image = document.getElementsByClassName("item__img");
        let canape_title = document.getElementById("title");
        let canape_price = document.getElementById("price");
        let canape_description = document.getElementById("description");

        canape_title.innerHTML += infoCanape.name;
        canape_price.innerHTML += infoCanape.price;
        canape_description.innerHTML += infoCanape.description;

        let infoImage = `<img src=${infoCanape.imageUrl} alt=${infoCanape.altText}></img>`;
        canape_image[0].innerHTML = infoImage;

        let canape_colors = infoCanape.colors;
        let textColor = "";

        canape_colors.forEach((canape_colors, index) => {
            textColor = textColor + ` <option value="${canape_colors}">${canape_colors}</option>`
        })

        let colorChoice = document.getElementById("colors");
        colorChoice.innerHTML = textColor;
    })



let addToCart = document.getElementById("addToCart");
addToCart.addEventListener('click', function () {

    let name = document.getElementById('title').textContent;

    let canape = {
        id: idProduct,
        color: colors.value,
        quantity: parseInt(quantity.value),
        name: name,
    };

    if(canape.quantity == 0 ){
        console.log("Entrez une quantité");
    }else {
        console.log(canape);
    }


    if (quantity.value >= 1 && quantity.value <= 100) {
 
        if (localStorage.getItem('panier')) {
            panierStorage = JSON.parse(localStorage.getItem('panier'));
            if (findItem(panierStorage, canape.id)) {
                if (findColor(panierStorage, canape.color, canape.id)) {
                    panierStorage.forEach(elem => {
                        if (elem.id == canape.id && elem.color == canape.color) {
                            elem.quantity += canape.quantity
                            localStorage.setItem('panier', JSON.stringify(panierStorage));
                            alert('Article ajouté au panier');
                        }
                    })
                } else {
                    panierStorage.push(canape);
                    localStorage.setItem('panier', JSON.stringify(panierStorage));
                    alert('Article ajouté au panier');
                }
            } else {
                panierStorage.push(canape);
                localStorage.setItem('panier', JSON.stringify(panierStorage));
            }
        } else {
            let panierStorage = [];
            panierStorage.push(canape);
            localStorage.setItem('panier', JSON.stringify(panierStorage));
            alert('Article ajouté au panier');
            // console.log('panier vide')
        }
    } else {
        alert("Veuillez choisir un nombre d'article compris entre 1 et 100")
    }
})*/

function findItem(Array, value) {
    let bool = false

    for (elem of Array) {
        if (elem.id == value) {
            return bool = true
        }
    }
    return bool
};

function findColor(Array, value, id) {
    let bool = false

    for (elem of Array) {
        if (elem.color == value && elem.id == id) {
            return bool = true
        }
    }
    return bool
};

const ENDPOINT = "http://localhost:3000/api/products/";

const getInfoProduct = async (endpoint = ENDPOINT) => {
    let data = await (await fetch(endpoint+idProduct)).json();
    console.log("information du produit: ", data);
    return data;
}

const elementKanape = (infoCanape) => {
    let canape_image = document.getElementsByClassName("item__img");
    let canape_title = document.getElementById("title");
    let canape_price = document.getElementById("price");
    let canape_description = document.getElementById("description");

    canape_title.innerHTML+=infoCanape.name;
    canape_price.innerHTML+=infoCanape.price;
    canape_description.innerHTML+=infoCanape.description;

    let infoImage = `<img src=${infoCanape.imageUrl} alt=${infoCanape.altText}></img>`;
    canape_image[0].innerHTML=infoImage;

    let canape_colors = infoCanape.colors;
    let textColor = "";

    canape_colors.forEach((canape_colors, index) => {
        textColor = textColor + ` <option value="${canape_colors}">${canape_colors}</option>`
    })

    let colorChoice = document.getElementById("colors");
    colorChoice.innerHTML = textColor;
}


const loadproductPage = async () => {
    elementKanape(await getInfoProduct());
}

loadproductPage()