/* eslint-disable @typescript-eslint/no-var-requires */
import { receivePhysXWorker } from '../src/utils/workers'
import PHYSX from '../lib/physx.release.esm.js'
PHYSX().then(receivePhysXWorker)
