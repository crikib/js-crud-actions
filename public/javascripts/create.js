document.getElementById("submit").onclick = function(evt) {
  evt.preventDefault(); //lets us handle it our way and not the browsers way

  const form = document.querySelector("form");
  const isValid = form.checkValidity();

  if (!isValid) {
    var err = {
      response: {
        data: [{
          field: "name",
          message: "Name is required"
        }]
      }
    }
    handleErrors(err);
    return;
  }
  //creating a new product from the form entry
  const formData = new FormData(document.querySelector("form"));

  axios.post("/api/products", {
    name: formData.get("name"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    description: formData.get("description"),
    color: formData.get("color"),
  }).then(processResults)
  .catch(handleErrors);

}


function processResults({ data }) {
  document.querySelector("form").reset();
  window.alert(`${data.name} added with id: ${data.id}`);
}


function handleErrors({response}) {

  const errorElements = document.getElementsByClassName("error");
  for (let i=0; i < errorElements.length; i++){
    errorElements[i].textContent = "";
  }


  const errors = response.data;
  for (let i = 0; o < errors.length; i++) {
    const {field, message} = errors[i];
    const element = document.getElementById(field)[0].nextElementSibling;
    element.textCotent = message;
  }
}