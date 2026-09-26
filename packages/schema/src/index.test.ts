import { describe, expect, it } from 'vitest'
import { packageName } from './index.js'

describe('@gai/schema', () => {
  it('says hello', () => {
    expect(packageName).toBe('@gai/schema')
  })
})
