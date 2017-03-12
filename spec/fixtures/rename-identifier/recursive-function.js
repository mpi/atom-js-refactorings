var fib = <|fibonacci|>(5);

function fibonacci(n){

  if(n === 0 || n === 1){
    return n;
  }

  return fibonacci(n - 1) + fibonacci(n - 2);
}
// -- rename-identifier -->
var fib = <|fibonacci|>(5);

function <|fibonacci|>(n){

  if(n === 0 || n === 1){
    return n;
  }

  return <|fibonacci|>(n - 1) + <|fibonacci|>(n - 2);
}
