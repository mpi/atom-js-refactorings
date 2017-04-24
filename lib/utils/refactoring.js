'use babel';

import * as _ from 'lodash';
import {Range, Point} from 'atom';

export default Refactoring;

function Refactoring(){

  var replacements = [];
  var selections = [];

  return {
    replaceWith: function(range, code){
      replacements.push({
        range: asRange(range),
        code: code
      });
    },
    insertIn: function(point, code){
      replacements.push({
        range: asRange({start: point, end: point}),
        code: code
      });
    },
    deleteAt: function(range){
      replacements.push({
        range: asRange(range),
        code: ''
      });
    },
    select: function(range){
      selections.push(asRange(range));
    },
    replacements: function(){
      return replacements;
    },
    applyOn: function(editor){
      console.log(replacements);
      _.each(replacements, function(r){
        applyReplacement(r, editor);
      });
      applySelection(selections, editor);
    }
  };

  function applyReplacement(replacement, editor){
    var range = replacement.range;
    editor.setSelectedBufferRange(range);

    var out = editor.insertText(replacement.code)[0];
    var delta = diff(range, out);

    _.chain(replacements)
      .dropWhile(r => r !== replacement)
      .drop(1)
      .flatMap(r => [r.range.start, r.range.end])
      .each(shiftBy(replacement.range, delta))
      .value();
  }

  function shiftBy(relative, delta){
    return (point) => {

      if(point.isLessThan(relative.start)){
        return;
      }

      point.row += delta.row;

      if(relative.intersectsRow(point.row)){
        point.column += delta.column;
        return;
      }
    };
  }

  function diff(before, after){
    if(!before.start.isEqual(after.start)){
      throw 'Text insterted in wrong place';
    }
    return after.end.translate(before.end.negate());
  }

  function applySelection(selections, editor){
    if(!_.isEmpty(selections)){
      editor.setSelectedBufferRanges(selections);
    }
  }
  function asRange(r){

    return new Range(asPoint(r.start), asPoint(r.end));

    function asPoint(p){

      var row = p.row;
      if(_.isUndefined(row)){
        row = p.line - 1;
      }

      return new Point(row, p.column);
    }
  }
}
