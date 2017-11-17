/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 */

import type {Collection, NodePath} from '../types/ast';
import type {SourceOptions} from '../options/SourceOptions';

import getDeclaredIdentifiers from '../utils/getDeclaredIdentifiers';
import getNonDeclarationIdentifiers from '../utils/getNonDeclarationIdentifiers';
import hasOneRequireDeclaration from '../utils/hasOneRequireDeclaration';
import isGlobal from '../utils/isGlobal';
import jscs from 'jscodeshift';

function removeUnusedRequires(
  root: Collection,
  options: SourceOptions,
): void {
  const used = getNonDeclarationIdentifiers(root, options);
  const nonRequires = getDeclaredIdentifiers(
    root,
    options,
    [path => !hasOneRequireDeclaration(path.node)],
  );

  jscs.types.visit(root.nodes()[0], {
    visitVariableDeclaration(path) {
      if (isGlobal(path) && hasOneRequireDeclaration(path.node)) {
        pruneNames(path, used, nonRequires);
      }
      // don't traverse this path, there cannot be a toplevel
      // declaration inside of it
      return false;
    },
  });
}

// Similar to `getNamesFromID`
function pruneNames(path: NodePath, used: Set<string>, nonRequires: Set<string>): Set<string> {
  const node = path.node;
  const ids = new Set();
  if (jscs.Identifier.check(node)) {
    ids.add(node.name);
  } else if (
    jscs.RestElement.check(node) ||
    jscs.SpreadElement.check(node) ||
    jscs.SpreadProperty.check(node) ||
    jscs.RestProperty.check(node)
  ) {
    for (const id of pruneNames(path.get('argument'), used, nonRequires)) {
      ids.add(id);
    }
  } else if (jscs.Property.check(node) || jscs.ObjectProperty.check(node)) {
    for (const id of pruneNames(path.get('value'), used, nonRequires)) {
      ids.add(id);
    }
  } else if (jscs.ObjectPattern.check(node)) {
    const properties = path.get('properties');
    for (let i = node.properties.length - 1; i >= 0; i--) {
      const propPath = properties.get(i);
      for (const id of pruneNames(propPath, used, nonRequires)) {
        ids.add(id);
      }
    }
  } else if (jscs.ArrayPattern.check(node)) {
    const elements = path.get('elements');
    for (let i = node.elements.length - 1; i >= 0; i--) {
      for (const id of pruneNames(elements.get(i), used, nonRequires)) {
        ids.add(id);
      }
    }
  } else if (jscs.VariableDeclaration.check(node)) {
    const idPath = path.get('declarations').get(0).get('id');
    for (const id of pruneNames(idPath, used, nonRequires)) {
      ids.add(id);
    }
  }

  for (const name of ids) {
    if (used.has(name) && !nonRequires.has(name)) {
      return ids;
    }
  }
  path.prune();

  return ids;
}

module.exports = removeUnusedRequires;
