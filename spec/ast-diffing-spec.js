'use babel';

import {types} from '../lib/utils/parser';
import refactor from '../lib/utils/diff';
import {TextEditor} from 'atom';
import * as _ from 'lodash';

describe('Refactor', () => {

  var editor;

  beforeEach(() => {
    editor = new TextEditor();
  });

  it('applies changes on editor', () => {

    // given:
    var code = `
function add(a, b) {
   var xy = 5;
  return a + b;
}
function subtract(a, b) {
     return a - b;
}
  console. log('123' ) ;
    `;
    editor.setText(code);

    // when:
    var r = refactor(editor.getText());
    r.traverse({
      FunctionDeclaration: path => {
        var unused = types.identifier('unused');
        path.node.params.push(unused);
        r.select(unused);
      }
    });
    r.applyOn(editor);

    // then:
    //debug();
    expect(editor.getText()).toEqual(`
function add(a, b, unused) {
  var xy = 5;
  return a + b;
}
function subtract(a, b, unused) {
  return a - b;
}
  console. log('123' ) ;
    `);
  });

  function debug(){
    console.log('Editor:\n' + editor.getText());
    console.log('Selected text: ');
    _.each(editor.getSelectedBufferRanges(), r => {
      var loc = `(${r.start.row}:${r.start.column}) -> (${r.end.row}:${r.end.column})`;
      console.log(loc + ':' + editor.getTextInBufferRange(r));
    });
  }
});
