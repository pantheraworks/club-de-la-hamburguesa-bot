import Controller from "./Controller";
import {PlainUser} from "./UserRepository";

class User {
  public id: string;
  public name: string;
  public lastMessageTime;

  public constructor(id: string, name: string, time: number) {
    this.id = id;
    this.name = name;
    this.lastMessageTime = time;
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
    return new User(data.id, data.name, data.lastMessageTime);
  }
}

export default User;
