create keyspace tatami
  with placement_strategy = 'SimpleStrategy'
  and strategy_options = {replication_factor : 1}
  and durable_writes = true;

use tatami;

create column family Counter
  with column_type = 'Standard'
  and comparator = 'UTF8Type'
  and default_validation_class = 'CounterColumnType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family Dayline
  with column_type = 'Standard'
  and comparator = 'UTF8Type'
  and default_validation_class = 'CounterColumnType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family Discussion
  with column_type = 'Standard'
  and comparator = 'BytesType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family Domain
  with column_type = 'Standard'
  and comparator = 'BytesType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family Favline
  with column_type = 'Standard'
  and comparator = 'UUIDType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family Followers
  with column_type = 'Standard'
  and comparator = 'BytesType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family Friends
  with column_type = 'Standard'
  and comparator = 'BytesType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family Registration
  with column_type = 'Standard'
  and comparator = 'BytesType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family Rss
  with column_type = 'Standard'
  and comparator = 'BytesType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family MailDigest
  with column_type = 'Standard'
  and comparator = 'BytesType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family Shares
  with column_type = 'Standard'
  and comparator = 'BytesType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family Status
  with column_type = 'Standard'
  and comparator = 'BytesType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family Tagline
  with column_type = 'Standard'
  and comparator = 'UUIDType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family Timeline
  with column_type = 'Standard'
  and comparator = 'UUIDType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family TimelineShares
  with column_type = 'Standard'
  and comparator = 'UUIDType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family User
  with column_type = 'Standard'
  and comparator = 'BytesType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family Userline
  with column_type = 'Standard'
  and comparator = 'UUIDType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family UserlineShares
  with column_type = 'Standard'
  and comparator = 'UUIDType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family Trends
  with column_type = 'Standard'
  and comparator = 'UUIDType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family TagFollowers
  with column_type = 'Standard'
  and comparator = 'BytesType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family UserTags
  with column_type = 'Standard'
  and comparator = 'BytesType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family TagCounter
  with column_type = 'Standard'
  and comparator = 'UTF8Type'
  and default_validation_class = 'CounterColumnType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family UserTrends
  with column_type = 'Standard'
  and comparator = 'UUIDType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family Mentionline
  with column_type = 'Standard'
  and comparator = 'UUIDType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family Group
  with column_type = 'Standard'
  and comparator = 'BytesType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family GroupDetails
  with column_type = 'Standard'
  and comparator = 'BytesType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family GroupMembers
  with column_type = 'Standard'
  and comparator = 'BytesType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family UserGroups
  with column_type = 'Standard'
  and comparator = 'BytesType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family GroupCounter
  with column_type = 'Standard'
  and comparator = 'UTF8Type'
  and default_validation_class = 'CounterColumnType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family Groupline
  with column_type = 'Standard'
  and comparator = 'UUIDType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family TatamiBotDuplicate
  with column_type = 'Standard'
  and comparator = 'BytesType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family Attachment
  with column_type = 'Standard'
  and comparator = 'BytesType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family UserAttachments
  with column_type = 'Standard'
  and comparator = 'UUIDType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family StatusAttachments
  with column_type = 'Standard'
  and comparator = 'UUIDType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family DomainConfiguration
  with column_type = 'Standard'
  and comparator = 'BytesType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

create column family Domainline
  with column_type = 'Standard'
  and comparator = 'UUIDType'
  and default_validation_class = 'BytesType'
  and key_validation_class = 'BytesType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};
