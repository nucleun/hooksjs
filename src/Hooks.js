export default class Hooks {
  constructor(subject) {
    subject.$pre = {};
    subject.$post = {};
    this.subject = subject;
  }

  pre(type, callback) {
    if (!this.subject.$pre[type]) {
      this.subject.$pre[type] = [];
      this._wrap(this.subject[type], type);
    }

    this.subject.$pre[type].push(callback);

    return this;
  }

  post(type, callback) {
    if (!this.subject.$post[type]) {
      this.subject.$post[type] = [];
      this.subject[type] = this._wrap(this.subject[type], type);
    }

    this.subject.$post[type].push(callback);

    return this;
  }

  _trigger(type, action) {
    (this.subject[type][action] || []).forEach((hook) => {
      hook.call(this.subject[type][action], [].slice.call(arguments, 2));
    });
  }

  _wrap(fn, type) {
    const self = this;

    return function () {
      self._trigger('$pre', type);
      fn.apply(fn, [].slice.call(arguments));
      self._trigger('$post', type);
    };
  }
}
