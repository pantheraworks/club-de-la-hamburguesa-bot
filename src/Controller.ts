import {Message, Whatsapp} from "venom-bot";
import User from "./User";
import {Parser} from "./Parser";
import * as fs from 'fs';
import {UserState, UserStateDefault} from "./UserState";

class Controller {

  private client: Whatsapp;
  public parser: Parser;
  public paymentMethod: string;
  private readonly usersFilePath: string;

  public constructor(client: Whatsapp) {
    this.client = client;
    this.usersFilePath = "./src/users.json";
    if (!fs.existsSync(this.usersFilePath)) {
      fs.writeFileSync(this.usersFilePath, '{}', 'utf-8');
    }
    this.parser = new Parser("");
    this.paymentMethod = 'Todavía no se realizó el pedido';
  }

  private getUsersFromFile(): { [userId: string]: User } {
    let data: string;
    try {
      data = fs.readFileSync(this.usersFilePath, 'utf-8');
    } catch (error) {
      console.error('Error reading users file:', error);
      data = '{}';
    }
    let plainUsers: { [key: string]: User };
    try {
      plainUsers = JSON.parse(data);
    } catch (error) {
      console.error('Error parsing JSON data:', error);
      plainUsers = {};
    }
    const users: { [userId: string]: User } = {};
    for (const id in plainUsers) {
      if (plainUsers.hasOwnProperty(id)) {
        const user = plainUsers[id];
        users[id] = new User(user.id, user.name);
        users[id].setState(new UserStateDefault());
      }
    }
    return users;
  }

  private saveUsersToFile(users: { [userId: string]: User }) {
    const plainUsers: { [key: string]: { id: string, name: string, state: UserState } } = {};    for (const id in users) {
      const user = users[id];
      plainUsers[id] = {
        id: user.id,
        name: user.name,
        state: user.state
      };
    }
    fs.writeFileSync(this.usersFilePath, JSON.stringify(plainUsers), 'utf-8');
  }

  public async handleMessage(message: Message): Promise<string> {
    const users = this.getUsersFromFile();
    let user = users[message.from];
    if (!user) {
      user = new User(message.from, message.sender.pushname);
    }
    const response = await user.handleMessage(message.body, this);
    users[message.from] = user;
    this.saveUsersToFile(users);
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
    const menuLink = 'https://pedilo.store/el-club-de-la-hamburguesa';
    return this.sendLink(user, menuLink, 'Para realizar un pedido 👇🏼', '');
  }

  public validateParser(): boolean {
    if (this.parser.name === null) {
      console.error("Nombre no encontrado");
      return false;
    }
    if (this.parser.items.length === 0) {
      console.error("No se encontraron items");
      return false;
    }
    if (this.parser.subtotal === null) {
      console.error("Subtotal no encontrado");
      return false;
    }
    const sumItems = this.parser.items.reduce((sum: number, item: { quantity: number, product: string, price: number }) => sum + (item.price), 0);
    const totalWithDelivery = sumItems + (this.parser.address ? this.parser.deliveryExtraPrice : 0);
    if (this.parser.subtotal !== totalWithDelivery) {
      console.error(`El subtotal (${this.parser.subtotal}) no coincide con la suma de los items más entrega (${totalWithDelivery})`);
      return false;
    }
    if (this.parser.table === null && this.parser.address === null && !this.parser.takeAway) {
      console.error("Número de mesa, dirección y opción de retiro por el local no encontrados");
      return false;
    }
    return true;
  }

  public async sendPaymentMethods(user: User){
      return await this.sendText(user.id, 'Como abonas? \n' +
        '● Efectivo (avísanos si te tenemos que llevar cambio) \n' +
        '● Mercado pago (mándanos el comprobante de pago)\n' +
        'Nombre del titular: Santiago Agustín  Ruiz\n' +
        'Alias: espina.catre.reno.mp\n' +
        'CBU: 0000003100040939563722');
  }
}

export default Controller;
