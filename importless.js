var elementName = "sass-style";

if (!customElements.get(elementName)) {
    class SASS extends HTMLDivElement {
        constructor() {
            super();
        }
    }
    
    customElements.define(elementName, SASS);
}

function Sassify(style) {
    style = style.replace(/[^:]\/\/([^\n]+)/gm, "\/*$1*/");
    style = style.replace(/@keyframes\s+([^\s{]+)\s+{/gi, "@keyframes $1 CURLYBRACKET_HERE");
    style = style.replace(/@media\s*([^{]+){/gi, "@media $1 CURLYBRACKET_HERE");

    let variables = style.match(/(?:[^:]|^)\s*\$[^\s:]+\s*:\s*[^;]+/g);
    style = style.replace(/(?:[^:]|^)\s*\$[^\s:]+\s*:\s*[^;]+;/g, "");
    if(variables) {
        variables = variables.map(v => v.replace(/^;/, "").trim().split(/\s*:\s*/));
    
        for (var i = 0; i < variables.length; i++) {
            style = style.replace(new RegExp("(:[^;]*)\\" + variables[i][0], "g"), "$1" + variables[i][1]).replace(new RegExp("(,\\s*)\\" + variables[i][0], "g"), "$1" + variables[i][1]).replace(new RegExp("(\\(\\s*)\\" + variables[i][0], "g"), "$1" + variables[i][1]);
        }
    }
    
    let inheritances = style.match(/%([^\s{]+)\s*{\s*([^}]+)}/g);

    if(inheritances) {
        inheritances = inheritances.map(v => v.split(/\s*{\s*/).map(v => v.replace(/\s*}/, "")));
        style = style.replace(/%[^{\s]+[\s]*{[^}]+}/g, "");
        for (var i = 0; i < inheritances.length; i++) {
            style = style.replace(new RegExp("@extend\\s*" + inheritances[i][0] + "\\s*;", "g"), inheritances[i][1]);
        }
    }
    
    style = style.replace(/:(\s*)(-?\d+[a-z%]+\s*[+-\/*][^;]+)\s*/gi, ":$1calc($2)");

    function nest(txt) {
        const matched = txt.match(/[^}\/]+{[^{}]+{[^}]+}/g);
        const parentSelector = matched.map(v => v.match(/(^|;)[^{;]+{/g).slice(0, -1).join(" ").replace(/;|{/g, "").replace(/\s+/g, " ").trim());
        const nested = matched.map(v => v.replace(/^[^{]+{[\s\S]+;\s*([^{;]+){/g, "$1{"));
        
        let without = txt;
        for (let i = 0; i < nested.length; i++) {
            without = without.replace(new RegExp(nested[i].replace(/([\?\*\$\(\)\/])/g, "\\$1")), "");
        }
        
        const full = parentSelector.map((v, i) => v + " " + nested[i]);
        const final = without + full.join("");
        
        return final.replace(/\s+:/g, ":");
    }
    
    let nestLimit = 100;
    while (style.match(/[^}]+{[^{}]+{[^}]+}/g) && nestLimit) {
        style = nest(style);
        nestLimit--;
    }

    const mixin_at = /@mixin\s*(\w+)(\s|\s\(.+\)|\(.+\))\s*{([^}]+)}/gms;
    const mixMatch = style.match(mixin_at);
    if(!!mixMatch) {
        const mixMatch_2 = mixMatch.map(x => x.split(/\s*{\s*/gms).toString().split(/\s*}/).map(x => x.replace(/\s*}/, "")));
        const x = mixMatch_2.toString().split(",");
        const names = x.filter(v => v.includes("@mixin")).map(v => v.replace(/@mixin\s*/, "").replace(/\([^\)]+\)/, "").trim());
        
        for(let i = 0; i < names.length; i++) {
            const includes = style.match(new RegExp("@include\\s+" + names[i] + "[^;]+;"));
            const mixin = style.match(new RegExp("@mixin\\s+" + names[i] + "[^}]+}"))[0];
            const variables = mixin.match(/\([^\)]*\)/)[0].replace(/(?:\(|\))/g, "").split(/\.\s*/);
            if(includes) {
                for(let e = 0; e < includes.length; e++) {
                    const include = includes[e];
                    const parameters = include.match(/\([^\)]*\)/)[0].replace(/(?:\(|\))/g, "").split(/\.\s*/);
                    let replaceWith = mixin.match(/{[^{]*}/)[0].replace(/(?:{|})/g, "").trim();
                    for(let j = 0; j < variables.length; j++) {
                        replaceWith = replaceWith.replace(new RegExp(variables[j].replace(/\$/g, "\\$"), "g"), parameters[j]);
                    }
                    style = style.replace(new RegExp(include.replace(/(\.|\(|\))/g, "\\$1")), replaceWith);
                }
            }
            style = style.replace(new RegExp(mixin.replace(/(\.|\(|\)|\$)/g, "\\$1")), "");
        }
    }
    
    const find_abs = /:\s*abs\((-|\+|)\s*(\d+)(px|cm|mm|in|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax|%)\s*\);/gi;
    style = style.replace(find_abs, ": $2$3;");
    
    style = style.replace(/CURLYBRACKET_HERE/g, "{");
    
    return style;
}

var SassStyles = document.querySelectorAll("sass-style");

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
    output.style.display = "none";
});