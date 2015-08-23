# velocity.java

[Apache Velocity](http://velocity.apache.org/ "Apache Velocity") is a general purpose template engine.    
This is a nodejs wrap for Apache Velocity.

## Requirements

* JRE 1.6 or higher

## API

### velocity.renderOnce(filename[, data][, root], callback)
* _filename_ String
* _data_ Object
* _root_ String
* _callback_ Function

### velocity.startServer([port][, root])
* _port_ Number default=12306
* _root_ String

### velocity.stopServer()
### velocity.render(filename[, data], callback)
* _filename_ String
* _data_ Object
* _callback_ Function
