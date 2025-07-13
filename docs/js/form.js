function setHtml(id, value) {
    document.getElementById(id).innerHTML = value
}

function setText(id, value) {
    document.getElementById(id).innerText = value
}

function setAttribute(id, name, value) {
    document.getElementById(id).setAttribute(name, value)
}

function removeAttribute(id, name) {
    document.getElementById(id).removeAttribute(name)
}

function setStyle(id, name, value) {
    document.getElementById(id).style[name] = value
}