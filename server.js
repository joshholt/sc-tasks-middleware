// ..........................................................
//  Tasks MiddleWare Server
// ..........................................................

/*globals HOST PORT TasksNode*/

/**
  This is a middleware (more like middle man) server for
  the SproutCore Agile Tasks Manager application.
  
  {{{
      Prereq: 
        Download NodeJS: (http://s3.amazonaws.com/four.livejournal/20091117/node-v0.1.18.tar.gz)
              or
        Clone NodeJS: (git clone git://github.com/ry/node.git)
        
        Compile and Install NodeJS (./configure && make && sudo make install)
        
      Running: 
        After installing NodeJS you can run the server by issuing the following
        command: 
            
            > nohup node server.js &
            
      Integration:
        Point the Proxy in Tasks' Buildfile to localhost:8989 and your off and running.
  }}}
  
  @author Joshua Holt
  @version 0.1
  @since 0.1
  
*/

// ..........................................................
//  CONFIGURATION
// ..........................................................

TasksNode = {
  /*
    Used to set the host. When set to null serves on localhost
  */
  HOST: null,

  /*
    Used to set the port for this server.
  */
  PORT:  8989,
  
  /*
    Client Port (used to connect to a remote server's port)
  */
  CLIENT_PORT: 8080,
  
  /*
    Client Headers (used to send custom headers to the remote server with a request)
  */
  CLIENT_HEADERS: {"Accept": "application/json"},
  
  /*
    Client Host (The host your web client needs to be connected to)
  */
  CLIENT_HOST: "10.136.210.67",
  
  /*
    Used to indetify this server
  */
  CUSTOM_USER_AGENT: "Tasks NodeJS Server",
  
  /*
    Common server (implements simple webserver functionality)
  */
  CommonServer: require("./lib/common-server"),
  
  /*
    Common Client (implements simple web-client functionality)
  */
  CommonClient: require('./lib/common-client'),
  
  /*
    System libraries (used to print to the console etc...)
  */
  sys: require("sys"),
  
  /*
    Basic utils used everywhere
  */
  utils: require('./lib/utils')
};

// ..........................................................
// BOOT SERVER && CLIENT
// ..........................................................
TasksNode.CommonServer.listen(TasksNode.PORT, TasksNode.HOST);
TasksNode.dbClient = TasksNode.CommonClient.bootClient(TasksNode.CLIENT_PORT, TasksNode.CLIENT_HOST);

// ..........................................................
//  HANDLERS
// ..........................................................
TasksNode.Handlers = {
  
 indexHandler: function(req, res){
   res.simpleText(200, "Welcome to the Tasks NodeJS Server", TasksNode.CUSTOM_USER_AGENT);
 }, 

 authenticationHandler: function(req, res){
   var method = req.method, json = "NONE", buffer = "";
   res.simpleText(200, "AuthenticationHandler called with: %@ and %@".fmt(method, json), TasksNode.CUSTOM_USER_AGENT);
 },
 
 taskHandler: function(req, res){
   var method = req.method, json = "NONE";
   TasksNode.CommonClient.get(TasksNode.dbClient,
     "/tasks%@".fmt(req.uri.path), TasksNode.CLIENT_HEADERS, 
     null, function(status, body){
      if (status !== 200) {
        res.simpleText(status, "ProjectHandler had a problem with your (%@) request.".fmt(method), TasksNode.CUSTOM_USER_AGENT);
      }else{
        res.simpleText(status, "ProjectHandler called with: %@ and %@".fmt(method, body), TasksNode.CUSTOM_USER_AGENT);
      }
   });
 },
 
 projectHandler: function(req, res){
   var method = req.method, json = "NONE";
   if (method === "POST") json = req.uri.params;
   TasksNode.CommonClient.get(TasksNode.dbClient,
     "/tasks%@".fmt(req.uri.path), TasksNode.CLIENT_HEADERS, 
     null, function(status, body){
      if (status !== 200) {
        res.simpleText(status, "ProjectHandler had a problem with your (%@) request.".fmt(method), TasksNode.CUSTOM_USER_AGENT);
      }else{
        res.simpleText(status, "ProjectHandler called with: %@ and %@".fmt(method, body), TasksNode.CUSTOM_USER_AGENT);
      }
   });
 },
 
 userHandler: function(req, res){
   var method = req.method, json = "NONE", buffer = "";
   if (method === "POST") {
     req.addListener("body", function(chunk) {
         buffer = buffer + chunk;
     });
     req.addListener("complete", function(chunk) {
         json = JSON.parse(buffer).name;
         res.simpleText(200, "UserHandler called with: %@ and %@".fmt(method, json), TasksNode.CUSTOM_USER_AGENT);
     });
   } else {
     TasksNode.CommonClient.get(TasksNode.dbClient,
       "/tasks%@".fmt(req.uri.path), TasksNode.CLIENT_HEADERS, 
       null, function(status, body){
        if (status !== 200) {
          res.simpleText(status, "UserHandler had a problem with your (%@) request.".fmt(method), TasksNode.CUSTOM_USER_AGENT);
        }else{
          res.simpleText(status, "UserHandler called with: %@ and %@".fmt(method, body), TasksNode.CUSTOM_USER_AGENT);
        }
     });
   }
 }
};
// ..........................................................
//  ROUTES
// ..........................................................
TasksNode.CommonServer.get("^/$", TasksNode.Handlers.indexHandler);
TasksNode.CommonServer.get("^/tasks-server/?$", TasksNode.Handlers.indexHandler);
TasksNode.CommonServer.get("^/tasks-server/user/?([0-9]+)?$", TasksNode.Handlers.userHandler);
TasksNode.CommonServer.get("^/tasks-server/task/?([0-9]+)?$", TasksNode.Handlers.taskHandler);
TasksNode.CommonServer.get("^/tasks-server/project/?([0-9]+)?$", TasksNode.Handlers.projectHandler);
TasksNode.CommonServer.post("^/tasks-server/user/?([0-9]+)?$", TasksNode.Handlers.userHandler);
TasksNode.CommonServer.post("^/tasks-server/task/?([0-9]+)?$", TasksNode.Handlers.taskHandler);
TasksNode.CommonServer.post("^/tasks-server/project/?([0-9]+)?$", TasksNode.Handlers.projectHandler);
