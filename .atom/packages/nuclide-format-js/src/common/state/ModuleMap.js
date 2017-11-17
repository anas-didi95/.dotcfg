/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 */

import type {AbsolutePath, Identifier, Literal} from '../types/common';
import type {ModuleMapOptions} from '../options/ModuleMapOptions';
import type {RequireOptions} from '../options/RequireOptions';

import ModuleMapUtils from '../utils/ModuleMapUtils';
import Options from '../options/Options';
import jscs from 'jscodeshift';
import oneLineObjectPattern from '../utils/oneLineObjectPattern';

const {statement} = jscs.template;

class ModuleMap {
  // Note: These fields are ordered by precendence.

  /**
   * Identifiers that should be ignored when not a type.
   */
  _builtIns: Set<Identifier>;
  /**
   * Identifiers that should be ignored when they are a type.
   */
  _builtInTypes: Set<Identifier>;
  /**
   * Identifiers that have an exact alias to use.
   */
  _aliases: Map<Identifier, Literal>;
  /**
   * Identifiers that have an exact path to use.
   */
  _aliasesToRelativize: Map<Identifier, AbsolutePath>;
  /**
   * Identifiers that might correspond to the default export of a particular
   * literal.
   */
  _defaults: Map<Identifier, Set<Literal>>;
  /**
   * Identifiers that might correspond to the default export of a particular
   * absolute path.
   */
  _defaultsToRelativize: Map<Identifier, Set<AbsolutePath>>;

  constructor(options: ModuleMapOptions) {
    Options.validateModuleMapOptions(options);

    // Note: If someone maintains a reference to the structure within options
    // they could mutate the ModuleMap's behavior. We could make shallow copies
    // here but are opting not to for performance.
    this._builtIns = options.builtIns;
    this._builtInTypes = options.builtInTypes;
    this._aliases = options.aliases;
    this._aliasesToRelativize = options.aliasesToRelativize;

    // TODO: Use let for proper scoping.
    let id;
    let ids;
    let filePath;
    let set;

    this._defaults = new Map();
    for (filePath of options.paths) {
      ids = ModuleMapUtils.getIdentifiersFromPath(filePath);
      const literal = ModuleMapUtils.getLiteralFromPath(filePath);
      for (id of ids) {
        set = this._defaults.get(id);
        if (!set) {
          set = new Set();
          this._defaults.set(id, set);
        }
        set.add(literal);
      }
    }

    this._defaultsToRelativize = new Map();
    for (filePath of options.pathsToRelativize) {
      ids = ModuleMapUtils.getIdentifiersFromPath(filePath);
      for (id of ids) {
        set = this._defaultsToRelativize.get(id);
        if (!set) {
          set = new Set();
          this._defaultsToRelativize.set(id, set);
        }
        set.add(filePath);
      }
    }
  }

  /**
   * Gets a single require, this isn't great for when you want to destructure
   * multiple things in a single statement.
   *
   * TODO: add a getRequires() that consolidates automatically, or add a
   * specific consolidate step as part of the transform.
   */
  getRequire(id: Identifier, options: RequireOptions): ?Node {
    Options.validateRequireOptions(options);

    // Don't import built ins.
    if (!options.typeImport) {
      if (this._builtIns.has(id)) {
        return null;
      }
    } else {
      if (this._builtInTypes.has(id)) {
        return null;
      }
    }

    // TODO: Use let for proper scoping.
    let literal;
    let tmp;

    if (this._aliases.has(id)) {
      literal = this._aliases.get(id);
    } else if (options.sourcePath && this._aliasesToRelativize.has(id)) {
      literal = ModuleMapUtils.relativizeForRequire(
        options.sourcePath,
        // $FlowFixMe(kad)
        this._aliasesToRelativize.get(id),
      );
    } else if (
      this._defaults.has(id) &&
      // $FlowFixMe(kad)
      this._defaults.get(id).size === 1
    ) {
      // TODO: What's the best way to get the single thing out of a one element
      // Set?
      // $FlowFixMe(kad)
      for (tmp of this._defaults.get(id)) {
        literal = tmp;
        break;
      }
    } else if (
      options.sourcePath &&
      this._defaultsToRelativize.has(id) &&
      // $FlowFixMe(kad)
      this._defaultsToRelativize.get(id).size === 1
    ) {
      const nonNullSourcePath = options.sourcePath;
      // TODO: What's the best way to get the single thing out of a one element
      // Set?
      // $FlowFixMe(kad)
      for (const filePath of this._defaultsToRelativize.get(id)) {
        literal = ModuleMapUtils.relativizeForRequire(
          nonNullSourcePath,
          filePath,
        );
        break;
      }
    } else if (options.jsxSuffix) {
      literal = id + '.react';
    } else {
      // TODO: Make this configurable so that it's possible to only add known
      // requires and ignore unknown modules.
      literal = id;
    }

    // Create common nodes for printing.
    const idNode = jscs.identifier(id);
    const literalNode = jscs.literal(literal);

    // TODO: Support exports and destructuring.
    const destructure = false;

    if (destructure && options.typeImport) {
      // import type {foo} from 'foo';
      tmp = statement`import type {_} from '_';\n`;
      tmp.specifiers[0].imported = idNode;
      tmp.specifiers[0].local = idNode;
      tmp.source = literalNode;
      return tmp;
    } else if (!destructure && options.typeImport) {
      // import type foo from 'foo';
      tmp = statement`import type _ from '_';\n`;
      tmp.specifiers[0].id = idNode;
      tmp.specifiers[0].local = idNode;
      tmp.source = literalNode;
      return tmp;
    } else if (destructure && !options.typeImport) {
      // var {foo} = require('foo');
      const property = jscs.property('init', idNode, idNode);
      property.shorthand = true;
      return jscs.variableDeclaration(
        'const',
        [jscs.variableDeclarator(
          oneLineObjectPattern(jscs.objectPattern([property])),
          jscs.callExpression(
            jscs.identifier('require'),
            [literalNode],
          ),
        )],
      );
    } else if (!destructure && !options.typeImport) {
      // var foo = require('foo');
      return jscs.variableDeclaration(
        'const',
        [jscs.variableDeclarator(
          idNode,
          jscs.callExpression(
            jscs.identifier('require'),
            [literalNode],
          ),
        )],
      );
    }

    // Can't handle this type of require yet.
    return null;
  }

  getBuiltIns(): Set<Identifier> {
    return this._builtIns;
  }

  getBuiltInTypes(): Set<Identifier> {
    return this._builtInTypes;
  }
}

module.exports = ModuleMap;
