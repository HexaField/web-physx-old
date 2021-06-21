
export class PhysXModule {

  objectsByPointer: Map<number, PhysX.Base> = new Map<number, PhysX.Base>();
  objectsByProxy: Map<number, PhysX.Base> = new Map<number, PhysX.Base>();

  physxVersion: number;
  defaultErrorCallback: PhysX.PxDefaultErrorCallback;
  allocator: PhysX.PxDefaultAllocator;
  foundation: PhysX.PxFoundation;
  cookingParamas: PhysX.PxCookingParams;
  cooking: PhysX.PxCooking;
  physics: PhysX.PxPhysics;
  scale: PhysX.PxTolerancesScale;
  sceneDesc: PhysX.PxSceneDesc;
  scene: PhysX.PxScene;
  controllerManager: PhysX.PxControllerManager;
  obstacleContext: PhysX.PxObstacleContext;
  defaultCCTQueryCallback: PhysX.PxQueryFilterCallback;

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
    this.physxVersion = PhysX.PX_PHYSICS_VERSION;
    this.defaultErrorCallback = new PhysX.PxDefaultErrorCallback();
    this.allocator = new PhysX.PxDefaultAllocator();
    const tolerance = new PhysX.PxTolerancesScale();
    tolerance.length = 0.01;
    this.foundation = PhysX.PxCreateFoundation(this.physxVersion, this.allocator, this.defaultErrorCallback);
    this.cookingParamas = new PhysX.PxCookingParams(tolerance);
    this.cooking = PhysX.PxCreateCooking(this.physxVersion, this.foundation, this.cookingParamas);
    this.physics = PhysX.PxCreatePhysics(this.physxVersion, this.foundation, tolerance, false, null);

    const triggerCallback = {
      onContactBegin: (shapeA: PhysX.PxShape, shapeB: PhysX.PxShape) => {},
      onContactEnd: (shapeA: PhysX.PxShape, shapeB: PhysX.PxShape) => {},
      onContactPersist: (shapeA: PhysX.PxShape, shapeB: PhysX.PxShape) => {},
      onTriggerBegin: (shapeA: PhysX.PxShape, shapeB: PhysX.PxShape) => {},
      onTriggerEnd: (shapeA: PhysX.PxShape, shapeB: PhysX.PxShape) => {},
    };

    this.scale = this.physics.getTolerancesScale();
    if (config.lengthScale) {
      this.scale.length = config.lengthScale;
    }
    this.sceneDesc = PhysX.getDefaultSceneDesc(this.scale, 0, PhysX.PxSimulationEventCallback.implement(triggerCallback as any));

    this.scene = this.physics.createScene(this.sceneDesc);

    this.controllerManager = PhysX.PxCreateControllerManager(this.scene, false);
    this.obstacleContext = this.controllerManager.createObstacleContext();

    this.defaultCCTQueryCallback = PhysX.getDefaultCCTQueryFilter();
    return this.scene
  }

  createRigidBody = (body: physx.RigidBody): number => {
    return 0
  }
}
