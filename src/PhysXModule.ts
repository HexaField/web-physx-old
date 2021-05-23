export class PhysXModule {
  constructor (physx: any) {
    (globalThis as any).PhysX = physx
  }

  initialize (config: any = {}): void {
    console.log('config', config)
  }
}
