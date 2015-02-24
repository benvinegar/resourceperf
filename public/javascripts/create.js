$(function () {
  $('.js-add-another').click(function () {
    var count = $('.snippet').length;
    $.get('/snippet/new?index=' + count, function (template) {
      $('.snippet:last').after(template);
    });
  });
});