function hello(who){

  who = who.to<|UpperCase();
  console.log('Hello ' + who);|>
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
    who = who.toUpperCase();
    console.log('Hello ' + who);
  }
}
