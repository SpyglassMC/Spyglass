import { InfosOfUris, Uri } from '../../types/handlers'

export function onDidCloseTextDocument({ uri, infos }: { uri: Uri, infos: InfosOfUris }) {
    infos.delete(uri)
}
