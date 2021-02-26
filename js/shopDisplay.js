const googleAPIs = require('../places');
const { post } = require("../../../routes");
const button = document.querySelector('.submit');
const input = document.querySelector('.postCodeInput');
const value = document.querySelector('.testing'); 


button.addEventListener('click', updateValue);


function setVal(postcode) {
    try {
        const data = googleAPIs.getCoffeeShops(postcode);
        value.innerHTML = data[0].name;
    } catch {
        console.log("Error setting val");
    }
}

function updateValue() {
    

}