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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStateDefault = exports.UserState = void 0;
const Parser_1 = require("./Parser");
class UserState {
    toJSON() {
        return { type: this.type };
    }
    static fromJSON(data) {
        switch (data.type) {
            case 'UserStateDefault':
                return new UserStateDefault();
            case 'UserStatePaymentMethod':
                return new UserStatePaymentMethod();
            case 'UserStatePaymentMethodDone':
                return new UserStatePaymentMethodDone();
            case 'UserStateVerifyInformation':
                return new UserStateVerifyInformation();
            default:
                throw new Error(`Unknown state type: ${data.type}`);
        }
    }
}
exports.UserState = UserState;
class UserStateDefault extends UserState {
    constructor() {
        super();
        this.type = 'UserStateDefault';
        this.handleMessage = (_option, controller, user) => __awaiter(this, void 0, void 0, function* () {
            yield controller.sayHiBack(user);
            user.setState(new UserStatePaymentMethod());
            return yield controller.sendMenuLink(user);
        });
    }
}
exports.UserStateDefault = UserStateDefault;
class UserStatePaymentMethod extends UserState {
    constructor() {
        super();
        this.type = 'UserStatePaymentMethod';
        this.handleMessage = (option, controller, user) => __awaiter(this, void 0, void 0, function* () {
            controller.parser = new Parser_1.Parser(option);
            if (controller.validateParser()) {
                user.setState(new UserStatePaymentMethodDone());
                return yield controller.sendPaymentMethods(user);
            }
            return yield controller.sendText(user.id, 'Tenes que realizar tu pedido a través del link, y enviar el mensaje al "Finalizar por Whatsapp"');
        });
    }
}
class UserStatePaymentMethodDone extends UserState {
    constructor() {
        super();
        this.type = 'UserStatePaymentMethodDone';
        this.handleMessage = (option, controller, user) => __awaiter(this, void 0, void 0, function* () {
            controller.paymentMethod = option;
            user.setState(new UserStateVerifyInformation());
            if (controller.parser.hasMedallon()) {
                return yield controller.sendText(user.id, 'Vimos que pediste extras de medallon con cheddar. \n' +
                    'Indícanos en que burgers los agregamos');
            }
            return yield controller.sendText(user.id, 'Si crees que enviaste algo mal, podes corregirlo ahora, sinó mandá un "OK".');
        });
    }
}
class UserStateVerifyInformation extends UserState {
    constructor() {
        super();
        this.type = 'UserStateVerifyInformation';
        this.handleMessage = (option, controller, user) => __awaiter(this, void 0, void 0, function* () {
            if (option.toLowerCase() == "ok") {
                user.setState(new UserStateDefault());
                return yield controller.sendText(user.id, 'Vamos a revisar que enviaste toda la informacion correctamente. Si es así, realizamos tu pedido.\nGracias por elegirnos!');
            }
            return yield controller.sendText(user.id, 'Si crees que enviaste algo mal, podes corregirlo ahora, sinó mandá un "OK".');
        });
    }
}
