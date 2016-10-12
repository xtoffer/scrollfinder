
var should = require('chai').should();
var sf = require('../scrollfinder');

var op11 = {
	rootDirectory: 'testdata/test2',
	rootURL: '',
	fileExtension: '.js',
};

var op12 = {
	rootDirectory: 'testdata/test2',
	rootURL: '',
	fileExtension: '.css',
};

var resOp11 = sf.find(op11);
var resOp12 = sf.find(op12);


var op21 = {
	rootDirectory: 'testdata/test1',
	rootURL: '',
	fileExtension: '.js',
};

var op22 = {
	rootDirectory: 'testdata/test1',
	rootURL: '/public',
	ignore: ['irrelevant_folder'],
	objectForm: 'url'
};

var resOp21 = sf.find(op21);
var resOp22 = sf.find(op22);

describe('#find on test2', function() {
	it('contains 11 .js paths', function() {
		resOp11.length.should.equal(11);
	});

	it('contains 2 .css paths', function() {
		resOp12.length.should.equal(2);
	});

	it('puts /app/app.routes.js before /app/shared/article/articleDirective.js', function() {
		resOp11.indexOf('/app/app.routes.js').should.be.below(resOp11.indexOf('/app/shared/article/articleDirective.js'));
	});


	it('produced two ignore entries', function() {
		op12.ignore.length.should.equal(2);
	});

	var resOp13 = sf.find(op12);

	it('contains no further .css paths', function() {
		resOp13.length.should.equal(0);
	});

});

describe('#find on test1', function() {
	it('contains 8 .js paths', function() {
		resOp21.length.should.equal(8);
	});

	it('ignores the irrelevant folder, finding 10 other files', function() {
		resOp22.length.should.equal(10);
	});

	it('has the correct file first in the list', function() {
		resOp21[0].should.equal('/app/app.js');
	});

	it('has the correct object notation', function() {
		('url' in resOp22[0]).should.equal(true);
	});

	it('has the correct path first in the list', function() {
		resOp22[0].url.should.equal('/public/app/app.js');
	});
});