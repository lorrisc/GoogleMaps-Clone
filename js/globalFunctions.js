function createElement(tagName, parent, id, classes = [], attributes = {}, text = "") {
    // créer un élément html
    const element = document.createElement(tagName);
    if (id) element.id = id;
    if (classes.length > 0) element.classList.add(...classes);
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
    if (text) element.textContent = text;
    parent.appendChild(element);
    return element;
}

function getTextFromHtml(html) {
    // convert html code to text
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}
