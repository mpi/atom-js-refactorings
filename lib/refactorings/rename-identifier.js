'use babel';

import * as _ from 'lodash';
import * as babel from 'babel-core';
import traverse from 'babel-traverse';
import * as babylon from 'babylon';
import * as t from 'babel-types';
import generate from "babel-generator";

export default renameIdentifier;

function renameIdentifier(code, selection){   // {selection}

  var result = {selection : []};
  var ast = babylon.parse(code, {sourceType: 'module'});

  traverse(ast, {
    'Identifier': function(path){
      if(includes(path.node.loc, selection)){

        var scope = path.scope;

        while(!scope.bindings[path.node.name] && scope.parent){
          scope = scope.parent;
        }

        result.selection.push(scope.bindings[path.node.name].identifier.loc);
        _.each(scope.bindings[path.node.name].referencePaths, p => {
            result.selection.push(p.node.loc);
          });
      }
    }
  });

  return result;
};

function includes(range, fragment){
  return isBefore(range.start, fragment.start) && isAfter(range.end, fragment.end);
}

function isBefore(pos1, pos2){
  return (pos1.line < pos2.line) || (pos1.line === pos2.line && pos1.column <= pos2.column);
}
function isAfter(pos1, pos2){
  return isBefore(pos2, pos1);
}
