"""
Input:
* argv[1], root path of the data pack
* argv[2], resource location of the mcfunction
Output: stdout, the AST in JSON format
"""

import json
import sys
from beet import Context, Function, run_beet
from dataclasses import asdict
from mecha import DiagnosticError, Mecha

def parse(function: Function, ctx: Context):
	mc = ctx.inject(Mecha)
	try:
		json.dump(asdict(mc.parse(function)), sys.stdout)
	except DiagnosticError:
		pass

with run_beet({"require": ["mecha.contrib.bolt"]}) as ctx:
	ctx.data.load(sys.argv[1])
	function = ctx.data.functions.get(sys.argv[2])
	parse(function, ctx)
	sys.stdout.write("\n")
