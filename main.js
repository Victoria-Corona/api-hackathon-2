const backPageButton = document.getElementById("backPage");
const backPageSearch = document.getElementById("backPageSearch");
const form = document.getElementById("form");
const nextPageButton = document.getElementById("nextPage");
const priceRange = document.getElementById("priceRange");
const returnSearchButton = document.getElementById("returnSearch");
const returnSearchAgain = document.getElementById("returnSearchAgain");
const selectCurrency = document.getElementById("currency");
const submitButton = document.getElementById("searchSelection");

const failedModalOverlay = document.querySelector("div.failed-network-handling-overlay");
const failedListings = document.querySelector("div.failed-handling-overlay");
const fieldSet = document.querySelector("fieldset");
const listings = document.querySelector("div.listing");
const listingsModalOverlay = document.querySelector("div.listing-modal-overlay");
const loading = document.querySelector("div.loading-files-overlay");
const main = document.querySelector("main");
const modalCurrencyOverlay = document.querySelector("div.modal-currency-overlay");

let userPriceRange = null;
let baseCurrency = null;
const currencyConverter = {
  "USD": "$",
  "CAD": "$",
  "EUR": "\u20AC",
  "JPY": "\u00A5",
  "CNY": "\u00A5"
}

form.addEventListener("submit", handleSubmitData);
backPageButton.addEventListener("click", unhidePage);
backPageSearch.addEventListener("click", hideSearchPage);
priceRange.addEventListener("change", getProductsPriceRange);
returnSearchButton.addEventListener("click", closeModal);
returnSearchAgain.addEventListener("click", returnSearch)
selectCurrency.addEventListener("change", getCurrencyValue);

//temp Visual Functions
function hidePage(){
  modalCurrencyOverlay.classList.add("hidden");
  main.classList.remove("hidden");
}

function unhidePage(){
  modalCurrencyOverlay.classList.remove("hidden");
  main.classList.add("hidden");
}

function closeModal(){
  failedListings.classList.add("hidden");
  main.classList.remove("hidden");
  fieldSet.disabled = false;
}

function hideSearchPage(){
  listingsModalOverlay.classList.add("hidden");
  main.classList.remove("hidden");
  fieldSet.disabled = false;

  while(listings.firstChild){
    listings.removeChild(listings.firstChild);
  }
}

function returnSearch(){
  failedModalOverlay.classList.add("hidden");
  modalCurrencyOverlay.classList.remove("hidden");
  fieldSet.disabled = false;
  priceRange.value = 0;
  main.classList.add("hidden");
}

//Currency GET request
function getCurrencyValue(){
  getCurrency(selectCurrency.value);
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
  baseCurrency = value
}

function handleGetCurrencyError(error) {
  failedModalOverlay.classList.remove("hidden");
}

//Products GET request
function getProducts(brand, product, tag) {
  $.ajax({
    method: "GET",
    url: "https://makeup-api.herokuapp.com/api/v1/products.json?brand=" + brand + "&product_type=" + product + "&product_tags=" + tag,
    beforeSend: function () {
      loading.classList.remove("hidden");
    },
    complete: function () {
      loading.classList.add("hidden");
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
  if(data.length === 0){
    failedListings.classList.remove("hidden");
  }

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
  console.error("error", error);
  failedModalOverlay.classList.remove("hidden");
}

function getProductsPriceRange(value){
  userPriceRange = priceRange.value;
}

function handleSubmitData(event){
  event.preventDefault();
  const formData = new FormData(form);
  const productName = formData.get("product");
  const productBrand = formData.get("brand");
  const productTag = formData.get("tag")
  getProducts(productBrand, productName, productTag);

  form.reset();
  priceRange.selectedIndex = "0";
  fieldSet.disabled = true;
}

function renderListings(data, brand, product){

  for (let index = 0; index < data.length; index++) {
    const containerDiv = document.createElement("div");
    const pProductBrand = document.createElement("p");
    const pDesc = document.createElement("p");
    const pPrice = document.createElement("p");
    const pTags = document.createElement("p");
    const pImage = document.createElement("img");
    const aTag = document.createElement("a");
    aTag.setAttribute("href", data[index].product_link);
    aTag.setAttribute("target", "_blank");

    pImage.src = data[index].image_link;
    pImage.addEventListener('error', function(){errorLoad(this)})
    pProductBrand.textContent = data[index].brand;
    aTag.textContent = data[index].name;

    pDesc.innerHTML = data[index].description;
    pDesc.classList.add("resize");
    pTags.textContent = data[index].tag_list;

    pPrice.textContent = currencyConverter[baseCurrency.base] + (data[index].price / baseCurrency.rates.USD).toFixed(2);

    containerDiv.append(pImage, pProductBrand, aTag, pPrice, pDesc, pTags)

    listingsModalOverlay.classList.remove("hidden");
    main.classList.add("hidden");
    listings.append(containerDiv);
  }

  if (data.length === 0) {
    failedListings.classList.remove("hidden");
  }

}

function errorLoad(image){
  image.src = "img/not_found.png";
}
