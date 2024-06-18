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
const venom_bot_1 = require("venom-bot");
const Controller_1 = __importDefault(require("./Controller"));
(0, venom_bot_1.create)({
    session: 'bot'
})
    .then((client) => start(client))
    .catch((err) => {
    console.log(err);
});
const start = (client) => {
    const controller = new Controller_1.default(client);
    client.onMessage((message) => __awaiter(void 0, void 0, void 0, function* () {
        yield controller.handleMessage(message);
    })).then(_r => console.log('Listener started!'));
};
