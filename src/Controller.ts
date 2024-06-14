import {Message, Whatsapp} from "venom-bot";
import User from "./User";

class Controller {

  private client: Whatsapp;
  private users: Map<string, User>;

  public constructor(client: Whatsapp) {
    this.client = client;
    this.users = new Map();
  }

  public async handleMessage(message: Message) {
    const user = this.users.get(message.from) || new User(message.from, message.sender.pushname || '');
    const response = await user.handleMessage(message.body, this);
    this.users.set(message.from, user);
    return response;
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
    return this.sendLink(user, 'https://pedilo.store/el-club-de-la-hamburguesa', 'Para realizar un pedido 👇🏼', 'Acordate que si compras medallones de queso, tenes que comentar en el medallón, en que hamburguesas queres ponerlos.');
  }
}

export default Controller;
