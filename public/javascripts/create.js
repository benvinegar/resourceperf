$(function () {
  $('.js-add-another').click(function () {
    var count = $('.document').length;
    $.get('/document/new?index=' + count, function (template) {
      $('.document:last').after(template);
    });
  });
});