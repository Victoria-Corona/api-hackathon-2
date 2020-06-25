const selectCurrency = document.getElementById("currency");
const nextPageButton = document.getElementById("nextPage");
const backPageButton = document.getElementById("backPage");
const backPageSearch = document.getElementById("backPageSearch");
const priceRange = document.getElementById("priceRange");
const submitButton = document.getElementById("searchSelection");
const returnSearchButton = document.getElementById("returnSearch");
const returnSearchAgain = document.getElementById("returnSearchAgain");
const listings = document.querySelector("div.listing");
const listingsModalOverlay = document.querySelector("div.listing-modal-overlay");
const modalCurrencyOverlay = document.querySelector("div.modal-currency-overlay");
const failedModalOverlay = document.querySelector("div.failed-network-handling-overlay");
const failedListings = document.querySelector("div.failed-handling-overlay");
const fieldSet = document.querySelector("fieldset");
let baseCurrency = null
const currencyConverter = {
  "USD": "$",
  "CAD": "$",
  "EUR": "\u20AC",
  "JPY": "\u00A5",
  "CNY": "\u00A5"
}

nextPageButton.addEventListener("click", hidePage);
backPageButton.addEventListener("click", unhidePage);
backPageSearch.addEventListener("click", hideSearchPage);
selectCurrency.addEventListener("change", getCurrencyValue);
returnSearchButton.addEventListener("click", closeModal);
returnSearchAgain.addEventListener("click", returnSearch)
// priceRange.addEventListener("change", getProductsValue);


//temp Visual Function for Currency Select Menu
function hidePage(){
  modalCurrencyOverlay.classList.add("hidden");
}

function unhidePage(){
  modalCurrencyOverlay.classList.remove("hidden");
}

function closeModal(){
  failedListings.classList.add("hidden");
}

function hideSearchPage(){
  listingsModalOverlay.classList.add("hidden");
  fieldSet.disabled = false;

  while(listings.firstChild){
    listings.removeChild(listings.firstChild);
  }
  //AND DESTROY THE CHILDREN
}

function returnSearch(){
  failedModalOverlay.classList.add("hidden");
  modalCurrencyOverlay.classList.remove("hidden")
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
      success: handleGetCurrencySuccess,
      error: handleGetCurrencyError
    });
  }

function handleGetCurrencySuccess(value) {
  console.log("success", value);
  baseCurrency = value
}

function handleGetCurrencyError(error) {
  console.error("error", error);
  failedModalOverlay.classList.remove("hidden");
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
  if(data.length === 0){
    failedListings.classList.remove("hidden");
  }
  renderListings(data, brand, product)
}

function handleGetProductsError(error){
  console.error(error);
  failedModalOverlay.classList.remove("hidden");
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
  const productName = formData.get("product");
  const productBrand = formData.get("brand");
  console.log(productName, productBrand)
  getProducts(productBrand, productName);
// const productTag = formData.get("tag")
  form.reset();
  fieldSet.disabled = true;
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
    pDesc.classList.add("resize");

        // if (data[index].price <= value && data[index].price >= price){
        //
        //}
    pPrice.textContent = currencyConverter[baseCurrency.base] + (data[index].price / baseCurrency.rates.USD).toFixed(2); //converts a number into a string, rounding to a specified number of decimals

    containerDiv.append(pImage, pProductBrand, pName, pPrice, pDesc)

    listingsModalOverlay.classList.remove("hidden");
    listings.append(containerDiv);
  }
}
