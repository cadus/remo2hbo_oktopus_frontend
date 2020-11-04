import fileinput
import json
import time
import sys
from datetime import datetime
import argparse
import struct

parser = argparse.ArgumentParser(description='LifeSensor filestream replay')
parser.add_argument('-b', help="replay binary format",
                    action="count", default=0)
parser.add_argument('-d', help="debug output",
                    action="count", default=0)
parser.add_argument('file', nargs='?', help='file to replay, if omitted use stdin', default=sys.stdin)
args = parser.parse_args()

while True:
	last = 0
	postEmit = datetime.now().timestamp()
	timeSkewNeg = 0
	timeSkewPos = 0
	lines = 0
	if args.b:
		f = open(args.file,"rb")
		while True:
			b_curr = f.read(4)
			if (b_curr == b''): break
			curr, = struct.unpack("f", b_curr)
			b_length = f.read(2)
			length, = struct.unpack("H", b_length)
			b_payload = f.read(length)
			preEmit = datetime.now().timestamp()
			wait = curr - last - (preEmit-postEmit)
			if wait > 0:
					time.sleep(wait)
			sys.stdout.buffer.write(b_length + b_payload)
			if args.d:
				timestamp, value, type = struct.unpack("Qf"+ str(length-12) + "s", b_payload)
				print(length, timestamp, value, type, file=sys.stderr)
			sys.stdout.flush()
			postEmit = datetime.now().timestamp()
			timeSkew = postEmit-preEmit-wait
			if timeSkew > 0:
				timeSkewPos += timeSkew
			else:
				timeSkewNeg += timeSkew
			lines += 1
			last = curr
	else:
		for line in fileinput.input(args.file):
			obj = json.loads(line)
			curr = obj['_replay']
			del obj['_replay']
			preEmit = datetime.now().timestamp()
			wait = curr - last - (preEmit-postEmit)
			if wait > 0:
					time.sleep(wait)
			print(json.dumps(obj))
			if args.d:
				print(obj,file=sys.stderr)
			postEmit = datetime.now().timestamp()
			timeSkew = postEmit-preEmit-wait
			if timeSkew > 0:
				timeSkewPos += timeSkew
			else:
				timeSkewNeg += timeSkew
			lines += 1
			last = curr
	print(f"timeSkew error: total neg {timeSkewNeg}, total pos {timeSkewPos}, avg {(timeSkewPos-timeSkewNeg)/lines}", file=sys.stderr)
