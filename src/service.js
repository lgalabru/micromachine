class Service {

  constructor(input = {}) {
    this.oneOffInputs = {};
    if (typeof(input) === 'object') {
      this.oneOffInputs = input;
    } else if (typeof(input) === 'function') {
      this.runtime = input();
    }
    this.inputs();
  }

  inputs() {
    this.requiredInputs = [];
    this.optionalInputs = [];
  }

  required(input, _options = {}) {
    this.requiredInputs.push(input);
  }

  optional(input, _options = {}) {
    this.optionalInputs.push(input);
  }

  static run(inputs = {}) {
    const c = { Class: this };
    const instance = new c.Class(inputs);
    return instance.run();
  }

  run() {
    return new Promise((resolve, reject) => {
      this.main(this.oneOffInputs, resolve, reject);
    });;
  }

  await(callback) {
    return this.runtime.register(this, callback);
  }

  runOperation(inputs, callback, resolve, reject) {
    const errors = [];
    const missingInputs = [];
    let operation = {};

    if (this.requiredInputs !== undefined) {
      this.requiredInputs.forEach((key) => {
        if (inputs[key] == null) {
          missingInputs.push(key);
        } else {
          operation[key] = inputs[key];
        }
      });
    }
    if (missingInputs.length === 0) {
      if (this.optionalInputs !== undefined) {
        this.optionalInputs.forEach((key) => {
          operation[key] = inputs[key];
        });
      }
      try {
        // operation.result = this.execute(operation);
        operation.result = resolve(this.execute(operation));
      } catch (e) {
        operation.error = e;
        reject(e);
      }
    } else {
      errors.push(`${this.constructor.name} requires missing inputs: ${missingInputs}`);
      reject(errors);
    }
    callback(operation);
    return this;
  }

  main(inputs, resolve, reject) {
    const errors = [];
    const missingInputs = [];

    let operation = {};

    if (this.requiredInputs !== undefined) {
      this.requiredInputs.forEach((key) => {
        if (inputs[key] == null) {
          missingInputs.push(key);
        } else {
          operation[key] = inputs[key];
        }
      });
    }
    if (missingInputs.length === 0) {
      if (this.optionalInputs !== undefined) {
        this.optionalInputs.forEach((key) => {
          operation[key] = inputs[key];
        });
      }
      try {
        resolve(this.execute(operation));
      } catch (e) {
        reject(e);
      }
    } else {
      errors.push(`${this.constructor.name} requires missing inputs: ${missingInputs}`);
      reject(errors);
    }
    return this;
  }

  execute(operation) {
    console.log(`Excuting operation with parameters ${this}`);
  }
}

export { Service as default };
