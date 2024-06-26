"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_1 = __importDefault(require("./User"));
const fs_1 = __importDefault(require("fs"));
class UserRepository {
    constructor() {
        this.usersFilePath = "./src/users.json";
    }
    getUsers() {
        let data;
        try {
            data = fs_1.default.readFileSync(this.usersFilePath, 'utf-8');
        }
        catch (error) {
            console.error('Error reading users file:', error);
            data = '{}';
        }
        let plainUsers = [];
        try {
            plainUsers = JSON.parse(data);
        }
        catch (error) {
            console.error('Error parsing JSON data:', error);
            plainUsers = [];
        }
        const users = {};
        for (const index in plainUsers) {
            const plainUser = plainUsers[index];
            const user = User_1.default.fromJSON(plainUser);
            users[user.id] = user;
        }
        return users;
    }
    saveUsers(users) {
        const plainUsers = [];
        for (const id in users) {
            plainUsers.push(users[id].toJSON());
        }
        fs_1.default.writeFileSync(this.usersFilePath, JSON.stringify(plainUsers, null, 2), 'utf-8');
    }
}
exports.UserRepository = UserRepository;
