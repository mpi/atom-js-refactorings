import {log} from 'logger';

export default function hello(who){

  <|log('Hello ' + who);|>
  return {
    greeted: true
  };
}
// -- extract-function -->
import {log} from 'logger';

export default function hello(who){

  <|extracted|>();
  return {
    greeted: true
  };

  function <|extracted|>() {
    log('Hello ' + who);
  }
}
