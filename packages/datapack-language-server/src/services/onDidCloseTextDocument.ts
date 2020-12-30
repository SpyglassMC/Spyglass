import { DocsOfUris, Uri } from '../types/handlers'

export function onDidCloseTextDocument({ docs, uri }: { uri: Uri, docs: DocsOfUris }) {
	docs.delete(uri)
}
