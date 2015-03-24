import express from 'express';
import Sequelize from 'sequelize';

import cheerio from 'cheerio';
import jsesc from 'jsesc';
import _ from 'lodash';

import models from '../models';

var router = express.Router();

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
  var documents = req.body.document.map(s => models.Document.build(s));
  documents.forEach(s => chainer.add(s.save()));

  chainer
    .run()
    .then(() => {
      // Associate documents w/ test case
      testCase.setDocuments(documents).then(function () {
        res.redirect('/' + req.body.slug);
      });
    });
});

router.get('/browse', function (req, res, next) {
  models.TestCase.findAll({
    order: '"createdAt" DESC',
    limit: 50
  }).then(function (testcases) {
    res.render('testcase/index', {
      testcases: testcases
    });
  });
});

router.get('/:slug', function (req, res, next) {
  models.TestCase.find({
    where: { slug: req.params.slug },
    include: [ models.Document ]
  }).then(function (testcase) {
    if (!testcase) {
      res.status(404);
      return res.render('404');
    }

    var documents = _.sortBy(testcase.Documents, 'id');
    res.render('testcase/show', {
      title: testcase.name,
      testcase: testcase,
      documents: documents,
      documentJson: JSON.stringify(documents).replace(/\</g, '\\\\u005C')
    });
  });
});

router.get('/:slug/edit', function (req, res, next) {
  models.TestCase.find({
    where: { slug: req.params.slug },
    include: [ models.Document ]
  }).then(function (testcase) {
    if (!testcase) {
      res.status(404);
      return res.render('404');
    }

    res.render('testcase/edit', {
      title: testcase.name,
      testcase: testcase,
      documents: testcase.Documents
    });
  });
});

router.post('/:slug/update', function (req, res, next) {
  models.TestCase.find({
    where: { id: req.body.id },
    include: [ models.Document ]
  }).then(function (testcase) {
    if (!testcase) {
      res.status(404);
      return res.render('404');
    }

    var chainer = new Sequelize.Utils.QueryChainer;

    chainer.add(
      testcase.updateAttributes(_.pick(req.body, ['name', 'desc', 'slug']))
    );

    var documentsById = _.inject(testcase.Documents, (obj, doc) => {
      obj[doc.id] = doc;
      return obj;
    }, {});

    req.body.document.forEach(params => {

      if (params.id in documentsById) {
        // Update existing
        chainer.add(documentsById[params.id].updateAttributes(params));
      } else {
        // Add new document to testcase
        chainer.add(models.Document.build(_.extend(params, {
          TestCaseId: testcase.id
        })).save());
      }
    });

    chainer
      .run()
      .then(() => res.redirect('/' + req.body.slug))
  });
});

router.get('/document/new', function (req, res, next) {
  res.render('partials/_document', {
    index: req.query.index
  });
});

router.get('/document/:id/nocache', function (req, res, next) {
  models.Document.find(req.params.id).then(function (document) {
    if (!document) {
      res.status(404);
      return res.render('404');
    }

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
    if (!document) {
      res.status(404);
      return res.render('404');
    }

    res.render('document', {
      document: document,
      head: document.head,
      body: document.body,
      layout: false
    });
  });
});

export default router;