function StringTokenizerForExpr(_string)
{
  var string = _string;
  string = string.replace(/\+/g, "$+$");
  string = string.replace(/\-/g, "$-$");
  string = string.replace(/\//g, "$/$");
  string = string.replace(/\*/g, "$*$");

  return string.split("$");
}
