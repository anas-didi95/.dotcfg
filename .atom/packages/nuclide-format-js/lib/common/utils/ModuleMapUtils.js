'use strict';

var _StringUtils = require('./StringUtils');

var _StringUtils2 = _interopRequireDefault(_StringUtils);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getIdentifiersFromPath(filePath) {
  var ids = new Set();

  var baseName = _path2.default.basename(filePath);

  // Get rid of extensions like, '.js', '.jsx', '.react.js', etc.
  var noExtensions = baseName.split('.')[0];

  // These are not valid tokens in an identifier so we have to remove them.
  var splits = noExtensions.split(/[^\w]/);

  // Just a standard identifier.
  ids.add(splits.join(''));

  // Then a camel case identifier (or possibly title case based on file name).
  var camelCaseSplits = [splits[0]];
  for (var i = 1; i < splits.length; i++) {
    camelCaseSplits.push(_StringUtils2.default.capitalize(splits[i]));
  }
  ids.add(camelCaseSplits.join(''));

  return ids;
} /*
   * Copyright (c) 2015-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the license found in the LICENSE file in
   * the root directory of this source tree.
   *
   * 
   */

function getLiteralFromPath(filePath) {
  var baseName = _path2.default.basename(filePath);
  return removeFileType(baseName);
}

function relativizeForRequire(sourcePath, destPath) {
  var relativePath = _path2.default.relative(_path2.default.dirname(sourcePath), destPath);
  var noFileType = removeFileType(relativePath);
  return !noFileType.startsWith('.') ? '.' + _path2.default.sep + noFileType : noFileType;
}

function removeFileType(str) {
  var splits = str.split('.');
  if (splits.length <= 1) {
    return str;
  } else {
    return splits.slice(0, -1).join('.');
  }
}

var ModuleMapUtils = {
  getIdentifiersFromPath: getIdentifiersFromPath,
  getLiteralFromPath: getLiteralFromPath,
  relativizeForRequire: relativizeForRequire
};

module.exports = ModuleMapUtils;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvTW9kdWxlTWFwVXRpbHMuanMiXSwibmFtZXMiOlsiZ2V0SWRlbnRpZmllcnNGcm9tUGF0aCIsImZpbGVQYXRoIiwiaWRzIiwiU2V0IiwiYmFzZU5hbWUiLCJiYXNlbmFtZSIsIm5vRXh0ZW5zaW9ucyIsInNwbGl0Iiwic3BsaXRzIiwiYWRkIiwiam9pbiIsImNhbWVsQ2FzZVNwbGl0cyIsImkiLCJsZW5ndGgiLCJwdXNoIiwiY2FwaXRhbGl6ZSIsImdldExpdGVyYWxGcm9tUGF0aCIsInJlbW92ZUZpbGVUeXBlIiwicmVsYXRpdml6ZUZvclJlcXVpcmUiLCJzb3VyY2VQYXRoIiwiZGVzdFBhdGgiLCJyZWxhdGl2ZVBhdGgiLCJyZWxhdGl2ZSIsImRpcm5hbWUiLCJub0ZpbGVUeXBlIiwic3RhcnRzV2l0aCIsInNlcCIsInN0ciIsInNsaWNlIiwiTW9kdWxlTWFwVXRpbHMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQVlBOzs7O0FBQ0E7Ozs7OztBQUVBLFNBQVNBLHNCQUFULENBQWdDQyxRQUFoQyxFQUF5RTtBQUN2RSxNQUFNQyxNQUFNLElBQUlDLEdBQUosRUFBWjs7QUFFQSxNQUFNQyxXQUFXLGVBQUtDLFFBQUwsQ0FBY0osUUFBZCxDQUFqQjs7QUFFQTtBQUNBLE1BQU1LLGVBQWVGLFNBQVNHLEtBQVQsQ0FBZSxHQUFmLEVBQW9CLENBQXBCLENBQXJCOztBQUVBO0FBQ0EsTUFBTUMsU0FBU0YsYUFBYUMsS0FBYixDQUFtQixPQUFuQixDQUFmOztBQUVBO0FBQ0FMLE1BQUlPLEdBQUosQ0FBUUQsT0FBT0UsSUFBUCxDQUFZLEVBQVosQ0FBUjs7QUFFQTtBQUNBLE1BQU1DLGtCQUFrQixDQUFDSCxPQUFPLENBQVAsQ0FBRCxDQUF4QjtBQUNBLE9BQUssSUFBSUksSUFBSSxDQUFiLEVBQWdCQSxJQUFJSixPQUFPSyxNQUEzQixFQUFtQ0QsR0FBbkMsRUFBd0M7QUFDdENELG9CQUFnQkcsSUFBaEIsQ0FBcUIsc0JBQVlDLFVBQVosQ0FBdUJQLE9BQU9JLENBQVAsQ0FBdkIsQ0FBckI7QUFDRDtBQUNEVixNQUFJTyxHQUFKLENBQVFFLGdCQUFnQkQsSUFBaEIsQ0FBcUIsRUFBckIsQ0FBUjs7QUFFQSxTQUFPUixHQUFQO0FBQ0QsQyxDQXJDRDs7Ozs7Ozs7OztBQXVDQSxTQUFTYyxrQkFBVCxDQUE0QmYsUUFBNUIsRUFBNkQ7QUFDM0QsTUFBTUcsV0FBVyxlQUFLQyxRQUFMLENBQWNKLFFBQWQsQ0FBakI7QUFDQSxTQUFPZ0IsZUFBZWIsUUFBZixDQUFQO0FBQ0Q7O0FBRUQsU0FBU2Msb0JBQVQsQ0FDRUMsVUFERixFQUVFQyxRQUZGLEVBR2dCO0FBQ2QsTUFBTUMsZUFBZSxlQUFLQyxRQUFMLENBQWMsZUFBS0MsT0FBTCxDQUFhSixVQUFiLENBQWQsRUFBd0NDLFFBQXhDLENBQXJCO0FBQ0EsTUFBTUksYUFBYVAsZUFBZUksWUFBZixDQUFuQjtBQUNBLFNBQU8sQ0FBQ0csV0FBV0MsVUFBWCxDQUFzQixHQUF0QixDQUFELEdBQ0gsTUFBTSxlQUFLQyxHQUFYLEdBQWlCRixVQURkLEdBRUhBLFVBRko7QUFHRDs7QUFFRCxTQUFTUCxjQUFULENBQXdCVSxHQUF4QixFQUE2QztBQUMzQyxNQUFNbkIsU0FBU21CLElBQUlwQixLQUFKLENBQVUsR0FBVixDQUFmO0FBQ0EsTUFBSUMsT0FBT0ssTUFBUCxJQUFpQixDQUFyQixFQUF3QjtBQUN0QixXQUFPYyxHQUFQO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsV0FBT25CLE9BQU9vQixLQUFQLENBQWEsQ0FBYixFQUFnQixDQUFDLENBQWpCLEVBQW9CbEIsSUFBcEIsQ0FBeUIsR0FBekIsQ0FBUDtBQUNEO0FBQ0Y7O0FBRUQsSUFBTW1CLGlCQUFpQjtBQUNyQjdCLGdEQURxQjtBQUVyQmdCLHdDQUZxQjtBQUdyQkU7QUFIcUIsQ0FBdkI7O0FBTUFZLE9BQU9DLE9BQVAsR0FBaUJGLGNBQWpCIiwiZmlsZSI6Ik1vZHVsZU1hcFV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge0Fic29sdXRlUGF0aCwgSWRlbnRpZmllciwgTGl0ZXJhbCwgUmVsYXRpdmVQYXRofSBmcm9tICcuLi90eXBlcy9jb21tb24nO1xuXG5pbXBvcnQgU3RyaW5nVXRpbHMgZnJvbSAnLi9TdHJpbmdVdGlscyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZnVuY3Rpb24gZ2V0SWRlbnRpZmllcnNGcm9tUGF0aChmaWxlUGF0aDogQWJzb2x1dGVQYXRoKTogU2V0PElkZW50aWZpZXI+IHtcbiAgY29uc3QgaWRzID0gbmV3IFNldCgpO1xuXG4gIGNvbnN0IGJhc2VOYW1lID0gcGF0aC5iYXNlbmFtZShmaWxlUGF0aCk7XG5cbiAgLy8gR2V0IHJpZCBvZiBleHRlbnNpb25zIGxpa2UsICcuanMnLCAnLmpzeCcsICcucmVhY3QuanMnLCBldGMuXG4gIGNvbnN0IG5vRXh0ZW5zaW9ucyA9IGJhc2VOYW1lLnNwbGl0KCcuJylbMF07XG5cbiAgLy8gVGhlc2UgYXJlIG5vdCB2YWxpZCB0b2tlbnMgaW4gYW4gaWRlbnRpZmllciBzbyB3ZSBoYXZlIHRvIHJlbW92ZSB0aGVtLlxuICBjb25zdCBzcGxpdHMgPSBub0V4dGVuc2lvbnMuc3BsaXQoL1teXFx3XS8pO1xuXG4gIC8vIEp1c3QgYSBzdGFuZGFyZCBpZGVudGlmaWVyLlxuICBpZHMuYWRkKHNwbGl0cy5qb2luKCcnKSk7XG5cbiAgLy8gVGhlbiBhIGNhbWVsIGNhc2UgaWRlbnRpZmllciAob3IgcG9zc2libHkgdGl0bGUgY2FzZSBiYXNlZCBvbiBmaWxlIG5hbWUpLlxuICBjb25zdCBjYW1lbENhc2VTcGxpdHMgPSBbc3BsaXRzWzBdXTtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBzcGxpdHMubGVuZ3RoOyBpKyspIHtcbiAgICBjYW1lbENhc2VTcGxpdHMucHVzaChTdHJpbmdVdGlscy5jYXBpdGFsaXplKHNwbGl0c1tpXSkpO1xuICB9XG4gIGlkcy5hZGQoY2FtZWxDYXNlU3BsaXRzLmpvaW4oJycpKTtcblxuICByZXR1cm4gaWRzO1xufVxuXG5mdW5jdGlvbiBnZXRMaXRlcmFsRnJvbVBhdGgoZmlsZVBhdGg6IEFic29sdXRlUGF0aCk6IExpdGVyYWwge1xuICBjb25zdCBiYXNlTmFtZSA9IHBhdGguYmFzZW5hbWUoZmlsZVBhdGgpO1xuICByZXR1cm4gcmVtb3ZlRmlsZVR5cGUoYmFzZU5hbWUpO1xufVxuXG5mdW5jdGlvbiByZWxhdGl2aXplRm9yUmVxdWlyZShcbiAgc291cmNlUGF0aDogQWJzb2x1dGVQYXRoLFxuICBkZXN0UGF0aDogQWJzb2x1dGVQYXRoLFxuKTogUmVsYXRpdmVQYXRoIHtcbiAgY29uc3QgcmVsYXRpdmVQYXRoID0gcGF0aC5yZWxhdGl2ZShwYXRoLmRpcm5hbWUoc291cmNlUGF0aCksIGRlc3RQYXRoKTtcbiAgY29uc3Qgbm9GaWxlVHlwZSA9IHJlbW92ZUZpbGVUeXBlKHJlbGF0aXZlUGF0aCk7XG4gIHJldHVybiAhbm9GaWxlVHlwZS5zdGFydHNXaXRoKCcuJylcbiAgICA/ICcuJyArIHBhdGguc2VwICsgbm9GaWxlVHlwZVxuICAgIDogbm9GaWxlVHlwZTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlRmlsZVR5cGUoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBzcGxpdHMgPSBzdHIuc3BsaXQoJy4nKTtcbiAgaWYgKHNwbGl0cy5sZW5ndGggPD0gMSkge1xuICAgIHJldHVybiBzdHI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHNwbGl0cy5zbGljZSgwLCAtMSkuam9pbignLicpO1xuICB9XG59XG5cbmNvbnN0IE1vZHVsZU1hcFV0aWxzID0ge1xuICBnZXRJZGVudGlmaWVyc0Zyb21QYXRoLFxuICBnZXRMaXRlcmFsRnJvbVBhdGgsXG4gIHJlbGF0aXZpemVGb3JSZXF1aXJlLFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb2R1bGVNYXBVdGlscztcbiJdfQ==