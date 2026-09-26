import { describe, expect, it } from 'vitest'
import { packageName } from './index.js'

describe('@gai/widget', () => {
  it('says hello', () => {
    expect(packageName).toBe('@gai/widget')
  })
})
