export type DiagnosticSeverity = 'error' | 'warning' | 'information' | 'hint'

export interface LintDiagnostic {
	file: string
	line: number
	col: number
	severity: DiagnosticSeverity
	rule: string
	message: string
}

export type ReportFormat = 'text' | 'json' | 'tap'

export interface ReportStats {
	filesScanned: number
	executionTimeMs: number
}

export interface ReportSummary {
	filesScanned: number
	violations: number
	warnings: number
	executionTimeMs: number
}

export interface ReportOutput {
	stdout: string
	stderr: string
	summary: ReportSummary
}

export function summarize(
	diagnostics: readonly LintDiagnostic[],
	stats: ReportStats,
): ReportSummary {
	return {
		filesScanned: stats.filesScanned,
		violations: diagnostics.filter(diagnostic => diagnostic.severity === 'error').length,
		warnings: diagnostics.filter(diagnostic => diagnostic.severity === 'warning').length,
		executionTimeMs: stats.executionTimeMs,
	}
}

function formatSummary(summary: ReportSummary): string {
	return `${summary.filesScanned} files scanned, ${summary.violations} violations, ${summary.warnings} warnings, ${(summary.executionTimeMs / 1_000).toFixed(2)} seconds`
}

function oneLine(value: string): string {
	return value.replace(/[\r\n]+/g, ' ').trim()
}

function formatText(diagnostics: readonly LintDiagnostic[], summary: ReportSummary): string {
	const lines = diagnostics.map(diagnostic =>
		`${diagnostic.file}:${diagnostic.line}:${diagnostic.col} [${diagnostic.severity}] ${diagnostic.rule}: ${oneLine(diagnostic.message)}`
	)
	lines.push(formatSummary(summary))
	return lines.join('\n')
}

function formatTap(diagnostics: readonly LintDiagnostic[], summary: ReportSummary): string {
	const lines = ['TAP version 13']
	for (const [index, diagnostic] of diagnostics.entries()) {
		const description = oneLine(
			`${diagnostic.file}:${diagnostic.line}:${diagnostic.col} [${diagnostic.severity}] ${diagnostic.rule}: ${diagnostic.message}`,
		).replace(/\\/g, '\\\\').replace(/#/g, '\\#')
		lines.push(`not ok ${index + 1} - ${description}`)
	}
	lines.push(diagnostics.length === 0 ? '1..0 # SKIP no diagnostics' : `1..${diagnostics.length}`)
	lines.push(`# ${formatSummary(summary)}`)
	return lines.join('\n')
}

/** Formats diagnostics without writing to process streams. */
export function report(
	diagnostics: readonly LintDiagnostic[],
	stats: ReportStats,
	format: ReportFormat = 'text',
): ReportOutput {
	const summary = summarize(diagnostics, stats)
	if (format === 'json') {
		return {
			stdout: JSON.stringify(diagnostics, undefined, 2),
			stderr: formatSummary(summary),
			summary,
		}
	}
	return {
		stdout: format === 'tap'
			? formatTap(diagnostics, summary)
			: formatText(diagnostics, summary),
		stderr: '',
		summary,
	}
}
