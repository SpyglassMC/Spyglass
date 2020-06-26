import { InfosOfUris, Uri } from '../../types/handlers'

export function onDidCloseTextDocument({ infos, uri }: { uri: Uri, infos: InfosOfUris }) {
    infos.delete(uri)
}
