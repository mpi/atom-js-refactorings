var result = 1 + <|2 / 3|>;
// -- extract-function -->
var result = 1 + <|extracted|>();

function <|extracted|>() {
  return 2 / 3;
}
