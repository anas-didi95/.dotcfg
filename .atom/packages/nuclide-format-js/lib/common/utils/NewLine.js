'use strict';

var _jscodeshift = require('jscodeshift');

var _jscodeshift2 = _interopRequireDefault(_jscodeshift);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This module helps support a hack to easily introduce new lines into the AST.
 */
var NewLine = {
  literal: '$$newline$$',
  replace: function replace(input) {
    /**
     * This regex functions by matching:
     *
     *   - contiguous new lines
     *   - non new line characters
     *   - the string "$$newline$$" and surrounding characters
     *   - non new line characters
     *   - contiguous new lines
     *
     * This way it only removes extra new lines around the explicit new lines
     * we have added in the file. It does not remove arbitrary extra new lines.
     */
    return input.replace(/(\n*[^\n]*\$\$newline\$\$[^\n]*\n*){1,}/g, '\n\n');
  },

  get statement() {
    return _jscodeshift2.default.expressionStatement(_jscodeshift2.default.literal(NewLine.literal));
  }
}; /*
    * Copyright (c) 2015-present, Facebook, Inc.
    * All rights reserved.
    *
    * This source code is licensed under the license found in the LICENSE file in
    * the root directory of this source tree.
    *
    * 
    */

module.exports = NewLine;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvTmV3TGluZS5qcyJdLCJuYW1lcyI6WyJOZXdMaW5lIiwibGl0ZXJhbCIsInJlcGxhY2UiLCJpbnB1dCIsInN0YXRlbWVudCIsImV4cHJlc3Npb25TdGF0ZW1lbnQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQVVBOzs7Ozs7QUFFQTs7O0FBR0EsSUFBTUEsVUFBVTtBQUNkQyxXQUFTLGFBREs7QUFFZEMsU0FGYyxtQkFFTkMsS0FGTSxFQUVpQjtBQUM3Qjs7Ozs7Ozs7Ozs7O0FBWUEsV0FBT0EsTUFBTUQsT0FBTixDQUFjLDBDQUFkLEVBQTBELE1BQTFELENBQVA7QUFDRCxHQWhCYTs7QUFpQmQsTUFBSUUsU0FBSixHQUFnQjtBQUNkLFdBQU8sc0JBQUtDLG1CQUFMLENBQXlCLHNCQUFLSixPQUFMLENBQWFELFFBQVFDLE9BQXJCLENBQXpCLENBQVA7QUFDRDtBQW5CYSxDQUFoQixDLENBZkE7Ozs7Ozs7Ozs7QUFxQ0FLLE9BQU9DLE9BQVAsR0FBaUJQLE9BQWpCIiwiZmlsZSI6Ik5ld0xpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG5pbXBvcnQganNjcyBmcm9tICdqc2NvZGVzaGlmdCc7XG5cbi8qKlxuICogVGhpcyBtb2R1bGUgaGVscHMgc3VwcG9ydCBhIGhhY2sgdG8gZWFzaWx5IGludHJvZHVjZSBuZXcgbGluZXMgaW50byB0aGUgQVNULlxuICovXG5jb25zdCBOZXdMaW5lID0ge1xuICBsaXRlcmFsOiAnJCRuZXdsaW5lJCQnLFxuICByZXBsYWNlKGlucHV0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIC8qKlxuICAgICAqIFRoaXMgcmVnZXggZnVuY3Rpb25zIGJ5IG1hdGNoaW5nOlxuICAgICAqXG4gICAgICogICAtIGNvbnRpZ3VvdXMgbmV3IGxpbmVzXG4gICAgICogICAtIG5vbiBuZXcgbGluZSBjaGFyYWN0ZXJzXG4gICAgICogICAtIHRoZSBzdHJpbmcgXCIkJG5ld2xpbmUkJFwiIGFuZCBzdXJyb3VuZGluZyBjaGFyYWN0ZXJzXG4gICAgICogICAtIG5vbiBuZXcgbGluZSBjaGFyYWN0ZXJzXG4gICAgICogICAtIGNvbnRpZ3VvdXMgbmV3IGxpbmVzXG4gICAgICpcbiAgICAgKiBUaGlzIHdheSBpdCBvbmx5IHJlbW92ZXMgZXh0cmEgbmV3IGxpbmVzIGFyb3VuZCB0aGUgZXhwbGljaXQgbmV3IGxpbmVzXG4gICAgICogd2UgaGF2ZSBhZGRlZCBpbiB0aGUgZmlsZS4gSXQgZG9lcyBub3QgcmVtb3ZlIGFyYml0cmFyeSBleHRyYSBuZXcgbGluZXMuXG4gICAgICovXG4gICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoLyhcXG4qW15cXG5dKlxcJFxcJG5ld2xpbmVcXCRcXCRbXlxcbl0qXFxuKil7MSx9L2csICdcXG5cXG4nKTtcbiAgfSxcbiAgZ2V0IHN0YXRlbWVudCgpIHtcbiAgICByZXR1cm4ganNjcy5leHByZXNzaW9uU3RhdGVtZW50KGpzY3MubGl0ZXJhbChOZXdMaW5lLmxpdGVyYWwpKTtcbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTmV3TGluZTtcbiJdfQ==