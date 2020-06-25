import { InfosOfUris, Uri } from '../../types/handlers'

export function onDidCloseTextDocument({ }: { uri: Uri, infos: InfosOfUris }) {
    // infos.delete(uri)
}
