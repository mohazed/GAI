import { describe, expect, it } from 'vitest'
import { packageName } from './index.js'

describe('@gai/web', () => {
  it('says hello', () => {
    expect(packageName).toBe('@gai/web')
  })
})
