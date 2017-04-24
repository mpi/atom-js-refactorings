function hello(who){

  who = who.to<|UpperCase();
  // this is comment
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
    // this is comment
    console.log('Hello ' + who);
  }
}
