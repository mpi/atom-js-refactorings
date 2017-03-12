function hello(who){

  console.<|log('Hello ' + who);|>
  return {
    greeted: true
  };
}
// -- extract-function -->
function hello(who){

  <|extracted|>();
  return {
    greeted: true
  };

  function <|extracted|>() {
    console.log('Hello ' + who);
  }
}
