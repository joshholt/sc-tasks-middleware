// Borrowed From SproutCore's runtime core.js
String.prototype.fmt = function() {
  // first, replace any ORDERED replacements.
  var args = arguments;
  var idx  = 0; // the current index for non-numerical replacements
  return this.replace(/%@([0-9]+)?/g, function(s, argIndex) {
    argIndex = (argIndex) ? parseInt(argIndex,0)-1 : idx++ ;
    s =args[argIndex];
    return ((s===null) ? '(null)' : (s===undefined) ? '' : s).toString(); 
  }) ;
};