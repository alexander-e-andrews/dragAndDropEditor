editZone = document.getElementById("editField")
numberField = editZone.querySelector("[numberRows]")

numberField.addEventListener("change", (event)=>{

    flexyBox = lastSelected.querySelector("[flexBox]")
    
    numberOfRows = Number(flexyBox.attributes["size"].value)
    console.log(flexyBox.attributes)
    console.log(flexyBox.attributes["size"])
    newNumber  = Number(event.target.value)

    change = newNumber - numberOfRows
    console.log("CHange: "+ change)

    if (change > 0){
        for (let index = 0; index < change; index++) {
            console.log("Number" + index)
            subNode = document.createElement("div")
            subNode.setAttribute("aeaWebBuilder-NodeType", "node")
            subNode.innerHTML = "X"
            flexyBox.appendChild(subNode)
        }
    }

    flexyBox.setAttribute("size", newNumber)
})