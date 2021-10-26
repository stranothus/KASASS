function Sassify(style) {
    style = style.replace(/[^:]\/\/([^\n]+)/gm, "\/*$1*/");
    // style = style.replace(/\/\*([\s\S]*?\*\/|([^:]|^)\/\/.*$)/gms, "/* this is a comment and it won't work  whether its mixin or extend */");

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
        let matched = txt.match(/[^}\/]+{[^{}]+{[^}]+}/g);
        let parentSelector = matched.map(v => v.match(/(^|;)[^{;]+{/g).slice(0, -1).join(" ").replace(/;|{/g, "").replace(/\s+/g, " ").trim());
        let nested = matched.map(v => v.replace(/^[^{]+{[\s\S]+;\s*([^{;]+){/g, "$1{"));
        
        let without = txt;
        for (let i = 0; i < nested.length; i++) {
            without = without.replace(new RegExp(nested[i].replace(/([\?\*\$\(\)\/])/g, "\\$1")), "");
        }
        
        let full = parentSelector.map((v, i) => v + " " + nested[i]);
        let final = without + full.join("");
        
        return final.replace(/\s+:/g, ":");
    }
    
    let nestLimit = 100;
    while (style.match(/[^}]+{[^{}]+{[^}]+}/g) && nestLimit) {
        style = nest(style);
        nestLimit--;
    }

    let mixin_at = /@mixin\s*(\w+)(\s|\s\(.+\)|\(.+\))\s*{([^}]+)}/gms;
    let mixMatch = style.match(mixin_at);
    if(!!mixMatch) {
        let mixMatch_2 = mixMatch.map(x => x.split(/\s*{\s*/gms).toString().split(/\s*}/).map(x => x.replace(/\s*}/, "")));
        let x = mixMatch_2.toString().split(",");
        let names = x.filter(v => v.includes("@mixin")).map(v => v.replace(/@mixin\s*/, "").replace(/\([^\)]+\)/, "").trim());
        
        for(let i = 0; i < names.length; i++) {
            let includes = style.match(new RegExp("@include\\s+" + names[i] + "[^;]+;"));
            let mixin = style.match(new RegExp("@mixin\\s+" + names[i] + "[^}]+}"))[0];
            let variables = mixin.match(/\([^\)]*\)/)[0].replace(/(?:\(|\))/g, "").split(/\.\s*/);
            if(includes) {
                for(let e = 0; e < includes.length; e++) {
                    let include = includes[e];
                    let parameters = include.match(/\([^\)]*\)/)[0].replace(/(?:\(|\))/g, "").split(/\.\s*/);
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
    
    return style;
}

export default Sassify;