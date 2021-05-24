import { setupWorker } from './setupWorker'

setupWorker().then(async (boolean) => {
  const scene = physx.createScene({})
  const bounce = await scene.getBounceThresholdVelocity()
  console.log('TEST 1:', bounce === 2)
  scene.setBounceThresholdVelocity(1)
  const bounce2 = await scene.getBounceThresholdVelocity()
  console.log('TEST 2:', bounce2 === 1)
})
