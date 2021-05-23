import { assert } from 'chai';

import { setupMain } from '../setupMain'
import { setupWorker } from '../setupWorker'

describe(("Load PhysX"), () => {
  it('Loads PhysX', async () => {
    return await setupMain().then(() => {
      assert(PhysX.PX_PHYSICS_VERSION, 67174656)
    })
  })

  it('Loads PhysX in worker', async () => {
    return await setupWorker().then((success: boolean) => {
      assert(success, true)
    })
  })
})
