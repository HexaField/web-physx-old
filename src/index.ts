import { MessageQueue } from './utils/MessageQueue'
import type * as PhysXModule from './PhysXModule'

class _proxyState {
  messageQueue: MessageQueue
  constructor () { }
  setMessageQueue (messageQueue: MessageQueue) {
    this.messageQueue = messageQueue
  }
}

const state = new _proxyState()

const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

const generateUUID = (): string => {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)
}

let lastPromiseId
let objProxyId: number = 0;

const pipeRequest = async (isNewProxy: boolean, __physxid: number, func: string, ...args) => {
  return await new Promise<any>((resolve) => {
    const uuid = generateUUID()
    const callback = ({ detail }) => {
      state.messageQueue.removeEventListener(uuid, callback)
      resolve(detail)
    }
    state.messageQueue.addEventListener(uuid, callback)
    state.messageQueue.sendEvent('request', clone({ isNewProxy, __physxid, func: [func, ...args], uuid }))
    lastPromiseId = uuid
  })
}

const assignProxy = () => {
  return new Proxy({ __physxid: objProxyId++, } as any, {
    get: function (target: any, propKey: string) {
      if(typeof target[propKey] === 'undefined') {
        return async function (...args) {
          return await pipeRequest(false, target['__physxid'], propKey, ...args)
        }
      } else {
         return target[propKey]
       }
    }
  })
}

const assignFunction = ({ assignee, func, createProxy }) => {
  assignee[func] = (...args) => {
    if(createProxy) {
      const newProxy = assignProxy()
      pipeRequest(true, newProxy.__physxid, func, ...args)
      return newProxy
    } else {
      return pipeRequest(true, undefined, func, ...args)
    }
  }
}

class PhysXContainer {

  constructor () {
    assignFunction({ assignee: this, func: 'createScene', createProxy: true })
    assignFunction({ assignee: this, func: 'createRigidBody', createProxy: true })
  }

  _initialize = (messageQueue: MessageQueue) => {
    state.setMessageQueue(messageQueue)
  }
}

const physx = new PhysXContainer()
// @ts-expect-error
globalThis.physx = physx
export default physx

