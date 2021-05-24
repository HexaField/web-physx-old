import { setupWorker } from './setupWorker'
import physx from '../'

setupWorker().then(async (boolean) => {
  const scene = physx.createScene({})
  const bounce = await scene.getBounceThresholdVelocity()
  console.log(bounce)
})
