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
const loading = document.querySelector("div.loading-files-overlay");
let userPriceRange = null;
let baseCurrency = null;
const currencyConverter = {
  "USD": "$",
  "CAD": "$",
  "EUR": "\u20AC",
  "JPY": "\u00A5",
  "CNY": "\u00A5"
}

// nextPageButton.addEventListener("click", hidePage);
backPageButton.addEventListener("click", unhidePage);
backPageSearch.addEventListener("click", hideSearchPage);
returnSearchButton.addEventListener("click", closeModal);
returnSearchAgain.addEventListener("click", returnSearch)
priceRange.addEventListener("change", getProductsPriceRange);
selectCurrency.addEventListener("change", getCurrencyValue);

//temp Visual Function for Currency Select Menu
function hidePage(){
  modalCurrencyOverlay.classList.add("hidden");
}

function unhidePage(){
  modalCurrencyOverlay.classList.remove("hidden");
}

function closeModal(){
  failedListings.classList.add("hidden");
  fieldSet.disabled = false;
}

function hideSearchPage(){
  listingsModalOverlay.classList.add("hidden");
  fieldSet.disabled = false;

  while(listings.firstChild){
    listings.removeChild(listings.firstChild);
  }
}

function returnSearch(){
  failedModalOverlay.classList.add("hidden");
  modalCurrencyOverlay.classList.remove("hidden")
  fieldSet.disabled = false;
  priceRange.value = 0;
}

//Currency GET request
function getCurrencyValue(){
  getCurrency(selectCurrency.value);
  console.log(selectCurrency.value)
  nextPageButton.addEventListener("click", hidePage);
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
function getProducts(brand, product, tag) {
  console.log(brand, product, tag);
  $.ajax({
    method: "GET",
    url: "http://makeup-api.herokuapp.com/api/v1/products.json?brand=" + brand + "&product_type=" + product + "&product_tags=" + tag,
    timeout: 2000,
    beforeSend: function () {
      loading.classList.remove("hidden");
      console.log("Loading");
    },
    complete: function () {
      loading.classList.add("hidden");
      console.log("done");
    },
    success: handleGetProductsSuccess,
    error: handleGetProductsError
  })
}

function getPriceRange() {
  var ranges = {
    '1': {
      max: 10,
      min: 0
    },
    '2': {
      max: 20,
      min: 11
    },
    '3': {
      max: 30,
      min: 21
    },
    '4': {
      max: Infinity,
      min: 31
    }
  }

  if(userPriceRange) {
    return ranges[userPriceRange]
  } else {
    return null
  }
}

function handleGetProductsSuccess(data, brand){
  console.log("success", data);
  if(data.length === 0){
    failedListings.classList.remove("hidden");
  }
  console.log(data)

  const priceRange = getPriceRange()
  if(!priceRange) {
    renderListings(data, brand, product)
  } else {
    const newData = []
    for(let i = 0; i < data.length; i++) {
      const price = Number(data[i].price)
      if(price <= priceRange.max && price >= priceRange.min) {
        newData.push(data[i])
      }
    }
    renderListings(newData, brand, product)
  }
}

function handleGetProductsError(error){
  console.error("bruh", error);
  failedModalOverlay.classList.remove("hidden");
}

function getProductsPriceRange(value){
  userPriceRange = priceRange.value;
  console.log(priceRange.value);
  console.log(userPriceRange);
}

const form = document.getElementById("form");

form.addEventListener("submit", handleSubmitData);

function handleSubmitData(event){
  event.preventDefault();
  const formData = new FormData(form);
  const productName = formData.get("product");
  const productBrand = formData.get("brand");
  const productTag = formData.get("tag")
  console.log(productName, productBrand, productTag)
  getProducts(productBrand, productName, productTag);

  form.reset();
  priceRange.selectedIndex = "0";
  fieldSet.disabled = true;
}

function renderListings(data, brand, product){
console.log(data)
  for (let index = 0; index < data.length; index++) {
    const containerDiv = document.createElement("div");
    const pProductBrand = document.createElement("p");
    const pDesc = document.createElement("p");
    const pPrice = document.createElement("p");
    const pTags = document.createElement("p");
    const pImage = document.createElement("img");
    const aTag = document.createElement("a");
    aTag.setAttribute("href", data[index].product_link);

    pImage.src = data[index].image_link;
    pProductBrand.textContent = data[index].brand;
    aTag.textContent = data[index].name;


    pDesc.textContent = data[index].description;
    pDesc.classList.add("resize");
    pTags.textContent = data[index].tag_list;

    pPrice.textContent = currencyConverter[baseCurrency.base] + (data[index].price / baseCurrency.rates.USD).toFixed(2); //converts a number into a string, rounding to a specified number of decimals

    containerDiv.append(pImage, pProductBrand, aTag, pPrice, pDesc, pTags)

    listingsModalOverlay.classList.remove("hidden");
    listings.append(containerDiv);
  }
  if (data.length === 0) {
    failedListings.classList.remove("hidden");
  }
}
