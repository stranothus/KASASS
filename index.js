import Sassify from "./import.js";

let elementName = "sass-style";

if (!customElements.get(elementName)) {
    class SASS extends HTMLDivElement {
        constructor() {
            super();
        }
    }
    
    customElements.define(elementName, SASS);
}

const SassStyles = document.querySelectorAll("sass-style");
            
SassStyles.forEach(element => {
    const sassified = Sassify(element.innerHTML);
    
    const style = document.createElement("style");
    style.innerText = sassified;
    
    const output = document.createElement("div");
    output.classList.add("output");
    output.textContent = sassified;
    
    element.parentElement.removeChild(element);
    document.head.appendChild(style);
    document.body.appendChild(output);
    output.style.display="none";

});
