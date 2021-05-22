/* eslint-disable @typescript-eslint/no-var-requires */
import { receiveWorker } from '../'
const PHYSX = require('../../lib/physx.release.cjs.js')
PHYSX().then(receiveWorker)
