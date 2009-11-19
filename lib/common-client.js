// ..........................................................
// Common Web Client API 
// ..........................................................

/*globals DEBUG exports process*/

/**
  
  This is a common web client api built on top of nodeJS.
  You can use this in your own nodeJS server/client implementation
  by requiring it like so:
  
  {{{
      var sys = require("sys");
      var CommonClient = require(./common-client);
      
      var client = CommonClient.bootClient(80, "www.google.com");
      
      requestHandler = function(status, body) {
        sys.puts("STATUS: %@".fmt(status));
        sys.puts("BODY: %@".fmt(body));
      };
      
      CommonClient.get(client, "/", null, null, requestHandler);
      

  }}}
  
  @author Joshua Holt
  @version 0.1
  @since 0.1
  
*/

var createClient = require("http").createClient;
var sys = require("sys");

var CommonClient = exports;
var client = null;

var makeRequest = function(request, handler){
  request.finish(function(response){
    var responseBody = "";
    var statusCode = response.statusCode;
    response.setBodyEncoding("utf8");
    // Body Listener
    response.addListener("body", function(chunk){
      responseBody += chunk;
    });
    // Completion Listener
    response.addListener("complete", function(){
      handler(statusCode, responseBody);
    });
  });
};

CommonClient.get = function(client, path, headers, body, handler) {
  var request = client.get(path,headers);
  makeRequest(request, handler);
};

CommonClient.post = function(client, path, headers, body, handler) {
  var request = client.get(path,headers);
  makeRequest(request, handler);
};

CommonClient.put = function(client, path, headers, body, handler) {
  var request = client.get(path,headers);
  makeRequest(request, handler);
};

CommonClient.del = function(client, path, headers, body, handler) {
  var request = client.get(path,headers);
  makeRequest(request, handler);
};

CommonClient.bootClient = function(port, host) {
  if (!port) port = 80; // default to port 80
  if (!host) host = "127.0.0.1"; // default to localhost
  client = createClient(port,host);
  sys.puts("Client connected http://" + host + ":" + port.toString() + "/");
  return client;
};