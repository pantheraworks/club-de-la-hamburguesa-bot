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
    let plainUsers: { [key: string]: PlainUser };
    try {
      plainUsers = JSON.parse(data);
    } catch (error) {
      console.error('Error parsing JSON data:', error);
      plainUsers = {};
    }
    const users: { [userId: string]: User } = {};
    for (const id in plainUsers) {
      if (plainUsers.hasOwnProperty(id)) {
        users[id] = User.fromJSON(plainUsers[id]);
      }
    }
    return users;
  }

  public saveUsers(users: { [userId: string]: User }) {
    const plainUsers: PlainUser[] = [];
    for (const id in users) {
      if (users.hasOwnProperty(id)) {
        plainUsers.push(users[id].toJSON());
      }
    }
    fs.writeFileSync(this.usersFilePath, JSON.stringify(plainUsers, null, 2), 'utf-8');
  }
}
