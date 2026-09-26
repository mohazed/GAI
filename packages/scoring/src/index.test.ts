import { describe, expect, it } from 'vitest'
import { packageName } from './index.js'

describe('@gai/scoring', () => {
  it('says hello', () => {
    expect(packageName).toBe('@gai/scoring')
  })
})
