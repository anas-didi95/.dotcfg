/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 */

import type {Collection} from '../types/ast';
import type {SourceOptions} from '../options/SourceOptions';

import FirstNode from '../utils/FirstNode';
import getUndeclaredTypes from '../utils/getUndeclaredTypes';

function addMissingTypes(root: Collection, options: SourceOptions): void {
  const first = FirstNode.get(root);
  if (!first) {
    return;
  }
  const _first = first; // For flow.

  const {moduleMap} = options;
  const requireOptions = {
    sourcePath: options.sourcePath,
    typeImport: true,
  };

  getUndeclaredTypes(root, options).forEach(name => {
    const node = moduleMap.getRequire(name, requireOptions);
    _first.insertBefore(node);
  });
}

module.exports = addMissingTypes;
