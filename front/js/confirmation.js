function idPage() {
    let url = new URL(window.location.href);
    let idArticle = url.searchParams.get("orderId");
    if (idArticle != undefined) {
      document.querySelector("#orderId").textContent = idArticle;
    }
  }
  idPage();