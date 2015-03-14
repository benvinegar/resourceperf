process.env.NODE_ENV = 'test';

var request = require('supertest'),
  express = require('express');

var app = require('../app-build/app'),
  models = require('../app-build/models');

models.sequelize.sync({
  force: true // drops/recreates tables
});

describe('GET /', function () {
  it('should respond with 200', function (done) {
    request(app)
      .get('/')
      .expect(200, done);
  });
});

describe('POST /', function () {
  describe('with valid data', function () {
    it('should create a new testcase and 302');
  });

  describe('with invalid data', function () {
    it('should fail to create a new testcase and 400');
  });
});

describe('GET /:slug', function () {
  it('should respond with 404 if no matching testcase slug', function (done) {
    request(app)
      .get('/foo')
      .expect(404, done);
  });

  it('should respond with 200 if matching testcase slug', function (done) {
    models.TestCase.build({
      name: 'foo',
      slug: 'foo'
    }).save().then(function () {
      request(app)
        .get('/foo')
        .expect(200, done);
    });
  });
});