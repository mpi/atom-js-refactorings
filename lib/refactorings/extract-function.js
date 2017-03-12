'use babel';

import * as _ from 'lodash';
import {generate, traverse, parse, types} from '../utils/parser';
import expandSelection from './expand-selection'

export default extractFunction;

function extractFunction(code, selection){   // {selection}

  var result = expandSelection(code, selection);

  var call = types.callExpression(types.identifier('extracted'), []);

  var declaration = types.functionDeclaration(
    types.identifier('extracted'),
    [],
    types.blockStatement(_.isArray(result.node) ?
      _.map(result.node, function(n) {return n.__clone();}) :
      [types.isExpression(result.node) ? types.returnStatement(result.node.__clone()) : result.node.__clone()]
    )
  );

  var insert = _.isArray(result.node) ? result.node[0] : result.node;
  var replace = _.tail(result.node);

  var body;

  traverse(result.ast, {
    'Statement|Expression': function(path){
      if(path.node === insert){
        body = path.findParent(function(path) { return path.isBlockStatement() || path.isProgram(); });
        result.position = _.cloneDeep(body.node.loc);
        path.replaceWith(call);
        body.pushContainer('body', declaration);
        path.skip();
      } else if(_.includes(replace, path.node)){
        path.remove();
      }
    }
  });

  result.replacement = generate(body.node).code;
  result.extractedFunction = 'extracted';

  return result;
};
