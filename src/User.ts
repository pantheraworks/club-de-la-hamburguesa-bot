import {UserState, UserStateDefault} from "./UserState";
import Controller from "./Controller";

class User {
  public id: string;
  public name: string;
  private state: UserState;

  public constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.state = new UserStateDefault();
  }

  public async handleMessage(option: string, controller: Controller) {
    return await this.state.handleMessage(option, controller, this);
  }

  public setState(state: UserState) {
    this.state = state;
  }

  public toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      state: this.state.toJSON()
    };
  }

  public static fromJSON(data: any): User {
    const user = new User(data.id, data.name);
    user.state = UserState.fromJSON(data.state);
    return user;
  }
}

export default User;
