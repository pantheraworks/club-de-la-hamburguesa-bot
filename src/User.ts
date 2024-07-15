import Controller from "./Controller";
import {PlainUser} from "./UserRepository";

class User {
  public id: string;
  public name: string;
  public lastMessageTime;

  public constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.lastMessageTime = -(3 * 60 * 60 * 1000);
  }

  public async handleMessage(controller: Controller) {
    const currentTime = Date.now();
    const twoHours = 2 * 60 * 60 * 1000;
    if(currentTime - this.lastMessageTime > twoHours) {
    this.lastMessageTime = currentTime;
    await controller.sayHiBack(this);
    await controller.sendMenuLink(this);
    }
    return;
  }

  public toJSON(): PlainUser {
    return {
      id: this.id,
      name: this.name,
      lastMessageTime: this.lastMessageTime
    };
  }

  public static fromJSON(data: PlainUser): User {
    const user = new User(data.id, data.name);
    user.lastMessageTime = data.lastMessageTime;
    return user;
  }
}

export default User;
