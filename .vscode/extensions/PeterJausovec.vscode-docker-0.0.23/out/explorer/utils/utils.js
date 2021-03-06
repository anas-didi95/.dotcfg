"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function trimWithElipsis(str, max = 10) {
    const elipsis = "...";
    const len = str.length;
    if (max <= 0 || max >= 100)
        return str;
    if (str.length <= max)
        return str;
    if (max < 3)
        return str.substr(0, max);
    const front = str.substr(0, (len / 2) - (-0.5 * (max - len - 3)));
    const back = str.substr(len - (len / 2) + (-0.5 * (max - len - 3)));
    return front + elipsis + back;
}
exports.trimWithElipsis = trimWithElipsis;
//# sourceMappingURL=utils.js.map