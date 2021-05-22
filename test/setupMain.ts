// @ts-ignore
import PHYSX from '../lib/physx.release.cjs.js';

export const setupMain = (): Promise<void> => {
  return new Promise<void>((resolve) => {
    PHYSX().then((physx: any) => {
      globalThis.PhysX = physx
      resolve()
    })
  })
}