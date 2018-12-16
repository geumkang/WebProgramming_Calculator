function StringTokenizerForExpr(_string)
{
  var string = _string;
  string = string.replace(/\+/g, "$+$");
  string = string.replace(/\-/g, "$-$");
  string = string.replace(/\//g, "$/$");
  string = string.replace(/\*/g, "$*$");

  return string.split("$");
}

function StringTokenizer4Result(_string){
  var arr_string = _string.split("=");

  return arr_string[arr_string.length-1].trim();;
}
