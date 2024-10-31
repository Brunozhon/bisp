# Bisp

A Lisp-like programming language created in under 500 lines of code.

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
let logger = new Logger();
let scanner = new Scanner("[code goes here]", logger);
let parser = new Parser(scanner.scanTokens());
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
let logger = new WebLogger("output");
let scanner = new Scanner("[code goes here]", logger);
let parser = new Parser(scanner.scanTokens());
let interpreter = new Interpreter(logger);

interpreter.evaluate(parser.parse());
```

## Learn Bisp

### Lesson 1: `print`

In [the Bisp shell](https://brunozhon.github.io/bisp/), type this code:

```lisp
(print "Hello, world!")
```

Click "Compile!". You should end up with a result looking like this:

<img width="1403" alt="Screenshot 2024-10-30 at 7 13 42 PM" src="https://github.com/user-attachments/assets/fb7c137e-0fa7-4d17-b99a-955a078eb871">

To print things twice, you need to enclose the two `print` statements into another list:

```lisp
(
    (print "Hello, world!")
    (print "I am learning Bisp!")
)
```

Bisp has a shortcut for doing this, which is:

```lisp
(print "Hello, world!" "I am learning Bisp!")
```

You can also use numbers in `print` statements:

```lisp
(print 1 2 3)
```

### Lesson 2: Everything is a List

Yes, just like Lisp. This means that you can print a list out like this:

```lisp
(print ("This is" "a list" "with" 5 "elements."))
```

The browser interpreter separates the elements in spaces, which could be useful.

You can even chain `print` statements together. This one will print `1` twice:

```lisp
(print (print 1))
```

### Lesson 3: Addition and Subtraction

Addition and subtraction use `add` and `sub`, respectively. If you have a bit more time on your hands, you can use `subtract` instead of `sub`.

```lisp
(
    (print (add 1 2))
    (print (sub 3 2))
)
```

Note that subtraction follows this rule:

```
(sub a b c d ... z)
a - b - c - d - ... - z
```

### Lesson 4: Multiplication and Division

Multiplication and division use `mult` and `div`, respectively. If you think `mult` should be `mul`, "`mul`" over it. As usual, `mult` and `div` can be written as `multiply` and `divide` if you have extra time.

```lisp
(
    (print (mult 2 3))
    (print (div 6 2))
)
```

Note that division follows this rule, just like subtraction:

```
(div a b c d ... z)
a / b / c / d / ... / z
```

### Lesson 5: Variables

It is now time to introduce variables. You can use the `set` operator to set a variable, and the `get` operator to get a variable.

```lisp
(
    (set theAnswerToLifeTheUniverseAndEverything 42)
    (print (get theAnswerToLifeTheUniverseAndEverything))
)
```