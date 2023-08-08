export default class Registry<T_KEY, T_TARGET> {
  private map = new Map<T_KEY, T_TARGET>();
  private defaultTarget?: T_TARGET;

  register(key: T_KEY, target: T_TARGET) {
    if (this.map.has(key)) {
      throw new Error(`handler for key [${key}] already registered`);
    }

    this.map.set(key, target);
  }
  registerDefault(target: T_TARGET) {
    this.defaultTarget = target;
  }

  unregister(key: T_KEY) {
    this.map.delete(key);
  }

  clear() {
    this.map.clear();
  }

  get(key: T_KEY) {
    return this.map.get(key) ?? this.defaultTarget;
  }

  getDefault() {
    return this.defaultTarget;
  }

  has(key: T_KEY) {
    return this.map.has(key);
  }
}
