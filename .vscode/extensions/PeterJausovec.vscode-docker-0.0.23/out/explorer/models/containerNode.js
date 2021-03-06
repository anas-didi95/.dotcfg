"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const nodeBase_1 = require("./nodeBase");
const utils_1 = require("../utils/utils");
class ContainerNode extends nodeBase_1.NodeBase {
    constructor(label, contextValue, iconPath = {}) {
        super(label);
        this.label = label;
        this.contextValue = contextValue;
        this.iconPath = iconPath;
    }
    getTreeItem() {
        let displayName = this.label;
        if (vscode.workspace.getConfiguration('docker').get('truncateLongRegistryPaths', false)) {
            if (/\//.test(displayName)) {
                let parts = this.label.split(/\//);
                displayName = utils_1.trimWithElipsis(parts[0], vscode.workspace.getConfiguration('docker').get('truncateMaxLength', 10)) + '/' + parts[1];
            }
        }
        return {
            label: `${displayName}`,
            collapsibleState: vscode.TreeItemCollapsibleState.None,
            contextValue: this.contextValue,
            iconPath: this.iconPath
        };
    }
}
exports.ContainerNode = ContainerNode;
//# sourceMappingURL=containerNode.js.map