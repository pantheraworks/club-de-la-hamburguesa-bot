import {Message, Whatsapp} from "venom-bot";
import User from "./User";
import * as fs from 'fs';
import {UserRepository} from "./UserRepository";

class Controller {

  private client: Whatsapp;
  private readonly usersFilePath: string;

  public constructor(client: Whatsapp) {
    this.client = client;
    this.usersFilePath = "./src/users.json";
    if (!fs.existsSync(this.usersFilePath)) {
      fs.writeFileSync(this.usersFilePath, '{}', 'utf-8');
    }
  }

  public async handleMessage(message: Message): Promise<void> {
    const userRepository = new UserRepository();
    const users = userRepository.getUsers();
    let user = users[message.from];
    if (!user) {
      user = new User(message.from, message.sender.pushname || '');
    }
    await user.handleMessage(this);
    users[message.from] = user;
    userRepository.saveUsers(users);
    return;
  }

  public async sayHiBack(user: User) {
    const name = user.name;
    return await this.sendText(user.id, `Hola ${name}!`);
  }

  public async sendText(to: string, text: string) {
    return await this.client.sendText(to, text);
  }

  public async sendLink(user: User, link: string, title: string, text: string) {
    return await this.client.sendLinkPreview(user.id, link, title, text);
  }

  async sendMenuLink(user: User) {
    return this.sendLink(user, 'https://pedilo.store/el-club-de-la-hamburguesa', 'Para realizar un pedido 👇🏼', '');
  }
}

export default Controller;
