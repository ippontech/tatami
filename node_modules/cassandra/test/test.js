/**
 * This test assumes that your cassandra cluster is located at localhost/9160.
 *
 * In order to run this test, first create keyspace and cf with
 * DDL included with this test script.
 *
 * cassandra-cli --host localhost --batch < test.ddl
 */
var assert = require('assert'),
    cassandra = require('cassandra');

// number of tests

module.exports = {

  'test if ConsistencyLevel is exported properly': function() {
    // connect to cassandra
    var client = new cassandra.Client('127.0.0.1:9160');

    // make sure all consistency levels are exported
    var CL = cassandra.ConsistencyLevel;
    assert.deepEqual({
      ONE: 1,
      QUORUM: 2,
      LOCAL_QUORUM: 3,
      EACH_QUORUM: 4,
      ALL: 5,
      ANY: 6
    }, CL);

    // client configuration
    // consistency level
    // default is CL.QUORUM for both reads and writes
    assert.deepEqual({
      write: CL.QUORUM,
      read: CL.QUORUM
    }, client.consistencyLevel());
    // let's change default
    client.consistencyLevel({
      write: CL.ONE,
      read: CL.ONE
    });
    // and check
    assert.deepEqual({
      write: CL.ONE,
      read: CL.ONE
    }, client.consistencyLevel());
  },

  'test connecting keyspace that does not exist throws error': function() {
    // connect to cassandra
    var client = new cassandra.Client('127.0.0.1:9160');
    client.on('error', function(err) {
      assert.isNotNull(err);
      client.close();
    });
    client.connect('NonExistKeySpace');
  },

  'test if accessing ColumnFamily that does not exist throws error': function() {
    // connect to cassandra
    var client = new cassandra.Client('127.0.0.1:9160');
    client.on('error', function(err) {
      assert.isNotNull(err);
      assert.equal(err.message, 'Column Family NotExistCF does not exist.');
      client.close();
    });
    client.connect('node_cassandra_test');
    client.getColumnFamily('NotExistCF');
  },

  /*
  'test if truncate works': function() {
    // connect to cassandra
    var client = new cassandra.Client('127.0.0.1:9160');
    client.on('error', function(err) {
      assert.fail(err.message);
    });
    client.connect('node_cassandra_test');
    var standard = client.getColumnFamily('Standard');
    standard.set('test', { foo: 123 }, function(err) {
      assert.isNull(err);
      standard.truncate(function(err) {
        assert.isNull(err);
        standard.get('test', function(err, res) {
          assert.isNull(err);
          client.close();
        });
      });
    });
  },
  */

  'test if operations on client works properly': function(beforeExit) {
    // connect to cassandra
    var client = new cassandra.Client('127.0.0.1:9160');
    client.connect('node_cassandra_test');
    // or login if needed
    //client.connect('node_cassandra_test', {username: 'foo', password: 'bar'});

    var standard = client.getColumnFamily('Standard');
    var superCF = client.getColumnFamily('Super');

    //-------------------------------------
    // set
    // set one record to standard column family.
    standard.set('todd', {
      id: 1,
      first_name: 'Todd',
      last_name: 'Dahl',
      age: 24
    }, function(err) {
      assert.isNull(err);
    });

    // make sure it is seted.
    standard.get('todd', function(err, res) {
      assert.isNull(err);
      assert.deepEqual({
        id: 1,
        first_name: 'Todd',
        last_name: 'Dahl',
        age: 24,
      }, res);
    });

    // if you query for the key that doesn't exist, you will get empty object.
    standard.get('notexist', function(err, res) {
      assert.isNull(err);
      assert.deepEqual({}, res);
    });
    // see if multiget works as expected.
    standard.set('jesse', {
      id: 2,
      first_name: 'Jesse',
      last_name: 'Pitman'
    });

    standard.get(['todd', 'jesse'], function(err, res) {
      assert.isNull(err);
      assert.deepEqual({
        todd: {
          id: '1',
          first_name: 'Todd',
          last_name: 'Dahl',
          age: '24',
        },
        jesse: {
          id: '2',
          first_name: 'Jesse',
          last_name: 'Pitman'
        }
      }, res);
    });

    // read operation with options.
    // valid options are:
    //   start: SliceRange start
    //   finish: SliceRange finish
    //   reversed: SliceRange reversed
    //   count: SliceRange count
    //
    //   ttl: column ttl (not yet)
    //   consistency_level: read consisteny level (not yet)
    //
    // specifying column names
    standard.get('todd', ['id', 'age'], function(err, res) {
      assert.isNull(err);
      assert.deepEqual({
        id: '1',
        age: '24',
      }, res);
    });
    // count scan
    standard.get('todd', {count: 1}, function(err, res) {
      assert.isNull(err);
      assert.deepEqual({
        age: '24',
      }, res);
    });
    // range scan
    standard.get('todd', {start: '', finish: 'age'}, function(err, res) {
      assert.isNull(err);
      assert.deepEqual({
        age: '24',
      }, res);
    });

    // counting
    // let's count number of cols
    standard.count('todd', function(err, res) {
      assert.isNull(err);
      assert.equal(4, res);
    });

    // you can count colmns of multiple keys
    standard.count(['todd', 'jesse'], function(err, res){
      assert.isNull(err);
      assert.deepEqual({
        todd: 4,
        jesse: 3
      }, res);
    });

    // super column
    superCF.set('edgar', {
      name: {
        first_name: 'Edgar',
        last_name: 'Sawyers'
      },
      address: {
        city: 'Madison',
        state: 'WI'
      }
    }, function(err) {
      assert.isNull(err);
    });

    superCF.get('edgar', function(err, res) {
      assert.isNull(err);
      assert.deepEqual({
        name: {
          first_name: 'Edgar',
          last_name: 'Sawyers'
        },
        address: {
          city: 'Madison',
          state: 'WI'
        }
      }, res);
    });

    superCF.get('edgar', {count: 1}, function(err, res) {
      assert.isNull(err);
      assert.deepEqual({
        address: {
          city: 'Madison',
          state: 'WI'
        }
      }, res);
    });

    superCF.get('edgar', 'address', function(err, res) {
      assert.isNull(err);
      assert.deepEqual({
        city: 'Madison',
        state: 'WI'
      }, res);
    });

    // get only one column for certain key
    superCF.get('edgar', 'address', ['city'], function(err, res) {
      assert.isNull(err);
      assert.deepEqual({
        city: 'Madison'
      }, res);
    });
    // get only one column for certain key
    superCF.get('edgar', 'address', 'state', function(err, res) {
      assert.isNull(err);
      assert.deepEqual({
        state: 'WI'
      }, res);
    });

    superCF.get('edgar', 'address', {start: '', finish: 'city'}, function(err, res) {
      assert.isNull(err);
      assert.deepEqual({
        city: 'Madison'
      }, res);
    });

    // remove
    standard.remove('todd', 'id', function(err) {
      assert.isNull(err);
    });

    standard.get('todd', function(err, res) {
      assert.isNull(err);
      assert.deepEqual({
        first_name: 'Todd',
        last_name: 'Dahl',
        age: '24',
      }, res);
    });
    standard.remove('todd', ['first_name', 'last_name']);
    standard.get('todd', function(err, res) {
      assert.isNull(err);
      assert.deepEqual({
        age: '24',
      }, res);
    });

    standard.remove('todd');
    standard.get('todd', function(err, res) {
      assert.isNull(err);
      assert.deepEqual({}, res);
    });

    standard.remove('jesse');
    standard.get('jesse', function(err, res) {
      assert.isNull(err);
      assert.deepEqual({}, res);
    });

    superCF.remove('edgar');
    superCF.get('edgar', function(err, res) {
      assert.isNull(err);
      assert.deepEqual({}, res);

      client.close();
    });
  }
};
