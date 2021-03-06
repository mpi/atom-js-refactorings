'use babel';

import { CompositeDisposable, Point, Range } from 'atom';
import expandSelection from './refactorings/expand-selection';
import extractFunction from './refactorings/extract-function';
import renameIdentifier from './refactorings/rename-identifier';

export default {

  subscriptions: null,

  activate(state) {

    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-js-refactorings:expand-selection': refactor(expandSelection),
      'atom-js-refactorings:extract-function': refactor(extractFunction),
      'atom-js-refactorings:rename-identifier': refactor(renameIdentifier)
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {};
  }

};

function refactor(refactoringFn){
  return () => {
    var editor = atom.workspace.getActiveTextEditor();
    var code = editor.getText();
    var selection = editor.getSelectedBufferRange();

    selection = {
      start: {line: selection.start.row + 1, column: selection.start.column},
      end: {line: selection.end.row + 1, column: selection.end.column}
    };

    var result = refactoringFn(code, selection);
    result.applyOn(editor);

    return true;
  };
}
