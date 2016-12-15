class Service {

  constructor() {
    try {
      this.requiredInputs = this.constructor.inputs.required;
    } catch (e) {
      this.requiredInputs = [];
    }
    try {
      this.optionalInputs = this.constructor.inputs.optional;
    } catch (e) {
      this.optionalInputs = [];
    }
  }

  static run(inputs = {}) {
    const c = { Class: this };
    const instance = new c.Class();
    return instance.run(inputs);
  }

  run(inputs = {}) {
    let promise;
    if (this.runtime != null) {
      promise = this.runtime.start(this);
    } else {
      promise = new Promise((resolve, reject) => {
        this.main(inputs, resolve, reject);
      });
    }
    return promise;
  }

  main(inputs, resolve, reject) {
    const errors = [];
    const missingInputs = [];

    if (this.requiredInputs !== undefined) {
      this.requiredInputs.forEach((key) => {
        if (inputs[key] == null) {
          missingInputs.push(key);
        } else {
          this[key] = inputs[key];
        }
      });
    }
    if (missingInputs.length === 0) {
      if (this.optionalInputs !== undefined) {
        this.optionalInputs.forEach((key) => {
          this[key] = inputs[key];
        });
      }
      try {
        resolve(this.execute());
      } catch (e) {
        reject(e);
      }
    } else {
      errors.push(`${this.constructor.name} requires missing inputs: ${missingInputs}`);
      reject(errors);
    }
    return this;
  }

  execute() {
    console.log(`Excuting operation with parameters ${this}`);
  }
}

export { Service as default };
