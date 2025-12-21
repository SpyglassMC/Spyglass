export function inject() {
	;(<any> BigInt.prototype).toJSON = function() {
		return (<any> JSON).rawJSON(this.toString())
	}
}
