"""
Input: argv[1], root path of the data pack
Output: stdout, in format of <resource location 1>\n[<JSON object 1>]\n<resource location 2>\n[<JSON object 2>]\n...
"""

import json
import sys
import traceback
from beet import Context, Function, run_beet
from dataclasses import asdict
from mecha import Mecha

def ctx_bolt():
	with run_beet({"require": ["mecha.contrib.bolt"]}) as ctx:
		yield ctx

def parse(function: Function, ctx: Context):
	mc = ctx.inject(Mecha)
	try:
		json.dump(asdict(mc.parse(function)), sys.stdout)
	except:
		# traceback.print_exc()
		pass

for ctx in ctx_bolt():
	ctx.data.load(sys.argv[1])
	for [id, function] in ctx.data.functions.items():
		sys.stdout.write(f"{id}\n")
		parse(function, ctx)
		sys.stdout.write("\n")
