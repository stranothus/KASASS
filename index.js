import Sassify from "./import.js";

var SassStyles = document.querySelectorAll(".sass-style");
            
SassStyles.forEach(element => {
    let sassified = Sassify(element.innerHTML);
    
    let style = document.createElement("style");
    style.innerText = sassified;
    
    let output = document.createElement("div");
    output.classList.add("output");
    output.textContent = sassified;
    
    element.parentElement.removeChild(element);
    document.head.appendChild(style);
    document.body.appendChild(output);
});