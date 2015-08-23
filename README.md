# velocity.java

[![NPM](https://nodei.co/npm/velocity.java.png?downloads=true&stars=true)](https://nodei.co/npm/velocity.java/)

[Apache Velocity](http://velocity.apache.org/ "Apache Velocity") is a general purpose template engine.    
This is a nodejs wrap for Apache Velocity.

## Requirements

* JRE 1.6 or higher

## API

### velocity.renderOnce(filename[, data][, root], callback)
* _filename_ String
* _data_ Object
* _root_ String | Array
* _callback_ Function

Render the template specified by `filename` with `data`.

`root` accepts multi-values. Root(s) from which the loader loads templates. Templates may live in subdirectories of this root.

### velocity.startServer([port][, root])
* _port_ Number default = 12306
* _root_ String | Array

### velocity.stopServer()
### velocity.render(filename[, data], callback)
* _filename_ String
* _data_ Object
* _callback_ Function
