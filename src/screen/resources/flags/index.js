let instance = null;

class FlagResource {
  static getInstance() {
    if (!instance) {
      instance = new FlagResource();
    }
    return instance;
  }

  constructor() {
    this.flags = {
      af: require('./images/af.png'),
      ca: require('./images/ca.png'),
      gb: require('./images/gb.png'),
      in: require('./images/in.png'),
      lr: require('./images/lr.png'),
      us: require('./images/us.png'),
    };
  }

  get(name) {
    return this.flags[name];
  }
}

export default FlagResource.getInstance();
