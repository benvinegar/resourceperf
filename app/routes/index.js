var express = require('express');
var router = express.Router();

var cheerio = require('cheerio');

var models = require('../models');
var Sequelize = require('sequelize');

var jsesc = require('jsesc');
var _ = require('lodash');

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Welcome to ResourcePerf',
    testcase: {},
    documents: [{}, {}] // 2
  });
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

router.get('/:slug', function (req, res, next) {
  models.TestCase.find({
    where: {slug: req.params.slug }
  }).then(function (testcase) {
    if (!testcase) {
      res.status(404);
      return res.render('404');
    }

    testcase.getDocuments().then(function (documents) {
      res.render('testcase/show', {
        title: testcase.name,
        testcase: testcase,
        documents: documents,
        documentJson: JSON.stringify(documents).replace(/\</g, '\\\\u005C')
      });
    });
  });
});

router.get('/:slug/edit', function (req, res, next) {
  models.TestCase.find({
    where: {slug: req.params.slug }
  }).then(function (testcase) {
    if (!testcase) {
      res.status(404);
      return res.render('404');
    }

    testcase.getDocuments().then(function (documents) {
      res.render('testcase/edit', {
        title: testcase.name,
        testcase: testcase,
        documents: documents
      });
    });
  });
});

router.post('/:slug/update', function (req, res, next) {
  var chainer = new Sequelize.Utils.QueryChainer;

  chainer.add(
    models.TestCase.update(_.pick(req.body, ['name', 'desc', 'slug']), {
      where: { id : req.body.id }
    })
  );

  req.body.document.forEach(function (doc) {
    chainer.add(models.Document.update(_.omit(doc, 'id'), {
      where: { id : doc.id }
    }));
  });

  chainer
    .run()
    .then(function () {
      res.redirect('/' + req.body.slug);
    });
});

router.get('/document/new', function (req, res, next) {
  res.render('partials/_document', {
    index: req.query.index
  });
});

router.get('/document/:id/nocache', function (req, res, next) {
  models.Document.find(req.params.id).then(function (document) {
    // current time in microseconds
    var hrtime = process.hrtime();
    var cachebuster = hrtime[0] * 1000000 + hrtime[1] / 1000;

    var $ = cheerio.load(document.head);
    $('[src]').each(function () {
      $(this).attr('src', $(this).attr('src') + '?' + cachebuster);
    });
    var head = $.html();

    $ = cheerio.load(document.body);
    $('[src]').each(function () {
      $(this).attr('src', $(this).attr('src') + '?' + cachebuster);
    });
    var body = $.html();

    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');


    res.render('document', {
      document: document,
      head: head,
      body: body,
      layout: false
    });
  });
});

router.get('/document/:id', function (req, res, next) {
  models.Document.find(req.params.id).then(function (document) {
    res.render('document', {
      document: document,
      head: document.head,
      body: document.body,
      layout: false
    });
  });
});

module.exports = router;