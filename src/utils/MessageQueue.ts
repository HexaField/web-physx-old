export enum MessageType {
  ADD_EVENT,
  REMOVE_EVENT,
  EVENT,
}

export interface Message {
  messageType: MessageType | string
  message: object
  transferables: Transferable[]
}

export class EventDispatcherProxy {
  [x: string]: any;
  eventListener: any
  messageTypeFunctions: Map<MessageType | string, any>
  _listeners: any

  constructor () {
    this._listeners = {}
    this.eventListener = (args: any) => {
      this.queue.push({
        messageType: MessageType.EVENT,
        message: args
      } as Message)
    }
    this.messageTypeFunctions = new Map<MessageType | string, any>()

    this.messageTypeFunctions.set(MessageType.EVENT, (event: any) => {
      event.preventDefault = () => {}
      event.stopPropagation = () => {}
      delete event.target
      this.dispatchEvent(event, true)
    })
    // TODO: this needs to have fromSelf in the same way dispatch does
    this.messageTypeFunctions.set(MessageType.ADD_EVENT, ({ type }: { type: string }) => {
      this.addEventListener(type, this.eventListener, true)
    })
    this.messageTypeFunctions.set(MessageType.REMOVE_EVENT, ({ type }: { type: string }) => {
      this.removeEventListener(type, this.eventListener, true)
    })
  }

  once (type: string, listener: any) {
    const once = (ev: any) => {
      listener(ev)
      this.removeEventListener(type, once)
    }
    this.addEventListener(type, once)
  }

  addEventListener (type: string, listener: any, fromSelf?: boolean) {
    if (this._listeners[type] === undefined) {
      this._listeners[type] = []
    }
    if (this._listeners[type].indexOf(listener) === -1) {
      this._listeners[type].push(listener)
    }
  }

  hasEventListener (type: string, listener: any) {
    return this._listeners[type] !== undefined && this._listeners[type].indexOf(listener) !== -1
  }

  removeEventListener (type: string, listener: any, fromSelf?: boolean) {
    const listenerArray = this._listeners[type]
    if (listenerArray !== undefined) {
      const index = listenerArray.indexOf(listener)
      if (index !== -1) {
        listenerArray.splice(index, 1)
      }
    }
  }

  dispatchEvent (event: any, fromSelf?: boolean) {
    const listenerArray = this._listeners[event.type]
    if (listenerArray !== undefined) {
      const array = listenerArray.slice(0)
      for (let i = 0, l = array.length; i < l; i++) {
        array[i].call(this, event)
      }
    }
  }
}

export class MessageQueue extends EventDispatcherProxy {
  messagePort: any
  queue: Message[]
  toTransfer: Transferable[] = []
  hasStopped = false

  constructor (messagePort: any) {
    super()
    this.messagePort = messagePort
    this.queue = []

    this.messagePort.onmessage = this.receiveQueue.bind(this)
  }

  sendEvent (type: string, detail: any, transferables: Transferable[] = []) {
    this.queue.push({
      messageType: MessageType.EVENT,
      message: {
        type,
        detail
      },
      transferables
    } as Message)
  }

  sendQueue () {
    if (!this.queue?.length || this.hasStopped) return
    const messages: object[] = []
    const transferables: Transferable[] = []
    this.queue.forEach((message: Message) => {
      messages.push({
        messageType: message.messageType,
        message: message.message
      })
      transferables.push(...message.transferables)
    })
    try {
      this.messagePort.postMessage(messages, transferables)
    } catch (e) {
      console.log(e, messages, this, globalThis)
    }
    this.queue = []
  }

  receiveQueue (message: any) {
    message.data.forEach((element: Message) => {
      const { messageType, message } = element
      if (this.messageTypeFunctions.has(messageType)) {
        this.messageTypeFunctions.get(messageType)(message)
      }
    })
  }

  addEventListener (type: string, listener: (event: any) => void, fromSelf?: boolean): void {
    if (!fromSelf) {
      this.queue.push({
        messageType: MessageType.ADD_EVENT,
        message: { type },
        transferables: []
      } as Message)
    }
    super.addEventListener(type, listener)
  }

  removeEventListener (type: string, listener: (event: any) => void, fromSelf?: boolean): void {
    if (!fromSelf) {
      this.queue.push({
        messageType: MessageType.REMOVE_EVENT,
        message: { type },
        transferables: []
      } as Message)
    }
    super.removeEventListener(type, listener)
  }

  dispatchEvent (ev: any, fromSelf?: boolean): void {
    if (!fromSelf) {
      this.queue.push({
        messageType: MessageType.EVENT,
        message: ev,
        transferables: []
      } as Message)
    }
    super.dispatchEvent(ev)
  }

  dispose () {
    this.hasStopped = true
    this.messageTypeFunctions.clear()
    this._listeners = {}
  }
}
