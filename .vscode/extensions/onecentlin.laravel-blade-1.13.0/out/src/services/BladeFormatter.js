"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BladeFormatter {
    constructor(options) {
        this.newLine = "\n";
        options = options || {};
        // options default value
        options.tabSize = options.tabSize || 4;
        if (typeof options.insertSpaces === "undefined") {
            options.insertSpaces = true;
        }
        this.indentPattern = (options.insertSpaces) ? " ".repeat(options.tabSize) : "\t";
    }
    format(inuptText) {
        let inComment = false;
        let output = inuptText;
        // block pattern
        let patternBlock = /(\@)(inject|extends|section|hasSection|include|push|stop)/g;
        // blade format fix
        output = output.replace(patternBlock, function (match) {
            return "\n" + match;
        });
        output = output.replace(/(\s*)\@include/g, "\n" + this.indentPattern + "@include");
        output = output.replace(/(\s*)\@endsection/g, "\n@endsection\n");
        // remove extra lines
        output = output.replace(/\n\n/g, "\n");
        return output.trim();
    }
}
exports.BladeFormatter = BladeFormatter;
//# sourceMappingURL=BladeFormatter.js.map