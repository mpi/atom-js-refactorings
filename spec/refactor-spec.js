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

  it('applies insertion on editor', () => {

    // given:
    var code = `
var x = 1;
var y = 2;
`;
    editor.setText(code);

    // when:
    var r = refactor(editor.getText());
    r.traverse({
      Program: path => {
        path.get('body.1').insertBefore(
          types.expressionStatement(types.identifier('code'))
        );
      }
    });
    r.applyOn(editor);

    // then:
    //debug();
    expect(editor.getText()).toEqual(`
var x = 1;
code;
var y = 2;`);
  });

  it('applies deletion on editor', () => {

    // given:
    var code = `


  var x = 1;
var y = 2;
var z = 3;
`;
    editor.setText(code);

    // when:
    var r = refactor(editor.getText());
    r.traverse({
      Program: path => {
        path.get('body.1').remove();
      }
    });
    r.applyOn(editor);

    // then:
    //debug();
    expect(editor.getText()).toEqual(`
var x = 1;
var z = 3;
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
