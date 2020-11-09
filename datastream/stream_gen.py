import wfdb
import numpy as np
import scipy
import scipy.signal
import argparse
import sys
import random
import json
import struct

parser = argparse.ArgumentParser(description='LifeSensor filestream generator')
parser.add_argument('-i', metavar='<path>', nargs='+', required=True, help='data to import')
parser.add_argument('-s', metavar='<path>/<signal>', required=True,
                    nargs='+', help='signals to export')
parser.add_argument('-t', metavar='<timescale>', default=1.0,
                    type=float, help='timing scale factor (=1:untouched, <1:slower, >1:faster)')
parser.add_argument('-m', metavar='<seconds>',
                    type=float, help='stop after this amount of time')
parser.add_argument('-d', metavar='<timevariation>', type=float,
                    default=0.0, help='maximum delay factor relative to sampling rate of input (=0:none, >0:delayed, >1:unordered)')
parser.add_argument('-rs', metavar='<path>/<signal>:<samples per sec>', nargs='*',
                    default=[], help='resample input data')
parser.add_argument('-r', metavar='<path>/<signal>:<name>',
                    nargs='*', default=[], help='rename <signal> to <name>')
parser.add_argument('-b', help="generate binary output", action="count", default=0)

args = parser.parse_args()

print(f"Arguments: {args}",file=sys.stderr)
timing = {}

rename = {}
for r in args.r:
    old, new = r.split(':')
    rename[old] = new

resample = {}
for rs in args.rs:
    name,rate = rs.split(':')
    resample[name] = float(rate)

for path in args.i:
    print(f"opening file '{path}'",file=sys.stderr)
    signals, fields = wfdb.rdsamp(path)
    print(f"Meta data of '{path}': {fields}",file=sys.stderr)
    print("Generating data",file=sys.stderr)
    for index_sig in range(len(fields['sig_name'])):
        name = fields['sig_name'][index_sig]
        fullname = f"{path}/{name}"
        if fullname in args.s:
            rate = fields['fs'] if fullname not in resample else resample[fullname]
            fulltime = args.m if args.m else signals[:, index_sig].shape[0]/rate
            samples = signals[0:int(rate*fulltime), index_sig] if fullname not in resample else scipy.signal.resample(
                signals[0:int(fields['fs']*fulltime), index_sig], int(rate * fulltime))
            for index_beat in range(samples.shape[0]):
                time = (index_beat/rate) * args.t
                if args.m and  time > args.m:
                    break
                time_ms = int(time*1000)
                delay = random.random() * args.d / rate
                value = samples[index_beat]
                name = rename.get(f"{path}/{name}", name)
                event = {"type":name, "timestamp":time_ms, "value":value, "no":index_beat, "_replay":time+delay}
                timing.setdefault(time + delay, {}).setdefault(name,[]).append(event)


times = list(timing.keys())
times.sort()

for time in times:
    for sig, vals in timing[time].items():
        for val in vals:
            if args.b:
                payload = struct.pack("Qf", val["timestamp"], val["value"]) + val["type"].encode('utf-8') + b'\0\n'
                length  = struct.pack("H", len(payload))
                replay  = struct.pack("f", val["_replay"])
                sys.stdout.buffer.write(replay+length+payload)
            else:
                print(json.dumps(val))
