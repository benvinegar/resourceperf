var express = require('express');
var router = express.Router();

var models = require('../models');
var Sequelize = require('sequelize');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Create a test' });
});

router.post('/', function(req, res, next) {
  var chainer = new Sequelize.Utils.QueryChainer;

  // Create test case
  var testCase = models.TestCase.build(req.body);
  chainer.add(testCase.save());

  // Create snippets
  var snippets = req.body.snippet.map((s) => models.Snippet.build(s));
  snippets.forEach((s) => chainer.add(s.save()));

  chainer
    .run()
    .then(function () {
      // Associate snippets w/ test case
      testCase.setSnippets(snippets).then(function () {
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

    res.render('testcase', {
      title: testcase.name,
      testcase: testcase
    });
  });
});

module.exports = router;
