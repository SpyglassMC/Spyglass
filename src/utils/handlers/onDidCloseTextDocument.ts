import { InfosOfUris, Uri } from '../../types/handlers'

export default function onDidCloseTextDocument({ uri, infos }: { uri: Uri, infos: InfosOfUris }) {
    infos.delete(uri)
}
