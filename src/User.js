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
const UserState_1 = require("./UserState");
class User {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.state = new UserState_1.UserStateDefault();
    }
    handleMessage(option, controller) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.state.handleMessage(option, controller, this);
        });
    }
    setState(state) {
        this.state = state;
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            state: this.state.toJSON()
        };
    }
    static fromJSON(data) {
        const user = new User(data.id, data.name);
        user.state = UserState_1.UserState.fromJSON(data.state);
        return user;
    }
}
exports.default = User;
