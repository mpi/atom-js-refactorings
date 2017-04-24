'use babel';

import _ from 'lodash';
import {selectionToNodes} from '../utils/utils';
import refactor from '../utils/diff';

export default expandSelection;

function expandSelection(code, selection) {

  var refactoring = refactor(code);
  var codeToSelect = refactoring.traverse(selectionToNodes(selection, true), []);

  if(!_.isEmpty(codeToSelect)){
    refactoring.select(codeToSelect);
  }

  return refactoring;
};
