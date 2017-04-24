function hello(who){

  var extracted = false;
  console.<|log('Hello ' + who);|>
  return {
    greeted: true
  };
}
// -- extract-function -->
function hello(who){

  var extracted = false;
  <|extracted1|>();
  return {
    greeted: true
  };

  function <|extracted1|>() {
    console.log('Hello ' + who);
  }
}
