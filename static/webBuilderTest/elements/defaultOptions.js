editZone = document.getElementById("editField")

function updateAttribute(rootID, targetID, isInnerHTML, attribute, value) {
    parent = document.getElementById(rootID)
    element = parent.getElementById(targetID)

    if (isInnerHTML) {
        element.innerHTML = value
    } else {
        element.setAttribute(attribute, value)
    }

}

function selectParent(event) {
    selectElement(lastSelected.parentNode)
}

function deleteElement(event){
    lastSelected.remove(lastSelected)
    
}