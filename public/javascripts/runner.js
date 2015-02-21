(function () {
  var iframe = $('<iframe>')
    .hide()
    .appendTo('body');
  
  var documentData = $('#documents').text();
  var documents = JSON.parse(documentData);

  var timers = [];
  var last = null;

  function nextDocument() {
    var next = documents.shift();

    if (last)
      timers.push(+(new Date()) - last);

    if (!next) return void report();

    last = +(new Date());

    iframe.attr('src', '/snippet/' + next.id);
  }

  function report() {
    var tds = $('.time');
    timers.forEach(function (time, index) {
      tds.eq(index).text(time);
    });
  }

  iframe.on('load', nextDocument);

  $('#start').click(nextDocument);
})();