'use babel';

import _ from 'lodash';
import {types} from './parser';


var utils = {
  generateIdentifier: generateIdentifier,
  selectionToNodes: findEnclosingBlock
};

export default utils;

function generateIdentifier(path, name){

  var scope = path.scope;
  var uid;
  var i = 0;

  do {
    uid = name + (i ? i : '');
    i++;
  } while (scope.hasLabel(uid) || scope.hasBinding(uid) || scope.hasGlobal(uid) || scope.hasReference(uid));

  return types.identifier(uid);
}

function findEnclosingBlock(selection, force){

  return {
    'Statement|Expression': function(path, nodes){

      var range = path.node.loc;
      if(includes(range, selection)){
        path.traverse(findEnclosingBlock(selection, force), nodes);
        if(!_.isEmpty(nodes)){
          return;
        }

        if(path.isBlockStatement()){
          _.chain(path.node.body)
           .filter(node => overlaps(selection, node.loc))
           .each(node => nodes.push(node))
           .value();
        }
        if(_.isEmpty(nodes)){
          nodes.push(path.node);
        }
      }
    }
  };

}

function includes(range, fragment){
  return isBefore(range.start, fragment.start) && isAfter(range.end, fragment.end);
}

function isBefore(pos1, pos2){
  return (pos1.line < pos2.line) || (pos1.line === pos2.line && pos1.column <= pos2.column);
}
function isAfter(pos1, pos2){
  return isBefore(pos2, pos1);
}
function overlaps(range1, range2){
  return !(isBefore(range1.end, range2.start) || isAfter(range1.start, range2.end));
}
