const selectCurrency = document.getElementById("currency");


selectCurrency.addEventListener("change", getCurrencyValue);

function getCurrencyValue(){
  getCurrency(selectCurrency.value);
  console.log(selectCurrency.value)
}

function getCurrency(value){
  console.log(value);
    $.ajax({
      method: "GET",
      url: "https://api.exchangeratesapi.io/latest?base=" + value,
      success: this.handleGetCurrencySuccess,
      error: this.handleGetCurrencyError
    });
  }

function handleGetCurrencySuccess(price) {
  console.log("success", price);
}

function handleGetCurrencyError(error) {
  console.error("error", error);
}

// function setCurrency(currency) {
//   $.ajax({
//     method: "POST",
//     url: "https://api.exchangeratesapi.io/latest?base=" + currency
//   })
// }
