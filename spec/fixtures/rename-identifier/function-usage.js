var x = pow(10);
var y = <|pow|>(x);

function pow(number){
  return number * number;
}
// -- rename-identifier -->
var x = <|pow|>(10);
var y = <|pow|>(x);

function <|pow|>(number){
  return number * number;
}
