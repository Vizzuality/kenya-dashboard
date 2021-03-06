import EventEmitter from 'eventemitter3';

const emitter = new EventEmitter();

const actions = {};
actions.toggleModal = (opened, opts = {}) => emitter.emit('toggleModal', opened, opts);
actions.setModalOptions = (opts = {}) => emitter.emit('setModalOptions', opts);

export const EE = emitter;
export default actions;
