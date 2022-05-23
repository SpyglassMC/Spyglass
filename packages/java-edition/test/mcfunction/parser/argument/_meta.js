import * as json from '@spyglassmc/json'
import * as nbt from '@spyglassmc/nbt'
import { mockProjectData } from '@spyglassmc/core/test-out/utils.js'

const project = mockProjectData()

json.initialize(project)
nbt.initialize(project)

export const { meta } = project
