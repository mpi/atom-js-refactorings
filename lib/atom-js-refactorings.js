'use babel';

import { CompositeDisposable, Point, Range } from 'atom';
import expandSelection from './refactorings/expand-selection';
import extractFunction from './refactorings/extract-function';
import rename from './refactorings/rename';
import renameIdentifier from './refactorings/rename-identifier';

export default {

  subscriptions: null,

  activate(state) {

    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-js-refactorings:expand-selection': () => this.expand(),
      'atom-js-refactorings:extract-function': () => this.extract(),
      'atom-js-refactorings:rename-identifier': () => this.rename()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {};
  },

  expand() {
    var editor = atom.workspace.getActiveTextEditor();
    var code = editor.getText();
    var selection = editor.getSelectedBufferRange();

    selection = {
      start: {line: selection.start.row + 1, column: selection.start.column},
      end: {line: selection.end.row + 1, column: selection.end.column}
    };

    var expanded = expandSelection(code, selection).selection;

    editor.setSelectedBufferRange(
      new Range(
        new Point(expanded.start.line - 1, expanded.start.column),
        new Point(expanded.end.line - 1, expanded.end.column))
    );

    return true;
  },

  extract() {
    var editor = atom.workspace.getActiveTextEditor();
    var code = editor.getText();
    var selection = editor.getSelectedBufferRange();

    selection = {
      start: {line: selection.start.row + 1, column: selection.start.column},
      end: {line: selection.end.row + 1, column: selection.end.column}
    };

    var extracted = extractFunction(code, selection);
    var expanded = extracted.position;

    editor.setSelectedBufferRange(
      new Range(
        new Point(expanded.start.line - 1, expanded.start.column),
        new Point(expanded.end.line - 1, expanded.end.column))
    );
    editor.insertText(extracted.replacement);

    var renamed = rename(editor.getText(), extracted.extractedFunction);

    editor.setSelectedBufferRanges(renamed.selection.map(expanded => {
      return new Range(
        new Point(expanded.start.line - 1, expanded.start.column),
        new Point(expanded.end.line - 1, expanded.end.column));
    }));

    return true;
  },

  rename() {
    var editor = atom.workspace.getActiveTextEditor();
    var code = editor.getText();
    var selection = editor.getSelectedBufferRange();

    selection = {
      start: {line: selection.start.row + 1, column: selection.start.column},
      end: {line: selection.end.row + 1, column: selection.end.column}
    };

    var extracted = renameIdentifier(code, selection);
    var expanded = extracted.selection;

    editor.setSelectedBufferRanges(expanded.map(e => {
      return new Range(
        new Point(e.start.line - 1, e.start.column),
        new Point(e.end.line - 1, e.end.column));
    }));

    return true;
  }

};
