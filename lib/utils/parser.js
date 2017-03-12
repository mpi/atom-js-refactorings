'use babel';

import traverse from 'babel-traverse';
import generate from 'babel-generator';
import * as babylon from 'babylon';
import * as types from 'babel-types';

var adapter = {
  parse: function(code){
    return babylon.parse(code, {sourceType: 'module'});
  },
  traverse: traverse,
  generate: generate,
  types: types
};

export default adapter;
