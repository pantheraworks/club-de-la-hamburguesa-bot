import User from "./User";
import fs from "fs";

export interface PlainUser {
  id: string;
  name: string;
  state: string;
}

export class UserRepository {
  public usersFilePath = "./src/users.json";

  public getUsers(): { [userId: string]: User } {
    let data: string;
    try {
      data = fs.readFileSync(this.usersFilePath, 'utf-8');
    } catch (error) {
      console.error('Error reading users file:', error);
      data = '{}';
    }
    let plainUsers: PlainUser[] = [];
    try {
      plainUsers = JSON.parse(data);
    } catch (error) {
      console.error('Error parsing JSON data:', error);
      plainUsers = [];
    }
    const users: { [userId: string]: User } = {};
    for (const index in plainUsers) {
      const plainUser = plainUsers[index];
      const user = User.fromJSON(plainUser);
      users[user.id] = user;
    }
    return users;
  }

  public saveUsers(users: { [userId: string]: User }) {
    const plainUsers: PlainUser[] = [];
    for (const id in users) {
      plainUsers.push(users[id].toJSON());
    }
    fs.writeFileSync(this.usersFilePath, JSON.stringify(plainUsers, null, 2), 'utf-8');
  }
}
