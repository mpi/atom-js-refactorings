'use babel';

import * as babel from 'babel-core';
import traverse from 'babel-traverse';
import * as babylon from 'babylon';
import * as t from 'babel-types';

import * as _ from 'lodash';

export default expandSelection;

function expandSelection(code, selection){   // {selection}

  var result = {};

  var ast = babylon.parse(code, {sourceType: 'module'});

  traverse(ast, findEnclosingBlock(selection), undefined, result);

  var location = selection;
  var block = result.block;

  if(result.block){
    if(result.block.loc){
      location = result.block.loc;
    } else {
      var s = result.block[0];
      var e = result.block[result.block.length - 1];
      location = {start: s.loc.start, end: e.loc.end};
      block = result.block;
    }
  }

  return {
    ast: ast,
    node: block,
    selection: location
  };
};

function findEnclosingBlock(selection){

  return {
    'BlockStatement': function(path, result){

      var range = path.node.loc;
      if(includes(range, selection)){
        path.traverse(findEnclosingBlock(selection), result);
        result.block = result.block || _.filter(path.node.body, function(node){
          return overlaps(selection, node.loc);
        });
      }
    },
    'Statement|Expression': function(path, result){

      var range = path.node.loc;
      if(includes(range, selection)){
        path.traverse(findEnclosingBlock(selection), result);
        result.block = result.block || path.node;
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
