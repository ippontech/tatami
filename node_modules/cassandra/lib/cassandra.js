/**
 * Copyright 2011 Yuki Morishita<mor.yuki@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 *:WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var sys = require('sys'),
    thrift = require('thrift'),
    Cassandra = require('../gen-nodejs/Cassandra'),
    ttype = require('../gen-nodejs/cassandra_types');

/**
 * node_cassandra, Apache Cassandra Client for node.js
 *
 * @constructor
 * @api public
 */
var Client = function(host) {
  var pair = host.split(/:/);
  this.host = pair[0];
  this.port = pair[1];
  // default consistency level
  this.defaultCL = {
    read: ttype.ConsistencyLevel.QUORUM,
    write: ttype.ConsistencyLevel.QUORUM
  };
}
sys.inherits(Client, process.EventEmitter);

/**
 * Connect to Cassandra cluster
 *
 * @param keyspace keyspace name to use
 * @param credential if given, try login into cassandra
 * @api public
 */
Client.prototype.connect = function() {
  var args = Array.prototype.slice.call(arguments);

  var keyspace_or_credential = args.shift();
  var credential = args.shift();
  if (keyspace_or_credential instanceof String ||
      typeof keyspace_or_credential === 'string') {
    // if first argument is string, then it is keyspace name
    this.keyspace = keyspace_or_credential;
  } else {
    credential = keyspace_or_credential;
  }

  this.ready = false;
  this.queue = [];

  this.connection = thrift.createConnection(this.host, this.port);
  this.connection.on('error', function(err) {
    this.emit('error', err);
  });
  this.thrift_client = thrift.createClient(Cassandra, this.connection);

  var self = this;
  this.connection.on('connect', function(err) {
    if (err) {
      self.emit('error', err);
      return;
    }

    // if credential is given, then call login
    if (credential) {
      self.thrift_client.login(
        new ttype.AuthenticationRequest(credential), function(err) {

          if (err) {
            self.emit('error', err);
            return;
          }

          // only when login is success, emit connected event
          self.ready = true;
          self.dispatch();
        });
    } else {
      self.ready = true;
      self.dispatch();
    }
  });

  // if keyspace is specified, use that ks
  if (this.keyspace) {
    this.use(this.keyspace, function(err) {
      if (err) {
        self.emit('error', err);
      }
    });
  }
};

/**
 * set which keyspace to use
 *
 * @param keyspace Keyspace to use
 * @param callback
 */
Client.prototype.use = function(keyspace, callback) {
  var args = Array.prototype.slice.call(arguments);
  if (!this.ready) {
    this.queue.push([arguments.callee, args]);
    return;
  }

  this.keyspace = keyspace;

  var self = this;
  this.thrift_client.describe_keyspace(this.keyspace, function(err, ksdef) {
    if (err) {
      self.emit('error', err);
      return;
    }
    self.definition_ = ksdef;
    self.column_families_ = {};

    var i = ksdef.cf_defs.length;
    var cf;
    while (i--) {
      cf = ksdef.cf_defs[i];
      self.column_families_[cf.name] = cf;
    }

    self.thrift_client.set_keyspace(self.keyspace, function(err) {
      if (err) {
        selt.emit('error', err);
        return;
      }
      self.emit('keyspaceSet', self.column_families_);
    });
  });
};

/**
 * Set or get default consistency level
 *
 * @param consistencyLevel An object which has write and read consistency level.
 *           If given, sets default consistency level.
 *                         
 */
Client.prototype.consistencyLevel = function() {
  if (arguments.length == 0) {
    return this.defaultCL;
  } else {
    var newCL = arguments[0];
    this.defaultCL.read = newCL.read || ttype.ConsistencyLevel.QUORUM;
    this.defaultCL.write = newCL.write || ttype.ConsistencyLevel.QUORUM;
  }
};

/**
 * add keyspace
 *
 * TODO work in progress
 */
Client.prototype.addKeySpace = function(ksdef, callback) {
  var args = Array.prototype.slice.call(arguments);
  if (!this.ready) {
    this.queue.push([arguments.callee, args]);
    return;
  }

  this.thrift_client.system_add_keyspace(new ttype.KsDef(ksdef), callback);
};

/**
 * drop keyspace
 *
 * TODO work in progress
 */
Client.prototype.dropKeySpace = function(keyspace, callback) {
  var args = Array.prototype.slice.call(arguments);
  if (!this.ready) {
    this.queue.push([arguments.callee, args]);
    return;
  }

  this.thrift_client.system_drop_keyspace(keyspace, callback);
};

/**
 * Get column family to perform query or mutation
 *
 * @param name ColumnFamily name to get
 * @return An instance of ColumnFamily
 */
Client.prototype.getColumnFamily = function(name) {
  return new ColumnFamily(this, name);
};

/**
 * Close connection
 */
Client.prototype.close = function() {
  this.connection.end();
};

/**
 * @api {private}
 */
Client.prototype.dispatch = function() {
  if (this.ready) {
    if (this.queue.length > 0) {
      var next = this.queue.shift();
      next[0].apply(this, next[1]);
      this.dispatch();
    }
  }
};

/**
 *
 * @param client Client
 * @param name name of this Column Family
 * @constructor
 */
var ColumnFamily = function(client, name) {
  this.name = name;
  this.queue = [];
  this.ready = false;
  this.client_ = client;

  var self = this;
  this.client_.on('keyspaceSet', function(cfdef) {
    // check to see if column name is valid
    var cf = cfdef[self.name];
    if (!cf) {
      // column family does not exist
      self.client_.emit('error', new Error('Column Family ' + self.name + ' does not exist.'));
    }

    // copy all cfdef properties
    for (var prop in cf) {
      if (cf.hasOwnProperty(prop)) {
        self[prop] = cf[prop];
      }
    }
    self.isSuper = self.column_type === 'Super';
    self.ready = true;

    self.dispatch();
  });
};

/**
 * Get data from cassandra
 *
 * @param keys row keys to fetch
 * @param columns optional. which columns to retrieve
 * @param options optional. valid params are start, finish, reversed, count
 * @param callback callback function which called after data retrieval.
 */
ColumnFamily.prototype.get = function() {
  var args = Array.prototype.slice.call(arguments);
  if (!this.ready) {
    this.queue.push([arguments.callee, args]);
    return;
  }

  // last argument may be callback
  var callback;
  if (typeof args[args.length - 1] === 'function') {
    callback = args.pop();
  }
  // keys to get
  var keys = args.shift();
  // if only one key specified, turn it to array
  if (!(keys instanceof Array)) {
    keys = [keys];
  }

  var method_args = this.isSuper ? this.parseArgumentsForSuperCF_(args) : this.parseArgumentsForStandardCF_(args);
  var column_parent = method_args[0];
  var predicate = method_args[1];
  var cl = method_args[2] || this.client_.defaultCL.read;

  var self = this;
  this.client_.thrift_client.multiget_slice(
    keys, column_parent, predicate, cl,
    function(err, res) {
      if (err) {
        callback(err, obj);
      }

      // array -> obj
      var obj = {};
      var key, col, sub_col;
      for (key in res) {
        if (res.hasOwnProperty(key)) {
          obj[key] = {};
          var i = res[key].length;
          while (i--) {
            col = res[key][i].super_column;
            if (col) {
              // super
              obj[key][col.name] = {};
              var j = col.columns.length;
              while (j--) {
                sub_col = col.columns[j];
                obj[key][col.name][sub_col.name] = sub_col.value;
              }
            } else {
              // standard
              col = res[key][i].column;
              obj[key][col.name] = col.value;
            }
          }
        }
      }
      if (keys.length == 1) {
        obj = obj[keys[0]];
      }
      callback(err, obj);
    });
};

/**
 * Get column count from cassandra
 *
 * @param keys row keys to fetch
 * @param columns optional. which columns to retrieve
 * @param options optional. valid params are start, finish, reversed, count
 * @param callback callback function which called after data retrieval.
 */
ColumnFamily.prototype.count = function() {
  var args = Array.prototype.slice.call(arguments);
  if (!this.ready) {
    this.queue.push([arguments.callee, args]);
    return;
  }

  // last argument may be callback
  var callback;
  if (typeof args[args.length - 1] === 'function') {
    callback = args.pop();
  }
  // keys to get
  var keys = args.shift();
  // if only one key specified, turn it to array
  if (!(keys instanceof Array)) {
    keys = [keys];
  }

  var method_args = this.isSuper ? this.parseArgumentsForSuperCF_(args) : this.parseArgumentsForStandardCF_(args);
  var column_parent = method_args[0];
  var predicate = method_args[1];
  var cl = method_args[2] || this.client_.defaultCL.read;

  this.client_.thrift_client.multiget_count(
    keys, column_parent, predicate, cl,
    function(err, res) {
      if (err) {
        callback(err, obj);
      }
      
      var obj = {};
      var key, count;
      for (key in res) {
        if (res.hasOwnProperty(key)) {
          obj[key] = res[key];
        }
      }
      if (keys.length == 1) {
        obj = obj[keys[0]];
      }
      callback(err, obj);
    });
};

/**
 * slice data
 */
ColumnFamily.prototype.slice = function() {
  this.client_.emit('error', new Error('slice(get_range_slices, get_indexed_slices) not supported.'));
};

/**
 * set (insert or update) data
 */
ColumnFamily.prototype.set = function() {
  var args = Array.prototype.slice.call(arguments);
  if (!this.ready) {
    this.queue.push([arguments.callee, args]);
    return;
  }

  var callback;
  if (typeof args[args.length - 1] === 'function') {
    callback = args.pop();
  }

  var key = args.shift();
  var values = args.shift() || {};
  var options = args.shift() || {};
  var cl = options.consistencyLevel || this.client_.defaultCL.write;
  var ts = new Date().getTime();

  var prop, value;
  var mutations = [], columns;
  if (this.isSuper) {
    // super
    for (prop in values) {
      if (values.hasOwnProperty(prop)) {
        columns = [];
        value = values[prop];
        for (var col in value) {
          columns.push(new ttype.Column({
            name: col,
            value: '' + value[col],
            timestamp: ts,
            ttl: null
          }));
        }
        // prop is super column name
        mutations.push(new ttype.Mutation({
          column_or_supercolumn: new ttype.ColumnOrSuperColumn({
            super_column: new ttype.SuperColumn({
              name: prop,
              columns: columns
            })
          })
        }));
      }
    }
  } else {
    // standard
    for (prop in values) {
      mutations.push(new ttype.Mutation({
        column_or_supercolumn: new ttype.ColumnOrSuperColumn({
          column: new ttype.Column({
            name: prop,
            value: '' + values[prop],
            timestamp: ts,
            ttl: null
          })
        })
      }));
    }
  }

  var mutation_map = {};
  mutation_map[key] = {};
  mutation_map[key][this.name] = mutations;

  this.client_.thrift_client.batch_mutate(mutation_map, cl, callback);
};

/**
 * remove data
 */
ColumnFamily.prototype.remove = function() {
  var args = Array.prototype.slice.call(arguments);
  if (!this.ready) {
    this.queue.push([arguments.callee, args]);
    return;
  }

  var callback;
  if (typeof args[args.length - 1] === 'function') {
    callback = args.pop();
  }

  var key = args.shift();

  var method_args = this.isSuper ? this.parseArgumentsForSuperCF_(args) : this.parseArgumentsForStandardCF_(args);
  var column_parent = method_args[0];
  var predicate = method_args[1];
  var cl = method_args[2] || this.client_.defaultCL.write;

  var ts = new Date().getTime();

  var mutations = [];
  mutations.push(new ttype.Mutation({
    deletion: new ttype.Deletion({
      timestamp: ts,
      super_column: column_parent.super_column,
      predicate: predicate.column_names ? predicate : null
    })
  }));

  var mutation_map = {};
  mutation_map[key] = {};
  mutation_map[key][this.name] = mutations;

  this.client_.thrift_client.batch_mutate(mutation_map, cl, callback);
};

/**
 * truncate this column family
 **/
ColumnFamily.prototype.truncate = function() {
  var args = Array.prototype.slice.call(arguments);
  if (!this.ready) {
    this.queue.push([arguments.callee, args]);
    return;
  }

  var callback = args.shift();
  this.client_.thrift_client.truncate(this.name, callback);
}

/**
 * dispatch queries when client is ready
 * @api private
 **/
ColumnFamily.prototype.dispatch = function() {
  if (this.ready) {
    if (this.queue.length > 0) {
      var next = this.queue.shift();
      next[0].apply(this, next[1]);
      this.dispatch();
    }
  }
};

/**
 * 
 * @api private
 * @param args
 * @return [ColumnParent, SlicePredicate, ConsistencyLevel]
 */
ColumnFamily.prototype.parseArgumentsForSuperCF_ = function(args) {
  var default_options = {
    start: '',
    finish: '',
    reversed: false,
    count: 100,
    consistencyLevel: null
  };
  var column_parent = {
    column_family: this.name
  };
  var predicate = {};

  var super_column_or_options = args.shift();
  var options = default_options;

  if (super_column_or_options) {
    // first argumet may be super column name
    if (super_column_or_options instanceof String ||
        typeof super_column_or_options === 'string') {
      column_parent.super_column = super_column_or_options;
      var columns_or_options = args.shift();
      if (columns_or_options) {
        var columns, options, option_name;
        if (typeof columns_or_options.slice === 'function') {
          // first argument is column name(s)
          columns = columns_or_options.slice();
          if (!(columns instanceof Array)) {
            columns = [columns];
          }
          predicate.column_names = columns;
          options = args.shift() || default_options;
        } else {
          // update default option with given value
          for (option_name in columns_or_options) {
            if (columns_or_options.hasOwnProperty(option_name)) {
              options[option_name] = columns_or_options[option_name];
            }
          }
          predicate.slice_range = new ttype.SliceRange(options);
        }
      } else {
        predicate.slice_range = new ttype.SliceRange(options);
      }
    } else {
      // update default option with given value
      for (option_name in super_column_or_options) {
        if (super_column_or_options.hasOwnProperty(option_name)) {
          options[option_name] = super_column_or_options[option_name];
        }
      }
      predicate.slice_range = new ttype.SliceRange(options);
    }
  } else {
    predicate.slice_range = new ttype.SliceRange(options);
  }

  return [new ttype.ColumnParent(column_parent),
         new ttype.SlicePredicate(predicate),
         options.consistencyLevel];
}

/**
 *
 * @api private
 * @param args
 * @return [ColumnParent, SlicePredicate, ConsistencyLevel]
 */
ColumnFamily.prototype.parseArgumentsForStandardCF_ = function(args) {
  var default_options = {
    start: '',
    finish: '',
    reversed: false,
    count: 100,
    consistencyLevel: null
  };
  var column_parent = {
    column_family: this.name
  };
  var predicate = {};

  var columns_or_options = args.shift();
  var options = default_options;

  if (columns_or_options) {
    var columns, options, option_name;
    if (typeof columns_or_options.slice === 'function') {
      // first argument is column name(s)
      columns = columns_or_options.slice();
      if (!(columns instanceof Array)) {
        columns = [columns];
      }
      predicate.column_names = columns;
      options = args.shift() || default_options;
    } else {
      // update default option with given value
      for (option_name in columns_or_options) {
        if (columns_or_options.hasOwnProperty(option_name)) {
          options[option_name] = columns_or_options[option_name];
        }
      }
      predicate.slice_range = new ttype.SliceRange(options);
    }
  } else {
    predicate.slice_range = new ttype.SliceRange(options);
  }

  return [new ttype.ColumnParent(column_parent),
         new ttype.SlicePredicate(predicate),
         options.consistencyLevel];
}

/** module exports */

exports.Client = Client;
exports.ConsistencyLevel = ttype.ConsistencyLevel;
