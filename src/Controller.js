"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs = __importStar(require("fs"));
const UserState_1 = require("./UserState");
class Controller {
    constructor(client) {
        this.client = client;
        this.usersFilePath = "./src/users.json";
        if (!fs.existsSync(this.usersFilePath)) {
            fs.writeFileSync(this.usersFilePath, '{}', 'utf-8');
        }
        this.parser = new Parser_1.Parser("");
        this.paymentMethod = 'Todavía no se realizó el pedido';
    }
    getUsersFromFile() {
        let data;
        try {
            data = fs.readFileSync(this.usersFilePath, 'utf-8');
        }
        catch (error) {
            console.error('Error reading users file:', error);
            data = '{}';
        }
        let plainUsers;
        try {
            plainUsers = JSON.parse(data);
        }
        catch (error) {
            console.error('Error parsing JSON data:', error);
            plainUsers = {};
        }
        const users = {};
        for (const id in plainUsers) {
            if (plainUsers.hasOwnProperty(id)) {
                const user = plainUsers[id];
                users[id] = new User_1.default(user.id, user.name);
                users[id].setState(new UserState_1.UserStateDefault());
            }
        }
        return users;
    }
    saveUsersToFile(users) {
        const plainUsers = {};
        for (const id in users) {
            const user = users[id];
            plainUsers[id] = {
                id: user.id,
                name: user.name,
                state: user.state
            };
        }
        fs.writeFileSync(this.usersFilePath, JSON.stringify(plainUsers), 'utf-8');
    }
    handleMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = this.getUsersFromFile();
            let user = users[message.from];
            if (!user) {
                user = new User_1.default(message.from, message.sender.pushname);
            }
            const response = yield user.handleMessage(message.body, this);
            users[message.from] = user;
            this.saveUsersToFile(users);
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
            const menuLink = 'https://pedilo.store/el-club-de-la-hamburguesa';
            return this.sendLink(user, menuLink, 'Para realizar un pedido 👇🏼', '');
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
        const sumItems = this.parser.items.reduce((sum, item) => sum + (item.price), 0);
        const totalWithDelivery = sumItems + (this.parser.address ? this.parser.deliveryExtraPrice : 0);
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
