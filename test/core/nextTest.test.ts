import { setupMain } from '../setupMain'

test('Loads PhysX', async () => {
  return await setupMain().then(() => {
    expect(PhysX.PX_PHYSICS_VERSION).toBe(67174656)
  })
})
