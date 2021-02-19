exports['TextDocuments getOrRead() Should construct the TextDocument from parameters 1'] = {
  "_uri": "file:///foo.mcfunction",
  "_languageId": "mcfunction",
  "_version": 5,
  "_content": "Some content passed through parameter\n",
  "uri": "file:///foo.mcfunction",
  "languageId": "mcfunction",
  "version": 5,
  "lineCount": 2
}

exports['TextDocuments getOrRead() Should construct the TextDocument from the actual file 1'] = {
  "_uri": "file:///foo.mcfunction",
  "_languageId": "mcfunction",
  "_version": 0,
  "_content": "# foo\n",
  "uri": "file:///foo.mcfunction",
  "languageId": "mcfunction",
  "version": 0,
  "lineCount": 2
}

exports['TextDocuments getOrRead() Should return the cached result 1'] = {
  "_uri": "file:///foo.mcfunction",
  "_languageId": "mcfunction",
  "_version": 3,
  "_content": "# foo\n",
  "uri": "file:///foo.mcfunction",
  "languageId": "mcfunction",
  "version": 3,
  "lineCount": 2
}

exports['TextDocuments getOrRead() Should throw an error if the URI doesn\'t exist 1'] = `
Path not exists: '\\nonexistent.mcfunction'
`

exports['TextDocuments onDidChange() Should throw an error if the file hasn\'t been opened yet 1'] = `
There is no TextDocument corresponding to 'file:///foo.mcfunction'
`

exports['TextDocuments onDidOpen(), onDidChange(), onDidClose(), get() Should handle a cycle of file operations correctly 1'] = {
  "_uri": "file:///foo.mcfunction",
  "_languageId": "mcfunction",
  "_version": 0,
  "_content": "# foo\n",
  "uri": "file:///foo.mcfunction",
  "languageId": "mcfunction",
  "version": 0,
  "lineCount": 2
}

exports['TextDocuments onDidOpen(), onDidChange(), onDidClose(), get() Should handle a cycle of file operations correctly 2'] = {
  "_uri": "file:///foo.mcfunction",
  "_languageId": "mcfunction",
  "_version": 1,
  "_content": "# foobar\n",
  "_lineOffsets": [
    0,
    9
  ],
  "uri": "file:///foo.mcfunction",
  "languageId": "mcfunction",
  "version": 1,
  "lineCount": 2
}
