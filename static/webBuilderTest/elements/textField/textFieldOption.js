//On a load, update the fields from the element, into the options
/* this.addEventListener('DOMContentLoaded', function () {

}) */
editZone = document.getElementById("editField")
textField = editZone.querySelector("[textField]")

textField.addEventListener('change', (event) => {

    spanField = lastSelected.querySelector("[textField]")
    //Not so good, allows insertion of actula HTML, its not escaped
    spanField.innerHTML = event.target.value
});