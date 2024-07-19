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
const fs = __importStar(require("fs"));
const UserRepository_1 = require("./UserRepository");
class Controller {
    constructor(client) {
        this.client = client;
        this.usersFilePath = "./src/users.json";
        if (!fs.existsSync(this.usersFilePath)) {
            fs.writeFileSync(this.usersFilePath, '{}', 'utf-8');
        }
    }
    handleMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = new UserRepository_1.UserRepository();
            const users = userRepository.getUsers();
            let user = users[message.from];
            if (!user) {
                user = new User_1.default(message.from, message.sender.pushname || '');
            }
            yield user.handleMessage(this);
            users[message.from] = user;
            userRepository.saveUsers(users);
            return;
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
}
exports.default = Controller;
