fetch('http://localhost:3000/api/products')
.then(res => res.json())

.then(function (listKanap) {
    
    let products = document.getElementById("items");

    let index = 0

    for (index; index < listKanap.length; index++) {
        let kanape = listKanap[index];
        
        let kanapInformations = `
        <a href="./product.html?id=${kanape._id}">
            <article>
                <img src="${kanape.imageUrl}" alt="${kanape.altTxt}">
                <h3 class="productName">${kanape.name}</h3>
                <p class="productDescription">${kanape.description}</p>
            </article>
        </a>
        `;

        products.innerHTML+=kanapInformations;
    }
})

.catch(function(err) {
    console.error(err);
});