namespace physx {
  function createScene (config: physx.SceneOptions): PhysX.PxScene;
  interface SimulationOptions {
    tps?: number
  
  }
  
  interface SceneOptions {
    lengthScale?: number
    bounceThresholdVelocity?: number
  }
  
  interface RigidBody {
    type: 'static' | 'dynamic' | 'kinematic'
  
  }
}