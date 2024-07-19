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
class User {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.lastMessageTime = -(3 * 60 * 60 * 1000);
    }
    handleMessage(controller) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTime = Date.now();
            const twoHours = 2 * 60 * 60 * 1000;
            if (currentTime - this.lastMessageTime > twoHours) {
                this.lastMessageTime = currentTime;
                yield controller.sayHiBack(this);
                yield controller.sendMenuLink(this);
            }
            return;
        });
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            lastMessageTime: this.lastMessageTime
        };
    }
    static fromJSON(data) {
        const user = new User(data.id, data.name);
        user.lastMessageTime = data.lastMessageTime;
        return user;
    }
}
exports.default = User;
