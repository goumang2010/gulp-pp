/* Modules */

var chai = require('chai');
var should = chai.should();
var gutil  = require('gulp-util');
var pandoc = require('../index');

/* Tests */

describe('pandoc()', function() {

  it('should throw an error if pdc args are incorrect', function(done) {
    var file = new gutil.File({
      path: 'test.md',
      contents: new Buffer('"This is a test."')
    });

    var stream = pandoc({
      from: 'markdown',
      to: 'jjs',
      ext: '.html',
      args: ['--smart']
    });

    stream.on('error', function(err) {
      err.should.include('Error: pandoc exited with code 9');
      done();
    });

    stream.write(file);
  });

  it('should compile Markdown to HTML', function(done) {
    var file = new gutil.File({
      path: 'test.md',
      contents: new Buffer('"This is a test."')
    });

    var stream = pandoc({
      from: 'markdown',
      to: 'html',
      ext: '.html',
      args: ['--smart']
    });

    stream.on('error', done);

    stream.on('data', function(file) {
      var content = file.contents.toString().trimRight(); // [1]
      file.relative.should.equal('test.html');
      content.should.equal('<p>“This is a test.”</p>');
      done();
    });

    stream.write(file);
  });
});
