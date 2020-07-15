import { ClientCapabilities, VersionInformation } from '../types'

class LanguageService {
    protected readonly capabilities: ClientCapabilities
    protected readonly versionInformation: VersionInformation

    constructor(options: {
        capabilities: ClientCapabilities,
        versionInformation: VersionInformation
    }) {
        this.capabilities = options.capabilities
        this.versionInformation = options.versionInformation
    }
}

export class McfunctionLanguageService extends LanguageService {

}

export class DatapackJsonLanguageService extends LanguageService {
    
}
