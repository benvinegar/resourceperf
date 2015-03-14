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

describe('testcase', function () {
  describe('GET / (/testcase/new)', function () {
    it('should respond with 200', function (done) {
      request(app)
        .get('/')
        .expect(200, done);
    });
  });

  describe('POST / (/testcase/create)', function () {
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

  before(function(done) {
    models.TestCase.build({
      name: 'foo',
      slug: 'foo'
    }).save().then(done.bind(this, null));
  });

  describe('GET /:slug (/testcase/show)', function () {
    it('should respond with 404 if no matching testcase slug', function (done) {
      request(app)
        .get('/does-not-exist')
        .expect(404, done);
    });

    it('should respond with 200 if matching testcase slug', function (done) {
      request(app)
        .get('/foo')
        .expect(200, done);
    });
  });

  describe('GET /:slug/edit', function () {
    it('should respond with 404 if no matching testcase slug', function (done) {
      request(app)
        .get('/does-not-exist/edit')
        .expect(404, done);
    });

    it('should respond with 200 if matching testcase slug', function (done) {
      request(app)
        .get('/foo/edit')
        .expect(200, done);
    });
  });

  describe('POST /:slug/update', function () {
    it('should update an existing testcase\'s properties');
  });
});

describe('document', function () {
  before(function(done) {
    models.Document.build({
      id: 1337,
      title: 'jquery loader',
      head: '<script src="https://code.jquery.com/jquery-2.1.3.js"></script>',
      body: '<!-- empty -->'
    }).save().then(done.bind(this, null));
  });

  describe('GET /document/new', function () {
    it('should respond with 200', function (done) {
      request(app)
        .get('/document/new')
        .expect(200, done);
    });
  });

  describe('GET /document/:id', function () {
    it('should respond with 404 if no matching document id', function (done) {
      request(app)
        .get('/document/123456789')
        .expect(404, done);
    });

    it('should respond with 200 if matching document id', function (done) {
      request(app)
        .get('/document/1337')
        .expect(200, done);
    });
  });

  describe('GET /document/:id/nocache', function () {
    it('should respond with 404 if no matching document id', function (done) {
      request(app)
        .get('/document/123456789')
        .expect(404, done);
    });

    it('should respond with 200 if matching document id', function (done) {
      request(app)
        .get('/document/1337')
        .expect(200, done);
    });
  });
});
