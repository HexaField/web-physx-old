import { assert } from 'chai';

import { setupMain } from '../setupMain'
import { setupWorker } from '../setupWorker'

describe(("Load PhysX"), () => {
  it('Loads PhysX', () => {
    return setupMain().then(() => {
      assert(PhysX.PX_PHYSICS_VERSION, 67174656)
    })
  })

  it('Loads PhysX in worker', () => {
    return setupWorker().then((success: boolean) => {
      assert(success, true)
    })
  })
})
