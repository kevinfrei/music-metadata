/* jshint maxlen: 130 */

var path = require('path')
var fs = require('fs')
var mm = require('..')
var test = require('tape')

test('MusicBrains/Picard tags in FLAC', function (t) {
  t.plan(46)

  var sample = (process.browser) ?
    new window.Blob([ fs.readFileSync(__dirname + '/samples/MusicBrainz-Picard-tags.flac') ])
    : fs.createReadStream(path.join(__dirname, '/samples/MusicBrainz-Picard-tags.flac'))

  var expectedCommonTags = {
    'title': 'Brian Eno',
    'artist': [ 'MGMT' ],
    'albumartist': [ 'MGMT' ],
    'album': 'Oracular Spectacular / Congratulations',
    'track': { no: 7, of: 9 },
    'disk': { no: 2, of: 2 },
    'discsubtitle': 'Cogratulations',
    'date': '2011-09-11',
    'year': '2011',
    'releasecountry': 'XE',
    'asin': 'B0055U9LNC',
    'barcode': '886979357723',
    'label': 'Sony Music',
    'catalognumber': '88697935772',
    'originalyear': '2011',
    'originaldate': '2011-09-11',
    'releasestatus': 'official',
    'releasetype': [ 'album', 'compilation' ],
    'comment': ['EAC-Secure Mode'],
    'genre': ['Alt. Rock'],
    'duration': 271.7733333333333,
    'musicbrainz_albumid': '6032dfc4-8880-4fea-b1c0-aaee52e1113c',
    'musicbrainz_recordingid': 'b0c1d984-ba93-4167-880a-ac02255bf9e7',
    'musicbrainz_albumartistid': [ 'c485632c-b784-4ee9-8ea1-c5fb365681fc' ],
    'musicbrainz_artistid': [ 'c485632c-b784-4ee9-8ea1-c5fb365681fc' ],
    'musicbrainz_releasegroupid': '9a3237f4-c2a5-467f-9a8e-fe1d247ff520',
    'musicbrainz_trackid': '0f53f7a3-89df-4069-9357-d04252239b6d'
  }

  mm(sample, function (err, result) {
    t.error(err)

    // Compare expectedCommonTags with result.common
    Object.keys(expectedCommonTags).forEach(function (tagKey) {
      t.deepEqual(result.common[ tagKey ], expectedCommonTags[ tagKey ], 'common tag: ' + tagKey)
    })

    t.strictEqual(result.common.picture[ 0 ].format, 'jpg', 'picture format')
    t.strictEqual(result.common.picture[ 0 ].data.length, 175668, 'picture length')

    t.end()
  })

    .on('picture', function (result) {
      t.strictEqual(result[ 0 ].format, 'jpg', 'aliased picture format')
      t.strictEqual(result[ 0 ].data.length, 175668, 'aliased picture length')
    })

    // raw tests
    .on('TITLE', function (result) {
      t.strictEqual(result, 'Brian Eno', 'raw TITLE')
    })
    .on('ARTIST', function (result) {
      t.strictEqual(result, 'MGMT', 'raw ARTIST')
    })
    .on('DATE', function (result) {
      t.strictEqual(result, '2011-09-11', 'raw DATE')
    })
    .on('TRACKNUMBER', function (result) {
      t.strictEqual(result, '7', 'raw TRACKNUMBER')
    })
    .on('GENRE', function (result) {
      t.strictEqual(result, 'Alt. Rock', 'raw GENRE')
    })
    .on('COMMENT', function (result) {
      t.strictEqual(result, 'EAC-Secure Mode', 'raw COMMENT')
    })
    .on('METADATA_BLOCK_PICTURE', function (result) {
      t.strictEqual(result.type, 'Cover (front)', 'raw METADATA_BLOCK_PICTURE type')
      t.strictEqual(result.format, 'image/jpeg', 'raw METADATA_BLOCK_PICTURE format')
      t.strictEqual(result.description, '', 'raw METADATA_BLOCK_PICTURE description')
      t.strictEqual(result.width, 450, 'raw METADATA_BLOCK_PICTURE width')
      t.strictEqual(result.height, 450, 'raw METADATA_BLOCK_PICTURE height')
      t.strictEqual(result.colour_depth, 24, 'raw METADATA_BLOCK_PICTURE colour depth')
      t.strictEqual(result.indexed_color, 0, 'raw METADATA_BLOCK_PICTURE indexed_color')
      t.strictEqual(result.data.length, 175668, 'raw METADATA_BLOCK_PICTURE length')
    })

})
