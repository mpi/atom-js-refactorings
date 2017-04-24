'use babel';

import * as _ from 'lodash';
import {types} from '../utils/parser';
import {selectionToNodes, generateIdentifier} from '../utils/utils';
import refactor from '../utils/diff';

export default extractFunction;

function extractFunction(code, selection){   // {selection}

  var refactoring = refactor(code);

  var codeToExtract = refactoring.traverse(selectionToNodes(selection), []);

  var insert = _.head(codeToExtract);
  var replace = _.tail(codeToExtract);

  var declaration;

  refactoring.traverse({
    'Statement|Expression': function(path){

      if(path.node === declaration){
        path.skip();

      } else if(path.node === insert){
        declaration = extractFunctionHere(path);
        path.skip();

      } else if(_.includes(replace, path.node)){
        path.remove();
      }
    }
  });

  return refactoring;

  function extractFunctionHere(path){

    var functionName = generateIdentifier(path, 'extracted');
    var call = types.identifier(functionName.name);
    var declaration = types.functionDeclaration(
      functionName, [],
      types.blockStatement(codeToExtract.length > 1 ? codeToExtract :
        [types.isExpression(codeToExtract[0]) ? types.returnStatement(codeToExtract[0]) : codeToExtract[0]]
      )
    );

    var enclosingBlock = path.findParent(function(path) { return path.isBlockStatement() || path.isProgram(); });

    path.replaceWith(types.callExpression(call, []));
    enclosingBlock.pushContainer('body', declaration);
    refactoring.select(call);
    refactoring.select(functionName);

    return declaration;
  }

};
