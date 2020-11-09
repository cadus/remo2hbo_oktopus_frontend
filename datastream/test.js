console.log("start");
console.log(process.stdin.isPaused());

currLength = undefined;
process.stdin.on('readable', () => {
    console.log("readable")
    while (true) {
        currLength = process.stdin.read(2)?.readInt16LE();
        if (currLength === undefined) return;
        console.log(currLength)
        const buf = process.stdin.read(currLength);
        if (buf === null) return;
        const timestamp = buf.readBigUInt64LE(0);
        const value = buf.readFloatLE(8);
        const string = buf.toString('utf-8', 12, currLength - 2);
        currLength = undefined
        console.log(timestamp, string, value)
    }
});

process.stdin.resume();
