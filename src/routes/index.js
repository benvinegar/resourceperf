var express = require('express');
var router = express.Router();

var models = require('../models');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Create a test' });
});

router.post('/', function(req, res, next) {
  var testCase = models.TestCase.build(req.body);
  testCase
    .save()
    .then(function () {
      var snippet = models.Snippet.build(req.body.snippet);
      testCase
        .addSnippet(snippet)
        .then(function () {
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
