function hello(who){

  who = who.toUpperCase();
  console.log('Hello ' + <|who|>);
  return {
    greeted: true
  };
}
// -- expand-selection -->
function hello(who){

  who = who.toUpperCase();
  console.log(<|'Hello ' + who|>);
  return {
    greeted: true
  };
}
