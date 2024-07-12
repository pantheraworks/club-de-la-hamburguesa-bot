import {Message, Whatsapp} from "venom-bot";
import User from "./User";
import {Parser} from "./Parser";
import * as fs from 'fs';
import {UserRepository} from "./UserRepository";

class Controller {

  private client: Whatsapp;
  public parser: Parser;
  public paymentMethod: string;
  private readonly usersFilePath: string;

  public constructor(client: Whatsapp) {
    this.client = client;
    this.usersFilePath = "./src/users.json";
    this.parser = new Parser("");
    this.paymentMethod = 'Todavía no se realizó el pedido';
    if (!fs.existsSync(this.usersFilePath)) {
      fs.writeFileSync(this.usersFilePath, '{}', 'utf-8');
    }
  }

  public async handleMessage(message: Message): Promise<string> {
    const userRepository = new UserRepository();
    const users = userRepository.getUsers();
    let user = users[message.from];
    if (!user) {
      user = new User(message.from, message.sender.pushname || '');
    }
    const response = await user.handleMessage(message.body, this);
    users[message.from] = user;
    userRepository.saveUsers(users);
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
    return this.sendLink(user, 'https://pedilo.store/el-club-de-la-hamburguesa', 'Para realizar un pedido 👇🏼', '');
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
        '● Transferencia (mándanos el comprobante de pago)\n' +
        'Nombre del titular: Santiago Agustín  Ruiz\n' +
        'Alias: el.club.1\n' +
        'CBU: 0720477188000000705572');
  }
}

export default Controller;
