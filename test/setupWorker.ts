import { createPhysXWorker } from '../src'

// const isWindows = process.platform === 'win32'

export const setupWorker = (): Promise<boolean> => {
  const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' })
  return createPhysXWorker(worker)
}
