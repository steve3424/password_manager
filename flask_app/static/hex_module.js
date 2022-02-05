function BytesToHexString(bytes) {
    return [...new Uint8Array(bytes)].map(x => x.toString(16).padStart(2,'0')).join("");
}

function HexStringToBytes(hex) {
    var bytes = [];
    for (var c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return new Uint8Array(bytes);
}