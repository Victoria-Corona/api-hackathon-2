const selectCurrency = document.getElementById("currency");
const nextPageButton = document.getElementById("nextPage");
const backPageButton = document.getElementById("backPage");
const backPageSearch = document.getElementById("backPageSearch");
const listings = document.querySelector("div.listing");
const listingsModalOverlay = document.querySelector("div.listing-modal-overlay");
const modalCurrencyOverlay = document.querySelector("div.modal-currency-overlay");
const priceRange = document.getElementById("priceRange");
const submitButton = document.getElementById("searchSelection");

nextPageButton.addEventListener("click", hidePage);
backPageButton.addEventListener("click", unhidePage);
listingsModalOverlay.addEventListener("click", hideSearchPage);
selectCurrency.addEventListener("change", getCurrencyValue);

// priceRange.addEventListener("change", getProductsValue);


//temp Visual Function for Currency Select Menu
function hidePage(){
  modalCurrencyOverlay.classList.add("hidden");
}

function unhidePage(){
  modalCurrencyOverlay.classList.remove("hidden");
}

function hideSearchPage(){
  listingsModalOverlay.classList.add("hidden");
}

//Currency GET request
function getCurrencyValue(){
  getCurrency(selectCurrency.value);
  console.log(selectCurrency.value)
}

function getCurrency(exchange){

    $.ajax({
      method: "GET",
      url: "https://api.exchangeratesapi.io/latest?base=" + exchange,
      success: this.handleGetCurrencySuccess,
      error: this.handleGetCurrencyError
    });
  }

function handleGetCurrencySuccess(value) {
  console.log("success", value);
  convertCurrency(value);
}

function handleGetCurrencyError(error) {
  console.error("error", error);
}

//Products GET request
function getProducts(brand, product) {
  console.log(brand, product);
  $.ajax({
    method: "GET",
    url: "http://makeup-api.herokuapp.com/api/v1/products.json?brand=" + brand + "&product_type=" + product,
    success: handleGetProductsSuccess,
    error: handleGetProductsError
  })
}


function handleGetProductsSuccess(data, brand, product){
  console.log("success", data);
  renderListings(data, brand, product)
}

function handleGetProductsError(error){
  console.error(error);
}

// function getProductsValue(){
//   getProducts(priceRange.value);
//   console.log(priceRange.value);
// }

const form = document.getElementById("form");

form.addEventListener("submit", handleSubmitData);

function handleSubmitData(event){
event.preventDefault();
  const formData = new FormData(form);
const productBrand = formData.get("brand");
const productName = formData.get("product");
console.log(productName, productBrand)
  getProducts(productBrand, productName);
// const productTag = formData.get("tag")
  form.reset();
}

// if data[index].price <= value && data[index].prince >= price
//if option value 1 is picked, run a condition to check if
//price is within hard coded numbers
//else if else if else if else if else if

function renderListings(data, brand, product){
  for (let index = 0; index < data.length; index++) {

    const containerDiv = document.createElement("div");
    const pProductBrand = document.createElement("p");
    const pDesc = document.createElement("p");
    const pName = document.createElement("p");
    const pPrice = document.createElement("p");
    const pTags = document.createElement("p");
    const pImage = document.createElement("img");

    pImage.src = data[index].image_link;
    pProductBrand.textContent = data[index].brand;
    pName.textContent = data[index].name;
    pDesc.textContent = data[index].description;
    pPrice.textContent = "$" + data[index].price;
    // pPrice.textContent = convertCurrency(data);
    // pPrice.textContent = "$" + (data[index].price * selectCurrency.value);

    containerDiv.append(pImage, pProductBrand, pName, pPrice, pDesc)


    listingsModalOverlay.classList.remove("hidden");
    listings.append(containerDiv);

    // if (data[index].price <= value && data[index].price >= price)
  }
}



// function convertCurrency(exchange){
//   console.log("test", exchange)

//   var baseCurrency = exchange.base

//   if (baseCurrency === "USD"){
//     console.log("$ okay", exchange.rates.USD);

//   } else if (baseCurrency === "EUR"){
//     console.log("€ okay europe", exchange.rates.USD);
//   } else if (baseCurrency === "CAD"){
//     console.log("okay Canada $", exchange.rates.USD);
//   } else if (baseCurrency === "JPY"){
//     console.log("¥ hi japan", exchange.rates.USD);
//   } else if (baseCurrency === "CNY"){
//     console.log("¥ SUP CHINA", exchange.rates.USD);
//   }
// }
