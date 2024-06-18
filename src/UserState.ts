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
    user.setState(new UserStatePaymentMethod());
    return await controller.sendMenuLink(user);
  }
}

class UserStatePaymentMethod extends UserState {
  constructor() {
    super();
  }

  public handleMessage = async (option: string, controller: Controller, user: User) => {
    controller.parser = new Parser(option);
    if (controller.validateParser()){
      user.setState(new UserStatePaymentMethodDone());
      return await controller.sendPaymentMethods(user);
    }
    return await controller.sendText(user.id, 'Enviaste algo incorrecto, con el link tenes que armar tu pedido enviar el mensaje al "Finalizar por whatsapp"');
  }
}

class UserStatePaymentMethodDone extends UserState {
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
  constructor() {
    super();
  }

  public handleMessage = async (option: string, controller: Controller, user: User) => {
    if(option == 'ok' || option == 'OK' || option == 'Ok'){
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
