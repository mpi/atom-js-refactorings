'use babel';

import * as _ from 'lodash';
import test from './test-utils';
import '../lib/atom-js-refactorings';

describe('Atom Javascript Refactorings Package', () => {

  let workspace, packageActivation, editorOpening;

  beforeEach(() => {
    workspace = atom.views.getView(atom.workspace);
    packageActivation = atom.packages.activatePackage('atom-js-refactorings');
    editorOpening = atom.workspace.open();
  });

  describe('after TextEditor is opened', () => {

    let editor;

    describe('provides extract-function refactoring', () => {

      var testCase = fromDir('extract-function');

      testCase('simple.js');
      testCase('global.js');
      testCase('block.js');
      testCase('expression-statement.js');
      testCase('expression.js');
      testCase('import.js');
      testCase('already-taken-identifier.js');
      // testCase('comment.js');
    });

    fdescribe('provides extract-variable refactoring', () => {

      var testCase = fromDir('extract-variable');

      testCase('string-literal.js');
      testCase('arithmetic-expression.js');
      testCase('function-invocation.js');
      testCase('block-with-one-expression.js');
    });

    describe('provides expand-selection capability', () => {

      var testCase = fromDir('expand-selection');

      testCase('block.js');
      testCase('block-expand.js');
    });

    describe('provides rename-identifier refactoring', () => {

      var testCase = fromDir('rename-identifier');

      testCase('variable.js');
      testCase('function.js');
      testCase('function-usage.js');
      testCase('recursive-function.js');
    });

    beforeEach(() => {
      waitsForPromise(() => packageActivation);
      waitsForPromise(() => editorOpening.then(e => editor = e));
    });

    function runTestCase(){

      var name = _.toArray(arguments).join('/');

      it(name, () => {

        // given:
        var t = test.loadTestCase('./fixtures/' + name);
        t.setupEditor(editor);

        // when:
        performRefactoring(t.command);

        // then:
        test.compareEditors(t.expectedEditor(), editor);
      });
    }

    function fromDir(dir){
      return _.partial(runTestCase, dir);
    }

    function performRefactoring(refactoring){
      atom.commands.dispatch(workspace, 'atom-js-refactorings:' + refactoring);
    }

  });
});
