var express = require('express');
var router = express.Router();

var models = require('../models');
var Sequelize = require('sequelize');

var jsesc = require('jsesc');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Create a test' });
});

router.post('/', function(req, res, next) {
  var chainer = new Sequelize.Utils.QueryChainer;

  // Create test case
  var testCase = models.TestCase.build(req.body);
  chainer.add(testCase.save());

  // Create documents
  var documents = req.body.document.map((s) => models.Document.build(s));
  documents.forEach((s) => chainer.add(s.save()));

  chainer
    .run()
    .then(function () {
      // Associate documents w/ test case
      testCase.setDocuments(documents).then(function () {
        res.redirect('/' + req.body.slug);
      });
    });
});


router.get('/:slug', function(req, res, next) {
  models.TestCase.find({
    where: {slug: req.params.slug }
  }).then(function (testcase) {
    if (!testcase) {
      res.status(404);
      return res.render('404');
    }

    testcase.getDocuments().then(function (documents) {
      res.render('testcase', {
        title: testcase.name,
        testcase: testcase,
        documents: documents,
        documentJson: JSON.stringify(documents).replace(/\</g, '\\\\u005C')
      });
    });
  });
});

router.get('/document/new', function (req, res, next) {
  res.render('partials/_document', {
    layout: false,
    index: req.query.index
  });
});

router.get('/document/:id', function (req, res, next) {
  models.Document.find(req.params.id).then(function (document) {
    res.render('document', {
      document: document
    });
  });
});


module.exports = router;
