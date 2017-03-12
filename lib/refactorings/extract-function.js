'use babel';

import * as babel from 'babel-core';
import traverse from 'babel-traverse';
import * as babylon from 'babylon';
import * as t from 'babel-types';
import generate from "babel-generator";

import expandSelection from './expand-selection'

import * as _ from 'lodash';

export default extractFunction;

function extractFunction(code, selection){   // {selection}

  var result = expandSelection(code, selection);

  var call = t.callExpression(t.identifier('extracted'), []);

  var declaration = t.functionDeclaration(
    t.identifier('extracted'),
    [],
    t.blockStatement(_.isArray(result.node) ?
      _.map(result.node, function(n) {return n.__clone();}) :
      [t.isExpression(result.node) ? t.returnStatement(result.node.__clone()) : result.node.__clone()]
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
