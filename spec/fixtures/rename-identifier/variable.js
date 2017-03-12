var pow = function pow(number){
  return number * number;
}

var x = <|pow|>(10);
var y = pow(x);

// -- rename-identifier -->
var <|pow|> = function pow(number){
  return number * number;
}

var x = <|pow|>(10);
var y = <|pow|>(x);
