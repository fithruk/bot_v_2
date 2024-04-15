class UserState {
  constructor() {
    this.userStore = [];
  }

  viewStore = () => {
    console.log(this.userStore);
  };

  addNewUser = (user) => {
    this.userStore = this.userStore.concat(...this.userStore, user);
  };

  findUser = (userName) => {
    return this.userStore.find((existUser) => existUser.userName == userName);
  };

  removeUser = (user) => {
    this.userStore.filter((existUser) => existUser.userName !== user.userName);
  };
}

module.exports = new UserState();
