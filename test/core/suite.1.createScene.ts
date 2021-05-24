import { assert } from 'chai'

import { setupWorker } from '../setupWorker'

export const suite1CreateScene = () => describe(('Create scene'), () => {
  beforeEach(async () => {
    return await setupWorker()
  })

  it('can create a scene', async () => {
    const scene = physx.createScene({})
    const bounce = await scene.getBounceThresholdVelocity()
    assert.strictEqual(bounce, 2)
    scene.setBounceThresholdVelocity(1)
    const bounce2 = await scene.getBounceThresholdVelocity()
    assert.strictEqual(bounce2, 1)
  })
})
