import fileinput
import json
import time
import sys
from datetime import datetime

while True:
	last = 0
	postEmit = datetime.now().timestamp()
	timeSkewNeg = 0
	timeSkewPos = 0
	lines = 0
	for line in fileinput.input():
			obj = json.loads(line)
			curr = obj['_replay']
			del obj['_replay']
			preEmit = datetime.now().timestamp()
			wait = curr - last - (preEmit-postEmit)
			if wait > 0:
					time.sleep(wait)
			print(json.dumps(obj))
			postEmit = datetime.now().timestamp()
			timeSkew = postEmit-preEmit-wait
			if timeSkew > 0:
				timeSkewPos += timeSkew
			else:
				timeSkewNeg += timeSkew
			lines += 1
			last = curr
	print(f"timeSkew error: total neg {timeSkewNeg}, total pos {timeSkewPos}, avg {(timeSkewPos-timeSkewNeg)/lines}", file=sys.stderr)
