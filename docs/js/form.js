function addElement(id, tag) {
    const newElement = document.createElement(tag)

    document.getElementById(id).appendChild(newElement)
    return newElement

}

function addTextInput(id, elementId, value) {
    const newElement = document.createElement("input")
    newElement.setAttribute("id", elementId)
    value && (newElement.value = value)

    document.getElementById(id).appendChild(newElement)
    return newElement
}

function addText(id, tag, text) {
    const newElement = document.createElement(tag)
    newElement.appendChild(document.createTextNode(text))

    document.getElementById(id).appendChild(newElement)
    return newElement
}

function addButton(id, text, onClick) {
    const newElement = document.createElement("input")
    newElement.setAttribute("type", "button")
    newElement.value = text
    newElement.onclick = onClick

    document.getElementById(id).appendChild(newElement)
    return newElement
}

function showForm(id, onShow) {
    addText(id, "h4", "Количество токенов в индексе")
    addTextInput(id, "altcoinsCount", 50)
    addText(id, "h4", "Дата проверки альткоинов")
    addTextInput(id, "altcoinsCheckDate", "2024-09-01")
    addText(id, "h4", "Дата начала периода")
    addTextInput(id, "checkHistoryStartDate", "2024-09-01")
    addText(id, "h4", "Дата завершения периода")
    addTextInput(id, "checkHistoryEndDate", "2024-12-01")
    addElement(id, "hr")
    addButton(id, "Показать", () => onShow(id))
}