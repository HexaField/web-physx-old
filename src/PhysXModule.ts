
export class PhysXModule {

  objectsByPointer: Map<number, PhysX.Base> = new Map<number, PhysX.Base>();
  objectsByProxy: Map<number, PhysX.Base> = new Map<number, PhysX.Base>();

  constructor (physx: any) {
    globalThis.PhysX = physx
  }

  getByProxyId(id: number): PhysX.Base {
    return this.objectsByProxy.get(id)
  }

  _addNewProxyId(id: number, obj: PhysX.Base) {
    const newProxyId = id
    this.objectsByProxy.set(id, obj)
    this.objectsByPointer.set(obj.$$.ptr, obj);
    (obj as any).__proxyId = newProxyId
    return newProxyId
  }

  initialize (config: physx.SimulationOptions) {

  }

  createScene = (config: physx.SceneOptions): PhysX.PxScene => {
    const physxVersion = PhysX.PX_PHYSICS_VERSION
    const defaultErrorCallback = new PhysX.PxDefaultErrorCallback()
    const allocator = new PhysX.PxDefaultAllocator()
    const tolerance = new PhysX.PxTolerancesScale()
    tolerance.length = 0.01
    const foundation = PhysX.PxCreateFoundation(physxVersion, allocator, defaultErrorCallback)
    const cookingParamas = new PhysX.PxCookingParams(tolerance)
    const cooking = PhysX.PxCreateCooking(physxVersion, foundation, cookingParamas)
    const physics = PhysX.PxCreatePhysics(physxVersion, foundation, tolerance, false, null)

    const scale = physics.getTolerancesScale()
    const sceneDesc = PhysX.getDefaultSceneDesc(scale, 0, PhysX.PxSimulationEventCallback.implement({} as any))

    const scene = physics.createScene(sceneDesc)
    return scene
  }

  createRigidBody = (body: physx.RigidBody): number => {
    return 0
  }
}
