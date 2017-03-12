function hello(who){

  who = who.toUpperCase();
  <|console.log('Hello ' + who);|>
  return {
    greeted: true
  };
}
// -- extract-function -->
function hello(who){

  who = who.toUpperCase();
  <|extracted|>();
  return {
    greeted: true
  };

  function <|extracted|>() {
    console.log('Hello ' + who);
  }
}
