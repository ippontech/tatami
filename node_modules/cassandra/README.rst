
About
---------

node_cassandra is node.js addon for Apache Cassandra(http://cassandra.apache.org).
node_cassandra originally used C++ thrift client, but thanks to node.js support in Thrift ver 0.6, current version uses only javascript.
Currently, only cassandra 0.7.x is supported.

Requirement
-------------

node-thrift, but if you install node_cassandra with npm, it should be installed as well.

Installation
--------------

  $ npm install cassandra

of

  $ git clone https://github.com/yukim/node_cassandra.git

  $ npm install .

Usage
---------

Example usage::

  var cassandra = require('cassandra');
  var client = new cassandra.Client("Keyspace", "host:port");
  var CL = cassandra.ConsistencyLevel;

  client.consistencyLevel({
    write: CL.ONE,
    read: CL.ONE
  });

  client.connect("SomeKeySpace");
  var cf = client.getColumnFamily("SomeColumnFamily");

  var data = cf.get("key", function(err, data) {
    // play with data
    console.log(data.columnName);
  });

For more detailed example, see test/test.js.

Test
--------

If you have expresso installed, you can run test with::

  $ expresso -I lib

Limitation
------------

Following APIs are not yet supported.

* get_range_slice
* get_index_slice
* system_* (schema modification APIs)

License
-----------

Apache 2.0 License
