"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
class Parser {
    constructor(mensaje) {
        this.name = null;
        this.items = [];
        this.subtotal = null;
        this.table = null;
        this.address = null;
        this.indications = null;
        this.comment = null;
        this.deliveryExtraPrice = 2000;
        this.takeAway = false;
        this.parse(mensaje);
    }
    parse(mensaje) {
        const namePattern = /\* (.*?)\*/;
        const itemsPattern = /- (\d+) x (.*?) : \$(\d+)/g;
        const subtotalPattern = /\* Subtotal: \$(\d+)\*/;
        const tablePattern = /Número de mesa: (\d+)/;
        const addressPattern = /Hacia: (.*?)\n/;
        const indicationsPattern = /Indicaciones: (.*?)\n/;
        const commentsPattern = /Comentario: (.*)/;
        const takeAwayPattern = /Retiro por el local/;
        const nameMatch = mensaje.match(namePattern);
        this.name = nameMatch ? nameMatch[1].trim() : null;
        const itemsMatch = [...mensaje.matchAll(itemsPattern)];
        this.items = itemsMatch.map(match => ({
            quantity: parseInt(match[1]),
            product: match[2].trim(),
            price: parseInt(match[3])
        }));
        const subtotalMatch = mensaje.match(subtotalPattern);
        this.subtotal = subtotalMatch ? parseInt(subtotalMatch[1]) : null;
        const tableMatch = mensaje.match(tablePattern);
        this.table = tableMatch ? parseInt(tableMatch[1]) : null;
        const addressMatch = mensaje.match(addressPattern);
        this.address = addressMatch ? addressMatch[1].trim() : null;
        const indicationsMatch = mensaje.match(indicationsPattern);
        this.indications = indicationsMatch ? indicationsMatch[1].trim() : null;
        const commentMatch = mensaje.match(commentsPattern);
        this.comment = commentMatch ? commentMatch[1].trim() : null;
        this.takeAway = takeAwayPattern.test(mensaje);
    }
    hasMedallon() {
        return this.items.some(item => item.product.includes("Medallon con cheddar"));
    }
}
exports.Parser = Parser;
