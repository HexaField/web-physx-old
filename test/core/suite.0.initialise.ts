import { assert } from 'chai'

import { setupMain } from '../setupMain'
import { setupWorker } from '../setupWorker'

export const suite0Initialise = () => describe(('Load PhysX'), () => {
  it('Loads PhysX', async () => {
    return await setupMain().then(() => {
      assert.strictEqual(PhysX.PX_PHYSICS_VERSION, 67174656)
    })
  })

  it('Loads PhysX in worker', async () => {
    return await setupWorker().then((success: boolean) => {
      assert.strictEqual(success, true)
    })
  })
})
