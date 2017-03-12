'use babel';

import * as _ from 'lodash';
import {traverse, parse} from '../utils/parser';

export default rename;

function rename(code, name){   // {selection}

  var result = {selection : []};
  var ast = parse(code);

  traverse(ast, {
    'Identifier': function(path){
      if(path.node.name === name){
        result.selection.push(path.node.loc);
      }
    }
  });

  return result;
};
