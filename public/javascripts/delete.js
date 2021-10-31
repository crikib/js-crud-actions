document.getElementById("delete").onclick = function(evt) {
  evt.preventDefault();

  const productId = document.getElementById("product-id").value;
  if (productId === "") {
    axios.get(`/api/products/${productId}`).then(addList);
  } else {
    axios.delete(`/api/products/${productId}`).then(processResult)
    .catch((err) => {
      if (err.response.status === 404){
        notFound();
      }
    });
  }
}

function processResult() {
  window.alert("Product deleted!");
}
