const TokenType = Object.freeze({
    LPAREN: Symbol('LPAREN'),
    RPAREN: Symbol('RPAREN'),
    NUMBER: Symbol('NUMBER'),
    STRING: Symbol('STRING'),
    IDENTIFIER: Symbol('IDENTIFIER'),
    EOF: Symbol('EOF'),
});

class Token {
    constructor(type, value, line) {
        this.type = type;
        this.value = value;
        this.line = line;
    }
}

class Scanner {
    constructor(code) {
        this.code = code;
        this.tokens = [];

        this.start = 0;
        this.current = 0;
        this.line = 1;
    }

    isDigit(c) {
        return c >= '0' && c <= '9';
    }

    isAlpha(c) {
        return c >= 'a' && c <= 'z' ||
            c >= 'A' && c <= 'Z';
    }

    isAlphaNumeric(c) {
        return this.isAlpha(c) || this.isDigit(c);
    }

    isAtEnd() {
        return this.current >= this.code.length;
    }

    peek() {
        return this.code[this.current];
    }

    advance() {
        return this.code[this.current++];
    }

    scanTokens() {
        while (this.current < this.code.length) {
            this.start = this.current;
            this.scanToken();
        }

        this.addToken(TokenType.EOF);
        return this.tokens;
    }

    addToken(tokenType, value) {
        this.tokens.push(new Token(tokenType, value, this.line));
    }

    scanToken() {
        let c = this.advance();
        switch (c) {
            case '(': this.addToken(TokenType.LPAREN); break;
            case ')': this.addToken(TokenType.RPAREN); break;

            case ' ':
            case '\r':
            case '\t':
                break;
            case '\n':
                this.line++;
                break;

            case '"': this.string(); break;

            default:
                if (this.isDigit(c)) {
                    this.number();
                } else if (this.isAlpha(c)) {
                    this.identifier();
                } else {
                    console.error(`Error: Unknown character '${c}'`);
                }
        }
    }

    string() {
        while (this.peek() !== '"' && !this.isAtEnd()) this.advance();

        if (this.isAtEnd()) {
            console.error("Unterminated string.");
            return;
        }

        this.advance();

        const value = this.code.substring(this.start + 1, this.current - 1);
        this.addToken(TokenType.STRING, value);
    }

    number() {
        while (this.isDigit(this.peek())) this.advance();
        this.addToken(TokenType.NUMBER, parseInt(this.code.substring(this.start, this.current)));
    }

    identifier() {
        while (this.isAlphaNumeric(this.peek())) this.advance();
        this.addToken(TokenType.IDENTIFIER, this.code.substring(this.start, this.current));
    }
}

class Expr {
    accept(visitor) {
        console.error("Not implemented.");
    }
}

class NumberExpr extends Expr {
    constructor(value) {
        super();
        this.value = value;
    }

    accept(visitor) {
        return visitor.visitNumberExpr(this);
    }
}

class StringExpr extends Expr {
    constructor(value) {
        super();
        this.value = value;
    }

    accept(visitor) {
        return visitor.visitStringExpr(this);
    }
}

class IdentifierExpr extends Expr {
    constructor(value) {
        super();
        this.value = value;
    }

    accept(visitor) {
        return visitor.visitIdentifierExpr(this);
    }
}

class ParenExpr extends Expr {
    constructor(exprs) {
        super();
        this.exprs = exprs;
    }

    accept(visitor) {
        return visitor.visitParenExpr(this);
    }
}

class ErrorExpr extends Expr {
    constructor(message) {
        super();
        this.message = message;
    }

    accept(visitor) {
        return visitor.visitErrorExpr(this);
    }
}

class Visitor {
    visitNumberExpr(expr) {
        console.error("Not implemented.");
    }
    visitStringExpr(expr) {
        console.error("Not implemented.");
    }
    visitParenExpr(expr) {
        console.error("Not implemented.");
    }
    visitIdentifierExpr(expr) {
        console.error("Not implemented.");
    }
    visitErrorExpr(expr) {
        console.error("Not implemented.");
    }
}

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.startExpr = undefined;

        this.current = 0;
    }

    parse() {
        this.consume(TokenType.LPAREN, "Left parenthesis not found.")
        return this.paren();
    }

    advance() {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    peek() {
        return this.tokens[this.current];
    }

    previous() {
        return this.tokens[this.current - 1];
    }

    isAtEnd() {
        return this.peek().type === TokenType.EOF;
    }

    check(type) {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    match(...types) {
        for (let type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }

        return false;
    }

    consume(type, error) {
        if (this.check(type)) return this.advance();
        console.error(error);
    }

    expression() {
        if (this.match(TokenType.LPAREN)) {
            return this.paren();
        } else if (this.match(TokenType.STRING)) {
            return this.string();
        } else if (this.match(TokenType.NUMBER)) {
            return this.number();
        } else if (this.match(TokenType.IDENTIFIER)) {
            return this.identifier();
        } else {
            return new ErrorExpr("Expected left parenthesis, string, number, or identifier.");
        }
    }

    paren() {
        let expr = new ParenExpr([]);

        while (!this.check(TokenType.RPAREN) && !this.isAtEnd()) {
            expr.exprs.push(this.expression());
        }

        if (this.peek().type !== TokenType.RPAREN) return new ErrorExpr("Unterminated list.");
        this.advance();

        return expr;
    }

    string() {
        return new StringExpr(this.previous().value);
    }

    number() {
        return new NumberExpr(this.previous().value);
    }

    identifier() {
        return new IdentifierExpr(this.previous().value);
    }
}

class Interpreter extends Visitor {
    visitNumberExpr(expr) {
        return expr.value;
    }
    visitStringExpr(expr) {
        return expr.value;
    }
    visitParenExpr(expr) {
        let array = [];

        if (expr.exprs.length === 0) return [];

        if (expr.exprs[0] instanceof IdentifierExpr) {
            switch (expr.exprs[0].value) {
                case "print":
                    for (let e of expr.exprs.slice(1)) {
                        let res = this.evaluate(e);
                        if (res instanceof Array && res.length === 1) res = res[0];
                        console.log(res);
                        array.push(res);
                    }
                    break;
                case "add":
                    let running;
                    for (let e of expr.exprs.slice(1)) {
                        let res = this.evaluate(e);
                        if (typeof res == "number" || typeof res == "string") {
                            if (running === undefined) {
                                running = res;
                            } else {
                                running += res;
                            }
                        } else {
                            console.error("Invalid addition.");
                        }
                    }
                    if (running !== undefined) array.push(running);
                    break;
                default:
                    console.error("Unknown command '" + expr.exprs[0].value + "'.");
                    array.push(1);
            }
        } else {
            for (let e of expr.exprs) {
                array.push(this.evaluate(e));
            }
        }

        return array;
    }
    visitIdentifierExpr(expr) {
        return expr.value; // #TODO: add variables
    }
    visitErrorExpr(expr) {
        console.error(expr.message);
        return expr.message;
    }

    evaluate(expr) {
        return expr.accept(this);
    }
}