'use babel';

import * as _ from 'lodash';
import Refactoring from './refactoring';
import {parse, traverse, generate, types} from './parser';
import {Range, Point, TextEditor} from 'atom';

export default refactor;

function refactor(code){

  var nodes = [];
  var selected = [];
  var ast = parse(code);
  var original = clone(ast);
  var done = false;

  return {
    traverse: function(visitor, state){
      done = false;
      traverse(ast, enhanceWithEnter(visitor), null, state);
      return state;
    },
    done(){
      done = true;
    },
    applyOn: function(editor){
      console.log(ast);
      var r = diff();
      r.applyOn(editor);
      applySelects(editor);
    },
    select: function(node){
      if(!_.isArray(node)){
        selected.push([node]);
      } else {
        selected.push(node);
      }
    }
  };

  function enhanceWithEnter(visitor){
    var enter = visitor.enter;
    visitor.enter = function(path){
      if(done){
        path.stop();
      }
      if(enter){
        enter.apply(this, arguments);
      }
    };
    return visitor;
  }

  function clone(ast){
    traverse(ast, {
      enter: function(path, state){
        path.node.__idx = state.idx++;
        state.nodes.push(path.node);
      }
    }, null, {idx: 0, nodes: nodes});
    return ast.__clone();
  }

  function applySelects(editor){
    var paths = [];
    traverse(ast, {
      enter: function(path, state){
        var idx = _.findIndex(selected, a => _.includes(a, path.node));
        if(idx !== -1){
          if(!state.paths[idx]){
            state.paths[idx] = {
              start: path.getPathLocation().replace(/\[(\d+)\]/g, '.$1'),
              end: path.getPathLocation().replace(/\[(\d+)\]/g, '.$1')
            };
          } else {
            state.paths[idx].end = path.getPathLocation().replace(/\[(\d+)\]/g, '.$1');
          }
        }
      }
    }, null, {paths: paths});
    nodes = [];
    selected = [];
    ast = parse(editor.getText());
    original = clone(ast);

    traverse(ast, {
      Program: path => {
        var ranges = _.map(paths, p => {
          var start = path.get(p.start.replace('program.', ''));
          var end = path.get(p.end.replace('program.', ''));
          return new Range(asPoint(start.node.loc.start), asPoint(end.node.loc.end));
        });
        if(!_.isEmpty(ranges)){
          editor.setSelectedBufferRanges(ranges);
        }
        path.skip();
      }
    });
  }

  function diff(){

    var original = nodes;
    var source = ast;

    var state = { idx: 0, refactoring: new Refactoring()};

    // mark nodes that should be re-generated:
    traverse(source, {
      enter: function(path, state){
        var node = path.node;
        if(node.__idx == undefined){
          markForUpdate(path);
          return;
        }
        while(node.__idx > original[state.idx].__idx){
          state.idx++;
          markForUpdate(path);
        }
        if(node.__idx == original[state.idx].__idx){
          state.idx++;
          return;
        }
      },
    }, null, state);

    // record replacements:
    traverse(source, {
      'FunctionParent|Statement': (path, state) => {
        var node = path.node;
        if(node.__updated){
          state.refactoring.replaceWith(asRange(node.loc), generate(node).code);
          path.skip();
        }
      }
    }, null, state);

    return state.refactoring;

    function markForUpdate(path){
      var parent = path.find(nearestValidBlock);
      parent.node.__updated = true;
      path.skip();
    }

    function nearestValidBlock(path){
      return path.node.__idx != undefined && (path.isStatement() || path.isFunctionParent());
    }
  }

  function asPoint(loc){
    return new Point(loc.line - 1, loc.column);
  }
  function asRange(range){
    return new Range(asPoint(range.start), asPoint(range.end));
  }
}
