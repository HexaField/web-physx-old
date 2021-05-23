import { MessageQueue } from './utils/MessageQueue'

export const createPhysXWorker = async (worker: Worker, config: any = {}): Promise<boolean> => {
  const messageQueue = new MessageQueue(worker)
  await new Promise((resolve) => {
    messageQueue.once('init', resolve)
    messageQueue.sendQueue()
  })
  messageQueue.sendEvent('config', config)
  messageQueue.sendQueue()
  return true;
}

export const receivePhysXWorker = async (physx: any): Promise<void> => {
  const { PhysXModule } = await import('./PhysXModule')
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
}
