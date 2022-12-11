const idProduct = new URL(window.location.href).searchParams.get("id");
fetch('http://localhost:3000/api/products/'+idProduct).then(res => res.json())

.then(function(infoCanape) {
    let canape_image = document.getElementsByClassName("item__img");
    let canape_title = document.getElementById("title");
    let canape_price = document.getElementById("price");
    let canape_description = document.getElementById("description");

    canape_title.innerHTML+=infoCanape.name;
    canape_price.innerHTML+=infoCanape.price;
    canape_description.innerHTML+=infoCanape.description;

    let infoImage = `<img src=${infoCanape.imageUrl} alt=${infoCanape.altText}></img>`;
    canape_image[0].innerHTML=infoImage;
})