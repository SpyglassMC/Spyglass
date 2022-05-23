import * as core from '@spyglassmc/core'
import * as json from '@spyglassmc/json'
import * as nbt from '@spyglassmc/nbt'

const project = core.ProjectData.mock()

json.initialize(project)
nbt.initialize(project)

export const { meta } = project
