import { createPhysXWorker } from '../src'
import Worker from 'web-worker'
import path from 'path'

const isWindows = process.platform === 'win32'

export const createWorker = (): void => {
  const currentPath = (isWindows ? 'file:///' : '') + path.dirname(__filename)
  const worker = new Worker(currentPath + '/physx/loadPhysXNode.ts')
  createPhysXWorker(worker)
}
