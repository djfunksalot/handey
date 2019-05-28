// handling incoming connections, creating new stuff and 
// returning results over rest interface
var restify = require('restify');
var restPort = process.env.PORT || 8386;
var neo4j_uri = process.env.NEO4J_URI || "bolt://localhost:7687";
var neo4j_user = process.env.NEO4J_USER || "neo4j";
var neo4j_pass = process.env.NEO4j_PASS || "neo4j";
var restPort = process.env.PORT || 8386;
var restServer = restify.createServer();
var qs = require('qs');
// default is to return all models
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver(neo4j_uri, neo4j.auth.basic(neo4j_user, neo4j_pass));
const session = driver.session();

var controller =  function(req, res, next) {
    console.log(neo4j_uri);
    console.log(neo4j_user);
    console.log(neo4j_pass);
    var id = false
    var params = req.params;
    var url = req.url.split('?');
    var queryString = qs.parse(url[1]);
    var search = {}
    if (params.search !== undefined) {
        search = params.search;
    }
    if(params['id']) {
      id = params['id']
    }
    var model_name = params['model'];
    var user = req.headers['x-forwarded-user'];
    console.log("get model request:" + model_name);
    if(id){
        console.log("id:" + id);
    }
//    var cypher = "MATCH (n:"+model_name+")-[r]-(m) ";
    var cypher = "MATCH (n:"+model_name+") ";
    if(id) {
        cypher += 'where n.uuid = "'+id +'" ';
    }
//    cypher += "RETURN n,r,m";
    cypher += 'CALL apoc.path.subgraphAll(n, {maxLevel:1}) YIELD nodes, relationships '
    cypher += 'WITH [node in nodes | node {.*, label:labels(node)[0]}] as nodes, ' 
    cypher += '[rel in relationships | rel {.*, fromNode:{label:labels(startNode(rel))[0], key:startNode(rel).key}, toNode:{label:labels(endNode(rel))[0], key:endNode(rel).key}}] as rels '
    cypher += 'WITH {nodes:nodes, relationships:rels} as json '
    cypher += 'RETURN apoc.convert.toJson(json) as j'
    session.run(cypher, params)
        .then(result => {
        // On result, get count from first record
console.log(result);
            //var node = result.records[0].get('n');
            //var relationship  = result.records[0].get('r');
            //var target  = result.records[0].get('m');
            var target  = result.records[0].get('j');
            res.send(target);

        // Log response
        //    console.log( count.properties );
        })
        .catch(e => {
            // Output the error
            //res.send([]);
            console.log(e);
        })
        .then(() => {
            // Close the Session
            return session.close();
        })
        .then(() => {
            // Close the Driver
            return driver.close();
        });
};

//route the requests to their appropriate places
//start the server
restServer
    .use(restify.fullResponse())
    .use(restify.bodyParser())
    .listen(restPort, function() {
        var consoleMessage = '\n+++++++++++++++++++++++++++++++++++++++++++++++++++++\n';
        consoleMessage += '\n restServer is listening at %s \n';
        consoleMessage += '\n+++++++++++++++++++++++++++++++++++++++++++++++++++++\n';
        console.log(consoleMessage, restServer.url);
    });

restServer.post('/:model',controller);
restServer.post('/:model/:id', controller);
restServer.get('/:model/', controller);
restServer.get('/:model/:id', controller);
restServer.put('/:model', controller);
restServer.put('/:model/:id', controller);
restServer.patch('/data/:model/', controller);
restServer.patch('/data/:model/:id', controller);
restServer.del('/data/:model/', controller);
restServer.del('/data/:model/:id', controller);
