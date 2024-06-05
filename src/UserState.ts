import Controller from "./Controller";
import User from "./User";

abstract class UserState {
  abstract handleMessage: (option: string, controller: Controller, user: User) => Promise<any>;
}

class UserStateDefault extends UserState {
  constructor() {
    super();
  }

  public handleMessage = async (_option: string, controller: Controller, user: User) => {
    await controller.sayHiBack(user);
    user.setState(new UserStateMainOptions());
    return await controller.sendMainOptions(user);
  }
}

class UserStateMainOptions extends UserState {
  constructor() {
    super();
  }

  public handleMessage = async (option: string, controller: Controller, user: User) => {
    switch (option) {
      case '1':
        await controller.sendMenu(user);
        return await controller.sendMainOptions(user);
      case '2':
        user.setState(new UserStateOrderOption());
        return await controller.sendMenuOptions(user);
      case '3':
        return await controller.sendText(user.id, 'No implementado');
      default:
        return await controller.sendText(user.id, 'Opción inválida');
    }
  }
}

class UserStateOrderOption extends UserState {
  constructor() {
    super();
  }

  public handleMessage = async (option: string, controller: Controller, user: User) => {
    if (option == '0') {
      user.setState(new UserStateMainOptions());
      return await controller.sendMainOptions(user);
    }
    if (!controller.menuOptions.has(option)) {
      await controller.sendText(user.id, 'Ingresaste algo incorrecto, volvé a intentar con uno de los items del menu.');
      return await controller.sendMenuOptions(user);
    }
    user.orderItem.id = controller.menuOptions.get(option)?.id;
    user.setState(new UserStateOrderSize());
    return await controller.sendOrderSizeOptions(user);
  }
}

class UserStateOrderSize extends UserState {
  constructor() {
    super();
  }

  public handleMessage = async (option: string, controller: Controller, user: User) => {
    if (option == '0') {
      user.setState(new UserStateOrderOption());
      return await controller.sendMenuOptions(user);
    }
    if (!Number(option)) {
      await controller.sendText(user.id, `Ingresaste un tamaño incorrecto, tiene que ser uno de los tamaños dados.\n`);
      return await controller.sendOrderSizeOptions(user);
    }
      return await controller.sendText(user.id, `No implementado`);
  }
}

//class UserStateOrderQuantity extends UserState {
//  constructor() {
//    super();
//  }
//
// public handleMessage = async (option: string, controller: Controller, user: User) => {
//   if (Number(option) == 0) {
//     user.setState(new UserStateOrderOption());
//     return await controller.sendMenuOptions(user);
//   }
//   if (!Number(option) || Number(option) < 0) {
//     return await controller.sendText(user.id, `Ingresaste una cantidad incorrecta, tiene que ser una cantidad adecuada\n Seleccioná 0 para volver atrás`);
//   }
//   return await controller.sendText(user.id, `No implementado`);
// }
//
export {
  UserState
  ,
  UserStateDefault
  ,
  UserStateMainOptions
  ,
  UserStateOrderOption
};
