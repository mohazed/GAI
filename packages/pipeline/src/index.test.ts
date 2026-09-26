import { describe, expect, it } from 'vitest'
import { packageName } from './index.js'

describe('@gai/pipeline', () => {
  it('says hello', () => {
    expect(packageName).toBe('@gai/pipeline')
  })
})
