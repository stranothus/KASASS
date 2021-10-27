# Contents

1. **Single line comments** :
In standard CSS, commenting code is a bit lengthy process and KASASS has made it easier!

```CSS
/* Comment in CSS */

p {
    color: red;
}
```             

KASASS

```JS
//Comment in KASASS

p {
    color: red;
}
```

2. **Variables** :
In standard CSS, declaring variables is also a lengthy process.

```CSS
/* Variables declaration */

:root {
    --variable: #000000;
}

/* using variables */

h1 {
    color: var(--variable);
}
```          

KASASS

```JS
//Variables declaration
$variable: #000000;

//using variables

h1 {
    color: $variable;
}
```           


3. **Inheritance** :
In standard CSS, there's no way to re-use a piece of css-code in various selectors but KASASS has @extend.

The @extend directive lets you share a set of CSS properties from one container to many selectors.

```JS
%button {
    padding: 10px;
    outline: none;
    cursor: pointer;
    font-size: 1.1em;
}
.basic-btn {
    @extend %button;
    background-color: #000000;
}
.color-btn {
    @extend %button;
    background-color: #FF0000;
}
```          


4. **No need of calc()** :
In standard CSS, we have to wrap calculations inside the calc() function but in KASASS we don't need to!

```CSS
.container {
    width: calc(100vw - 2em);
}
```             

KASASS

```CSS
.container {
    width: 100vw - 2em;
}            
```

5. **Mixin** :
In standard CSS, we have no way to create reusable functions but KASASS has a way to do this.
The @mixin directive lets you create CSS code that is to be reused throughout the website. The @include directive is created to let you use (include) the mixin.

KASASS
```CSS
@mixin border($color. $width) {
    border-color: $color;
    border-style: solid;
    border-width: $width;
}

div {
    @include border(red, thin);
}
section {
    @include border(black, thick);
}
```

6. **Nesting** :
KASASS lets you nest CSS selectors in the same way as HTML.

KASASS

```CSS
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li {
    display: inline-block;
  }
  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }
}
```
