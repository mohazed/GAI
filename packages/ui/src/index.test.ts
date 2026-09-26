import { describe, expect, it } from 'vitest'
import { packageName } from './index.js'

describe('@gai/ui', () => {
  it('says hello', () => {
    expect(packageName).toBe('@gai/ui')
  })
})
