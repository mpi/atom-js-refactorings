'use babel';

import * as _ from 'lodash';
import refactor from '../utils/diff';

export default introduceParameter;

function introduceParameter(code, selection){   // {selection}

  var refactoring = refactor(code);

  refactoring.traverse({
    'Identifier': function(path){
      if(includes(path.node.loc, selection)){

        var scope = path.scope;

        while(!scope.bindings[path.node.name] && scope.parent){
          scope = scope.parent;
        }

        var binding = scope.bindings[path.node.name];
        refactoring.select(binding.identifier);
        _.each(binding.referencePaths, p => {
          refactoring.select(p.node);
        });
      }
    }
  });

  return refactoring;
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
