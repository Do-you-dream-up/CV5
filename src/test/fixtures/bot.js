export const getBotObject = () => ({
  id: '',
  server: '',
  backUpServer: '',
});

export class BotFixture {
  constructor(props) {
    this.botObject = getBotObject();
  }
  setId(id = '') {
    this.botObject.id = id;
    return this;
  }

  setServer(server = '') {
    this.botObject.server = server;
    return this;
  }

  setBackupServer(backupServer = '') {
    this.botObject.backupServer = backupServer;
    return this;
  }

  getBot() {
    return { ...this.botObject };
  }
}
