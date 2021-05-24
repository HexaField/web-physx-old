import { createPhysXWorker } from '../src/utils/workers'

// const isWindows = process.platform === 'win32'

export const setupWorker = async (): Promise<boolean> => {
  const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' })
  return await createPhysXWorker(worker)
}
