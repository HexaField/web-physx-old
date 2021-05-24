import physx from '..'
import { MessageQueue } from './MessageQueue'

export const createPhysXWorker = async (worker: Worker, config: any = {}): Promise<boolean> => {
  const messageQueue = new MessageQueue(worker)
  await new Promise((resolve) => {
    messageQueue.once('init', resolve)
    messageQueue.sendQueue()
  })
  messageQueue.sendEvent('config', config)
  messageQueue.sendQueue()
  physx._initialize(messageQueue)
  setInterval(() => {
    messageQueue.sendQueue()
  }, 1000 / 120)
  return true
}

export const receivePhysXWorker = async (physx: any): Promise<void> => {
  const { PhysXModule } = await import('../PhysXModule')
  const messageQueue = new MessageQueue(globalThis as any)
  const physXModule = new PhysXModule(physx)
  await new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      messageQueue.sendEvent('init', {})
      messageQueue.sendQueue()
    }, 1000)
    messageQueue.once('config', (ev: any) => {
      clearInterval(interval)
      physXModule.initialize(ev.detail)
      resolve()
    })
    messageQueue.sendQueue()
  })
  setInterval(() => {
    messageQueue.sendQueue()
  }, 1000 / 120)

  let lastCall: any = () => {}
  messageQueue.addEventListener('request', ({ detail }) => {
    let returnValue
    const [func, ...args] = detail.func
    try {
      let objToCall
      if (typeof detail.__physxid === 'number' && typeof physXModule.getByProxyId(detail.__physxid) !== 'undefined') {
        objToCall = physXModule.getByProxyId(detail.__physxid)
      } else {
        objToCall = physXModule
      }
      if(typeof objToCall !== 'undefined' && typeof objToCall[func] === 'function') {
        returnValue = objToCall[func](...args)
      }
      if(detail.isNewProxy) {
        physXModule._addNewProxyId(detail.__physxid, returnValue)
      }
    } catch (e) {
      console.error('[web-physx]: Failed to run function:', e, detail)
    }
    messageQueue.sendEvent(detail.uuid, returnValue)
  })
}
