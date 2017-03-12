'use babel';

import * as babel from 'babel-core';
import traverse from 'babel-traverse';
import * as babylon from 'babylon';
import * as t from 'babel-types';
import generate from "babel-generator";

import * as _ from 'lodash';

export default rename;

function rename(code, name){   // {selection}

  var result = {selection : []};
  var ast = babylon.parse(code, {sourceType: 'module'});

  traverse(ast, {
    'Identifier': function(path){
      if(path.node.name === name){
        result.selection.push(path.node.loc);
      }
    }
  });

  return result;
};
