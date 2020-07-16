import { DocsOfUris, Uri } from '../types/handlers'

export function onDidCloseTextDocument({ infos, uri }: { uri: Uri, infos: DocsOfUris }) {
    infos.delete(uri)
}
