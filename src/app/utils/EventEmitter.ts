export class EventEmitter {
  private listeners: Record<string, Set<(args: unknown) => void> > = {};

  on(eventName: string, callBack: (args: unknown) => void) {
    console.log('on event', eventName);
    if (eventName in this.listeners) {
      this.listeners[eventName].add(callBack);
    } else {
      this.listeners[eventName] = new Set();
      this.listeners[eventName].add(callBack)
    }
  }

  emit(eventName: string, args: unknown) {
    console.log('emit called',{ eventName, listeneres: this.listeners})
    if (eventName in this.listeners) {
      console.log('callback called on ', eventName)
      this.listeners[eventName].forEach((callBack) => {
        callBack(args);
      })
    }
  }

  unsubscribe(eventName: string) {
    if (eventName in this.listeners) {
      delete this.listeners[eventName];
    }
  }
}