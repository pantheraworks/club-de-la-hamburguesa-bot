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
                users[id] = User_1.default.fromJSON(plainUsers[id]);
            }
        }
        return users;
    }
    saveUsers(users) {
        const plainUsers = {};
        for (const id in users) {
            if (users.hasOwnProperty(id)) {
                plainUsers[id] = users[id].toJSON();
            }
        }
        fs_1.default.writeFileSync(this.usersFilePath, JSON.stringify(plainUsers, null, 2), 'utf-8');
    }
}
exports.UserRepository = UserRepository;
