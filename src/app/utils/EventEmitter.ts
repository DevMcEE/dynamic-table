export class EventEmitter {
  private listeners: Record<string, Set<(args: unknown) => void> > = {};

  on(eventName: string, callBack: (args: unknown) => void) {
    // console.log('called on ', eventName)
    if (eventName in this.listeners) {
      this.listeners[eventName].add(callBack);
    } else {
      this.listeners[eventName] = new Set();
      this.listeners[eventName].add(callBack)
    }
  }

  emit(eventName: string, args: unknown) {
    console.log('emit called',{ eventName })
    if (eventName in this.listeners) {
      this.listeners[eventName].forEach((callBack) => {
        callBack(args);
      })
    }
  }

  unsubscribe(eventName: string) {
    // console.log('called unsubsribe from ', eventName)

    if (eventName in this.listeners) {
      delete this.listeners[eventName];
    }
  }
}