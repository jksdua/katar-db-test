/* jshint node:true */
/* globals describe, before, beforeEach, it */

'use strict';

var co = require('co');
var chai = require('chai');
var path = require('path');
var should = chai.should();

describe('#DbAdapter', function() {
	var adapterConfig = require(path.join(process.cwd() + '/package.json'));
	var adapterModule = path.join(process.cwd(), adapterConfig.main || './');
	var testOptions = adapterConfig.custom && adapterConfig.custom.testOptions;

	var dbAdapter = require(adapterModule);

	describe('#model', function() {
		var db, model;

		// creates a new database and model for each test to ensure isolation
		beforeEach(function(done) {
			co(function *() {
				db = dbAdapter(testOptions);
				model = db.model('model');
				yield model.wipe();
			})(done);
		});

		describe('#insert', function() {
			it('should return the task', function(done) {
				co(function *() {
					var task = yield model.insert({ data: 'data' });
					task.should.have.property('data', 'data');
					task.should.have.property('_id');
				})(done);
			});
		});

		describe('#findById', function() {
			var recordId;

			beforeEach(function(done) {
				co(function *() {
					recordId = (yield model.insert({ data: 'data' }))._id;
					yield model.insert({ data: 'data2' });
				})(done);
			});

			it('should find the correct record', function(done) {
				co(function *() {
					var record = yield model.findById(recordId);
					record.should.eql({
						_id: recordId, data: 'data'
					});
				})(done);
			});
		});

		describe('#findOne', function() {
			var recordId;

			beforeEach(function(done) {
				co(function *() {
					recordId = (yield model.insert({ data: 'data' }))._id;
					yield model.insert({ data: 'data2' });
				})(done);
			});

			it('should find the correct record', function(done) {
				co(function *() {
					var record = yield model.findOne({ data: 'data' });
					record.should.eql({
						_id: recordId, data: 'data'
					});
				})(done);
			});

			describe('#sort', function() {
				var mockData = [
					{ a: 1, b: 2, c: 3 },
					{ a: 2, b: 3, c: 4 },
					{ a: 2, b: 2, c: 5 }
				];

				beforeEach(function(done) {
					co(function *() {
						yield model.insert(mockData[0]);
					})(done);
				});

				beforeEach(function(done) {
					co(function *() {
						yield model.insert(mockData[1]);
					})(done);
				});

				beforeEach(function(done) {
					co(function *() {
						yield model.insert(mockData[2]);
					})(done);
				});

				it('should sort when one sort key exists', function(done) {
					co(function *() {
						var record = yield model.findOne({ a: 2 }, { b: -1 });
						record.should.eql(mockData[1]);
					})(done);
				});

				it('should sort when multiple sort key exists', function(done) {
					co(function *() {
						var record = yield model.findOne({ a: 2 }, { b: 1, c: -1 });
						record.should.eql(mockData[2]);
					})(done);
				});
			});
		});

		describe('#update', function() {
			var recordId;

			beforeEach(function(done) {
				co(function *() {
					recordId = (yield model.insert({ key: 'val' }))._id;
				})(done);
			});

			it('should update if id exists', function(done) {
				co(function *() {
					yield model.update(recordId, { key2: 'val2' });
					(yield model.findById(recordId)).should.eql({
						_id: recordId, key: 'val', key2: 'val2'
					});
				})(done);
			});

			it('should not update if id doesnt exists', function(done) {
				co(function *() {
					yield model.update(recordId + 'wateva', { key2: 'val2' });
					(yield model.findById(recordId)).should.eql({
						_id: recordId, key: 'val'
					});
				})(done);
			});

			it('should return the task', function(done) {
				co(function *() {
					(yield model.update(recordId, { key2: 'val2' })).should.eql({
						_id: recordId, key: 'val', key2: 'val2'
					});
				})(done);
			});
		});

		describe('#delete', function() {
			var recordId;

			beforeEach(function(done) {
				co(function *() {
					recordId = (yield model.insert({ key: 'val' }))._id;
				})(done);
			});

			it('should delete a record', function(done) {
				co(function *() {
					should.exist(yield model.findById(recordId));
					yield model.delete(recordId);
					should.not.exist(yield model.findById(recordId));
				})(done);
			});

			it('should return the task', function(done) {
				co(function *() {
					should.exist(yield model.findById(recordId));
					(yield model.delete(recordId)).should.eql({
						_id: recordId, key: 'val'
					});
					should.not.exist(yield model.findById(recordId));
				})(done);
			});
		});
	});
});