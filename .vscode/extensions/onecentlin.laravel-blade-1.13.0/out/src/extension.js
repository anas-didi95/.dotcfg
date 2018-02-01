"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const html = require("vscode-html-languageservice");
const lst = require("vscode-languageserver-types");
const BladeFormattingEditProvider_1 = require("./providers/BladeFormattingEditProvider");
const service = html.getLanguageService();
class DocumentHighlight {
    provideDocumentHighlights(document, position, token) {
        let doc = lst.TextDocument.create(document.uri.fsPath, 'html', 1, document.getText());
        return service.findDocumentHighlights(doc, position, service.parseHTMLDocument(doc));
    }
} // DocumentHighlight
function activate(context) {
    let documentSelector = {
        language: 'blade',
        scheme: 'file'
    };
    context.subscriptions.push(vscode.languages.registerDocumentHighlightProvider(documentSelector, new DocumentHighlight));
    let bladeFormatCfg = vscode.workspace.getConfiguration('blade.format');
    if (bladeFormatCfg.get('enable')) {
        context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(documentSelector, new BladeFormattingEditProvider_1.BladeFormattingEditProvider));
        context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider(documentSelector, new BladeFormattingEditProvider_1.BladeFormattingEditProvider));
    }
    // Set html indent
    const EMPTY_ELEMENTS = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr'];
    vscode.languages.setLanguageConfiguration('blade', {
        indentationRules: {
            increaseIndentPattern: /<(?!\?|(?:area|base|br|col|frame|hr|html|img|input|link|meta|param)\b|[^>]*\/>)([-_\.A-Za-z0-9]+)(?=\s|>)\b[^>]*>(?!.*<\/\1>)|<!--(?!.*-->)|\{[^}"']*$/,
            decreaseIndentPattern: /^\s*(<\/(?!html)[-_\.A-Za-z0-9]+\b[^>]*>|-->|\})/
        },
        wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,
        onEnterRules: [
            {
                beforeText: new RegExp(`<(?!(?:${EMPTY_ELEMENTS.join('|')}))([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$`, 'i'),
                afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>$/i,
                action: { indentAction: vscode.IndentAction.IndentOutdent }
            },
            {
                beforeText: new RegExp(`<(?!(?:${EMPTY_ELEMENTS.join('|')}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`, 'i'),
                action: { indentAction: vscode.IndentAction.Indent }
            }
        ],
    });
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map