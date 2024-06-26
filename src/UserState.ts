import Controller from "./Controller";
import User from "./User";
import {Parser} from "./Parser";

abstract class UserState {
  abstract type: string;

  abstract handleMessage: (option: string, controller: Controller, user: User) => Promise<any>;

  public toJSON(): string {
    return this.type;
  }

  public static fromJSON(data: string): UserState {
    switch (data) {
      case 'UserStateDefault':
        return new UserStateDefault();
      case 'UserStatePaymentMethod':
        return new UserStatePaymentMethod();
      case 'UserStatePaymentMethodDone':
        return new UserStatePaymentMethodDone();
      case 'UserStateVerifyInformation':
        return new UserStateVerifyInformation();
      default:
        throw new Error(`Unknown state type: ${data}`);
    }
  }
}

class UserStateDefault extends UserState {
  public type = 'UserStateDefault';
  constructor() {
    super();
  }

  public handleMessage = async (_option: string, controller: Controller, user: User) => {
    await controller.sayHiBack(user);
    user.setState(new UserStatePaymentMethod());
    return await controller.sendMenuLink(user);
  }
}

class UserStatePaymentMethod extends UserState {
  public type = 'UserStatePaymentMethod';
  constructor() {
    super();
  }

  public handleMessage = async (option: string, controller: Controller, user: User) => {
    controller.parser = new Parser(option);
    if (controller.validateParser()){
      user.setState(new UserStatePaymentMethodDone());
      return await controller.sendPaymentMethods(user);
    }
    return await controller.sendText(user.id, 'Tenes que realizar tu pedido a través del link, y enviar el mensaje al "Finalizar por Whatsapp"');
  }
}

class UserStatePaymentMethodDone extends UserState {
  public type = 'UserStatePaymentMethodDone';
  constructor(){
    super();
  }

  public handleMessage = async (option: string, controller: Controller, user: User) => {
    controller.paymentMethod = option;
    user.setState(new UserStateVerifyInformation());
    if(controller.parser.hasMedallon()) {
      return await controller.sendText(user.id, 'Vimos que pediste extras de medallon con cheddar. \n' +
        'Indícanos en que burgers los agregamos');
    }
    return await controller.sendText(user.id,'Si crees que enviaste algo mal, podes corregirlo ahora, sinó mandá un "OK".');
  }
}

class UserStateVerifyInformation extends UserState {
  public type = 'UserStateVerifyInformation';
  constructor() {
    super();
  }

  public handleMessage = async (option: string, controller: Controller, user: User) => {
    if(option.toLowerCase() == "ok"){
      user.setState(new UserStateDefault());
      return await controller.sendText(user.id,'Vamos a revisar que enviaste toda la informacion correctamente. Si es así, realizamos tu pedido.\nGracias por elegirnos!');
    }
    return await controller.sendText(user.id,'Si crees que enviaste algo mal, podes corregirlo ahora, sinó mandá un "OK".');
  }
}

export {
  UserState,
  UserStateDefault,
};
