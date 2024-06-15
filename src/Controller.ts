import {Message, Whatsapp} from "venom-bot";
import User from "./User";
import {Parser} from "./Parser";

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
    return this.sendLink(user, 'https://pedilo.store/el-club-de-la-hamburguesa', 'Para realizar un pedido 👇🏼', '');
  }

  public validateParser(parser: Parser): boolean {
    if (parser.name === null) {
      console.error("Nombre no encontrado");
      return false;
    }
    if (parser.items.length === 0) {
      console.error("No se encontraron items");
      return false;
    }
    if (parser.subtotal === null) {
      console.error("Subtotal no encontrado");
      return false;
    }
    const sumaItems = parser.items.reduce((sum: number, item: { quantity: number, product: string, price: number }) => sum + (item.price), 0);
    const totalWithDelivery = sumaItems + (parser.address ? parser.deliveryExtraPrice : 0);
    if (parser.subtotal !== totalWithDelivery) {
      console.error(`El subtotal (${parser.subtotal}) no coincide con la suma de los items más entrega (${totalWithDelivery})`);
      return false;
    }
    if (parser.table === null && parser.address === null && !parser.takeAway) {
      console.error("Número de mesa, dirección y opción de retiro por el local no encontrados");
      return false;
    }
    return true;
  }
}

export default Controller;
