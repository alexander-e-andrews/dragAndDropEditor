let lastSelected = null

let pathStart = "elements/"

let elementMap = new Map()
elementMap.set("Three Column Element", "threeColumnSplit")
elementMap.set("Text Element", "textField")
elementMap.set("Flex List", "flexBox")

//A nodes id= "type+Count"
//a nodes type="type"

//Map of maps or array, that dictate the class name
//First search is by type, second by typeID
let itemsList = new Map()

function htmlPath(name) {
    return pathStart + name + "/" + name + ".html"
}

function optionsPath(name) {
    return pathStart + name + "/" + name + "Option.html"
}

function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.id)
}

function allowDrop(event) {
    event.preventDefault()
}

function onDrop(event) {
    event.preventDefault()
    var data = event.dataTransfer.getData("text")
    var child = document.createElement('div')

    getElement(data, event.target)

}

function makeHttpObject() {
    try { return new XMLHttpRequest(); }
    catch (error) { }
    try { return new ActiveXObject("Msxml2.XMLHTTP"); }
    catch (error) { }
    try { return new ActiveXObject("Microsoft.XMLHTTP"); }
    catch (error) { }

    throw new Error("Could not create HTTP request object.");
}

function outline(event) {
    var element = event.toElement
    element.classList.add("outline")

    var parentNode = element.parentNode
    parentNode.classList.add("outlineRoot")
}

function removeOutline(event) {
    var element = event.target
    element.classList.remove("outline")

    var parentNode = element.parentNode
    parentNode.classList.remove("outlineRoot")
}

//Given an element, travels up to its rooted parent
//So on a text node, travles to the ID div that contains it
//On a layout div, travels up to it host, then to the ID div
function travelUp(element) {
    while (element.attributes["aeaWebBuilder-NodeType"].value == "node") {
        element = element.parentNode
    }

    if (element.attributes["aeaWebBuilder-NodeType"].value == "leaf") {
        console.log("Reached the leaf side, parent should be a div with id informatuion")
    }

    //We expect all leafs to have a parent node, this will probably break when traveling to the root of the page
    //NEED TO FIX
    return element.parentNode
}

//Selects an elements IDNode root when given here
function selectElement(element){
    element = travelUp(element)

    element.classList.add("selected")

    lastSelected = element

    updateOptionsField(element)
}

//Select an element by clicking on it
function selectElementClick(event) {
    if (lastSelected) {
        lastSelected.classList.remove("selected")
    }

    var clicked = event.target
    selectElement(clicked)
}

function updateOptionsField(element) {
    optionsBox = document.getElementById("editField")

    let optionsFile = optionsPath(element.attributes["type"].value)

    var request = makeHttpObject()
    request.open("GET", optionsFile, null)

    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            var child = document.createElement("div")
            child.innerHTML = request.responseText

            //Adds Another Element to the set
            //target.appendChild(child)

            //Replaces the inner elementas
            optionsBox.innerHTML = request.responseText
            nodeScriptReplace(optionsBox)
            return request.responseText
        }
    }

    request.send(null)
}

function getElement(elementType, target) {
    var elementPath = htmlPath(elementType)
    var request = makeHttpObject()
    request.open("GET", elementPath, true)

    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            var temp = document.createElement("div")
            var child = document.createElement("div")
            child.setAttribute("type", elementType)

            elementID = newElementID(elementType)

            addElementIDToList(elementType, elementID)

            child.setAttribute("id", elementID)

            child.innerHTML = request.responseText.trim()
            //Adds Another Element to the set
            //target.appendChild(child)
            //Replaces the inner elementas
            //target.innerHTML = request.responseText
            temp.appendChild(child)

            target.innerHTML = temp.innerHTML
            nodeScriptReplace(target)
            return
        }
    }

    request.send(null)
}

function addElementTypesOnLoad() {
    let list = document.getElementById("ElementSelectList")

    elementMap.forEach(function (value, key, ) {
        //console.log(value, key)
        var li = document.createElement("li")
        li.setAttribute("id", value)
        li.setAttribute("draggable", "true")
        li.setAttribute("ondragstart", "drag(event)")

        var name = document.createElement("span")
        name.innerText = key
        li.appendChild(name)
        list.appendChild(li)
    })
}

function addDefaultOptionsBoxOnLoad() {
    let optionsBox = document.getElementById("optionsBox")

    var request = makeHttpObject()

    request.open("GET", "elements/defaultOptions.html", true)
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            optionsBox.innerHTML = request.responseText.trim()
            nodeScriptReplace(optionsBox)
        }
    }
    request.send(null)
}

//When the page loads, grab the defualt options and the list of attributes
document.addEventListener('DOMContentLoaded', function () {
    addElementTypesOnLoad()
    addDefaultOptionsBoxOnLoad()
}, false)

//DOes not handle if an element of the same type has no been created
function addElementIDToList(elementType, elementID) {
    //console.log(itemsList.get(elementType))
    list = itemsList.get(elementType)
    list.push(elementID)
    itemsList.set(elementType, list)
    //console.log(itemsList.get(elementType))
}

//Handles if a elment of same type has not been created
function newElementID(elementType) {
    var list = itemsList.get(elementType)
    number = 0

    console.log(list)
    if (list == undefined) {
        list = []
        itemsList.set(elementType, list)
    } else {
        lastItem = list[list.length - 1]

        console.log(lastItem)
        var matches = lastItem.match(/\d+$/)

        if (matches) {
            number = Number(matches[0]) + 1;
        }
    }

    return elementType + number
}


//tkaen from https://stackoverflow.com/a/20584396
function nodeScriptReplace(node) {
    if (nodeScriptIs(node) === true) {
        node.parentNode.replaceChild(nodeScriptClone(node), node);
    }
    else {
        var i = 0;
        var children = node.childNodes;
        while (i < children.length) {
            nodeScriptReplace(children[i++]);
        }
    }

    return node;
}


function nodeScriptIs(node) {
    return node.tagName === 'SCRIPT';
}
function nodeScriptClone(node) {
    var script = document.createElement("script");
    script.text = node.innerHTML;
    for (var i = node.attributes.length - 1; i >= 0; i--) {
        script.setAttribute(node.attributes[i].name, node.attributes[i].value);
    }
    return script;
}