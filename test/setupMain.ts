// @ts-expect-error
import PHYSX from '../lib/physx.release.cjs.js'

export const setupMain = async (): Promise<void> => {
  return await new Promise<void>((resolve) => {
    PHYSX().then((physx: any) => {
      globalThis.PhysX = physx
      resolve()
    })
  })
}
