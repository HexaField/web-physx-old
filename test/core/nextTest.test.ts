import { setupMain } from "../setupMain";

test('Loads PhysX', () => {
  return setupMain().then(() => {
    expect(PhysX.PX_PHYSICS_VERSION).toBe(67174656);
  })
});