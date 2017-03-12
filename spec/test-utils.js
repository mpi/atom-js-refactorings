'use babel';

import {Range, Point, TextEditor} from 'atom';
var fs = require('fs');
var path = require('path');

export default {
  loadTestCase: loadTestCase,
  compareEditors: compareEditors
};

function loadTestCase(file){

  var file = path.join(path.dirname(fs.realpathSync(__filename)), file);

  var operation = /\/\/ -- (\S+) -->/;

  var data = fs.readFileSync(file);
  var input = data.toString();
  var parts = input.split(operation);

  var before = parts[0].trim();
  var after = parts[2].trim();
  var command = parts[1];

  return {
    setupEditor: function(editor){
      editor.setText(extractCode(before));
      editor.setSelectedBufferRanges(extractSelection(before));
    },
    command: command,
    expectedEditor: function(){
      var editor = new TextEditor();
      editor.setText(extractCode(after));
      editor.setSelectedBufferRanges(extractSelection(after));
      return editor;
    }
  };

  function extractCode(code){
    var pattern = /<\|([\S\s]+?)\|>/igm;
    return code.replace(pattern, '$1');
  }

  function extractSelection(code){

    var selections = [];
    var start, end, l, idx;

    var lines = code.split('\n');
    for(l=0;l<lines.length;){
      if(!start){
        idx = lines[l].indexOf('<|');
        if(idx !== -1){
          start = {line: l, column: idx};
          lines[l] = lines[l].replace('<|', '');
        }
      }
      idx = lines[l].indexOf('|>');
      if(idx !== -1){
        lines[l] = lines[l].replace('|>', '');
        end = {line: l, column: idx};
        selections.push(new Range(new Point(start.line, start.column), new Point(end.line, end.column)));
        start = null;
        end = null;
        continue;
      }
      l++;
    }

    return selections;
  }
}

function compareEditors(expected, actual){
  expect(normalizeSpaces(actual.getText())).toEqual(normalizeSpaces(expected.getText()));

  var i;
  var actualSelections = actual.getSelectedBufferRanges();
  var expectedSelections = expected.getSelectedBufferRanges();

  expect(actualSelections.length).toBe(expectedSelections.length);

  for(i = 0; i < expectedSelections.length && i < actualSelections.length; i++){
    var actualSelection = actual.getTextInBufferRange(actualSelections[i]);
    var expectedSelection = expected.getTextInBufferRange(expectedSelections[i]);
    expect(normalizeSpaces(actualSelection)).toEqual(normalizeSpaces(expectedSelection));
  }

}

function normalizeSpaces(text){
  return text.replace(/\s+/g, ' ');
}

function loadTestCases(dir){

  var testCases = [];

  var files = fs.readdirSync(dir);

  files.forEach(file => {

    var path = dir + '/' + file;

    var data = fs.readFileSync(path);
    var input = data.toString();
    var parts = input.split('// -->');

    testCases.push([path, parts[0].trim(), parts[1].trim()]);
  });

  return testCases;

}
