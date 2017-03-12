function hello(who){

  who = who.toUpperCase();
  console.log('Hello ' <|+ w|>ho);
  return {
    greeted: true
  };
}
// -- extract-function -->
function hello(who){

  who = who.toUpperCase();
  console.log(<|extracted|>());
  return {
    greeted: true
  };

  function <|extracted|>() {
    return 'Hello ' + who;
  }
}
