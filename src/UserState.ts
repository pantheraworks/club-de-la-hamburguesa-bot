import Controller from "./Controller";
import User from "./User";
import {Parser} from "./Parser";

abstract class UserState {
  abstract handleMessage: (option: string, controller: Controller, user: User) => Promise<any>;
}

class UserStateDefault extends UserState {
  constructor() {
    super();
  }

  public handleMessage = async (_option: string, controller: Controller, user: User) => {
    await controller.sayHiBack(user);
    user.setState(new UserStateOrderDone());
    return await controller.sendMenuLink(user);
  }
}

class UserStateOrderDone extends UserState {
  constructor() {
    super();
  }

  public handleMessage = async (option: string, controller: Controller, user: User) => {
    const parser = new Parser(option);
    if (controller.validateParser(parser)) {
    return await controller.sendText(user.id,'Como abonas? \n' +
      '●Efectivo (avísanos si te tenemos que llevar cambio) \n' +
      '● Mercado pago (mándanos el comprobante de pago)');
    }
    await controller.sendText(user.id,'Tenés que usar el link para armar tu pedido y así "finalizar por whatsapp" mandando el mensaje de tu pedido.');
    return await controller.sendMenuLink(user);
  }
}

export {
  UserState,
  UserStateDefault,
};
