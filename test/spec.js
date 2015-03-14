process.env.NODE_ENV = 'test';

var request = require('supertest'),
  express = require('express'),
  chai = require('chai'),
  expect = chai.expect;

var app = require('../app-build/app'),
  models = require('../app-build/models');

chai.use(require("chai-as-promised"));

before(function(done) {
  // Wait for database to synchronize before firing up
  // any tests
  models.sequelize.sync({
    force: true // drops/recreates tables
  }).then(function () {
    done();
  });
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
    before(function (done) {
      this.request = request(app)
        .post('/')
        .send({
          name: 'test',
          slug: 'test-slug',
          desc: 'test description',
          document: [{
            title: 'some doc',
            head: 'head',
            body: 'body'
          }]
        })
        .end(done);
    });

    it('should 302', function () {
      expect(this.request.response.status).to.equal(302);
    })

    it('should create a new testcase', function () {
      var testcase = models.TestCase.find({
        where: { slug: 'test-slug' }
      });

      return expect(testcase).to.eventually.have.property('dataValues')
    });
  });

  describe('with invalid data', function () {
    // TODO: implement model validations
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