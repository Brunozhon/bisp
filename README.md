# Bisp

A Lisp-like programming language created in under 400 lines of code.

## How to install

Bisp supports Node.js and browser JavaScript.

### Node.js

1. Copy `index.js` to a file named `bisp.js`. (Or clone the repository and run `mv bisp/index.js bisp.js`. Whatever suits your needs.)
2. Add this line of code to `bisp.js`. (Challenge: figure out why I didn't add this line of code.)
```js
module.exports = {Scanner, Parser, Interpreter, Logger};
```
3. In your main Node.js file, add this line of code:
```js
const {Scanner, Parser, Interpreter, Logger} = require("bisp.js");
```
4. To compile some Bisp code, run this code snippet:
```js
let scanner = new Scanner([code goes here]);
let parser = new Parser(scanner.scanTokens());
let logger = new Logger();
let interpreter = new Interpreter(logger);

interpreter.evaluate(parser.parse());
```

### Browser JavaScript

1. Add this line of code to your HTML file.
```html
<script src="https://brunozhon.github.io/bisp/index.js"></script>
```
2. Add a `p` element for the output.
```html
<p id="output"></p>
```
3. To compile some Bisp code, add this code snippet into a `script` tag:
```js
let scanner = new Scanner([code goes here]);
let parser = new Parser(scanner.scanTokens());
let logger = new WebLogger("output");
let interpreter = new Interpreter(logger);

interpreter.evaluate(parser.parse());
```
