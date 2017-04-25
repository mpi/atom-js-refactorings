'use babel';

import * as _ from 'lodash';
import {types, generate} from '../utils/parser';
import {selectionToNodes, generateIdentifier} from '../utils/utils';
import refactor from '../utils/diff';

export default extractVariable;

function extractVariable(code, selection){

  var refactoring = refactor(code);
  var expression = extractedExpression(selection);

  refactoring.traverse({
    Expression: function (path) {
      if (expression === path.node) {
        extractVariableHere(path);
        refactoring.done();
      }
    }
  });
  return refactoring;

  function extractedExpression(selection) {
    var codeToExtract = refactoring.traverse(selectionToNodes(selection), []);
    var expression = codeToExtract[0];

    if (types.isExpressionStatement(expression)) {
      return expression.expression;
    }
    return expression;
  }

  function extractVariableHere(path){

    var definition = generateIdentifier(path, 'extracted');
    var declaration = types.variableDeclaration('var', [types.variableDeclarator(definition, expression)]);

    if (path.parentPath.isStatement()) {
      insertDeclarationInline();
    } else {
      insertDeclarationBefore();
    }
    extractVariableHere.handled = true;

    function insertDeclarationInline(){
      path.parentPath.replaceWith(declaration);
      refactoring.select(definition);
    }

    function insertDeclarationBefore() {
      var statement = path.findParent(function (path) {
        return path.isStatement();
      });
      var usage = types.identifier(definition.name);
      path.replaceWith(usage);
      statement.insertBefore(declaration);
      refactoring.select(usage);
      refactoring.select(definition);
    }
  }
};
