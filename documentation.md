# Using KASASS

Using KASASS is easy! Just add
```html
<script type = "module" src = "https://cdn.jsdelivr.net/gh/stranothus/KASASS/index.js"></script>
```
For modules or 
```html
<script src = "https://cdn.jsdelivr.net/gh/stranothus/KASASS/importless.js"></script>
```
For no module into your Khan Academy webpage and 
```html
<sass-style>
  // your KASASS here!
<sass-style>
```
To write your KASASS in, and you're ready to go!

# Features

## Single line comments:
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

## Variables:
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


## Inheritance:
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


## No need of calc():
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

## Mixin:
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

## Nesting:
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

# Recommendations:
KASASS is not a full implementation of SCSS. Instead, it transpiles SCSS code to CSS code. Because this takes a second, you may have a brief flash of raw HTML before your KASASS starts working. It's recommended to hide body content with a standard style tag and then set it back to visible in the KASASS, like so:
```html
<style>
  body {
    display: none;
  }
</style>

<sass-style>
  body {
    display: block;
  }

  ... // rest of your KASASS here
</sass-style>
```