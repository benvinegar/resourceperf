(function () {
  var iframe = $('<iframe>')
    .hide()
    .appendTo('body');
  
  var documentData = $('#documents').text();
  var documents = JSON.parse(documentData);

  var timings = [];

  function nextDocument(first) {
    var next = documents.shift();

    if (!first)
      // Use parse/stringiy to deep copy timing data
      // (reference will be lost when we redirect the iframe)
      timings.push(
        JSON.parse(JSON.stringify(
          iframe[0].contentWindow.performance.timing
        ))
      );

    if (!next) 
      return void report();

    iframe.attr('src', '/snippet/' + next.id);
  }

  function report() {
    var domComplete = $('.js-dom-complete'),
      onload = $('.js-onload');

    timings.forEach(function (timing, index) {
      var start = timing.connectStart;
      domComplete.eq(index).text(timing.domComplete - start);
      onload.eq(index).text(timing.loadEventEnd - start);
    });
  }

  iframe.on('load', function () {
    nextDocument.call(this, false);
  });

  $('#start').click(function () {
    nextDocument.call(this, true);
  });
})();