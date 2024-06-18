"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User"));
const Parser_1 = require("./Parser");
class Controller {
    constructor(client) {
        this.client = client;
        this.users = new Map();
        this.parser = new Parser_1.Parser("");
        this.paymentMethod = 'Todavía no se realizó el pedido';
    }
    handleMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.users.get(message.from) || new User_1.default(message.from, message.sender.pushname || '');
            const response = yield user.handleMessage(message.body, this);
            this.users.set(message.from, user);
            return response;
        });
    }
    sayHiBack(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = user.name;
            return yield this.sendText(user.id, `Hola ${name}!`);
        });
    }
    sendText(to, text) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.sendText(to, text);
        });
    }
    sendLink(user, link, title, text) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.sendLinkPreview(user.id, link, title, text);
        });
    }
    sendMenuLink(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendLink(user, 'https://pedilo.store/el-club-de-la-hamburguesa', 'Para realizar un pedido 👇🏼', '');
        });
    }
    validateParser() {
        if (this.parser.name === null) {
            console.error("Nombre no encontrado");
            return false;
        }
        if (this.parser.items.length === 0) {
            console.error("No se encontraron items");
            return false;
        }
        if (this.parser.subtotal === null) {
            console.error("Subtotal no encontrado");
            return false;
        }
        const sumaItems = this.parser.items.reduce((sum, item) => sum + (item.price), 0);
        const totalWithDelivery = sumaItems + (this.parser.address ? this.parser.deliveryExtraPrice : 0);
        if (this.parser.subtotal !== totalWithDelivery) {
            console.error(`El subtotal (${this.parser.subtotal}) no coincide con la suma de los items más entrega (${totalWithDelivery})`);
            return false;
        }
        if (this.parser.table === null && this.parser.address === null && !this.parser.takeAway) {
            console.error("Número de mesa, dirección y opción de retiro por el local no encontrados");
            return false;
        }
        return true;
    }
    sendPaymentMethods(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sendText(user.id, 'Como abonas? \n' +
                '● Efectivo (avísanos si te tenemos que llevar cambio) \n' +
                '● Mercado pago (mándanos el comprobante de pago)\n' +
                'Nombre del titular: Santiago Agustín  Ruiz\n' +
                'Alias: espina.catre.reno.mp\n' +
                'CBU: 0000003100040939563722');
        });
    }
}
exports.default = Controller;
