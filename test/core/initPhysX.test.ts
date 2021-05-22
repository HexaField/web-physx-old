// @ts-expect-error
import PHYSX from '../../lib/physx.release.cjs.js'

test('Loads PhysX', () => {
  return PHYSX().then((physx: any) => {
    globalThis.PhysX = physx
    expect(PhysX.PX_PHYSICS_VERSION).toBe(67174656)
  })
})
