import { Singleton } from '@detechworld/toolbox';

class Proxydi extends Singleton {
  _registry = {};

  get(name) {
    return this._registry[name];
  }

  register(name, value) {
    this._registry[name] = value;
  }

  batchRegister(registry) {
    for (const [name, value] of Object.entries(registry)) {
      this.register(name, value)
    }
  }

  remove(name) {
    delete this._registry[name]
  }

  batchRemove(names) {
    for (const name of names) {
      this.remove(name)
    }
  }

  has(name) {
    return !!this._registry[name];
  }
}

const proxydi = Proxydi.getInstance();

export { Proxydi, proxydi };
