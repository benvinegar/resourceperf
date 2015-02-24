(function () {
  var documentData = $('#documents').text();
  var documents = JSON.parse(documentData);

  var allTimings = [];

  function avg(arr, key) {
    return arr.reduce(function (r, x) {
      return r + x[key];
    }, 0) / arr.length;
  }

  function nextDocument() {

    var next = documents.shift(),
      frameTimings = [],
      count = 0;

    var iframe = $('<iframe>')
      .hide()
      .appendTo('body')
      .load(function () {
        // Use parse/stringiy to deep copy timing data
        // (reference will be lost when we redirect the iframe)
        var win = iframe[0].contentWindow;
        frameTimings.push(JSON.parse(JSON.stringify(
          win.performance.timing
        )));

        if (count++ < 10)
          win.location.reload();
        else {

          allTimings.push({
            domComplete: frameTimings.reduce(function (r, t) {
             return r + (t.domComplete - t.connectStart); 
            }, 0) / count,
            onload: frameTimings.reduce(function (r, t) {
              return r + (t.loadEventEnd - t.connectStart);
            }, 0) / count
          });

          if (documents.length)
            nextDocument();
          else
            report();
        }
      })
      .attr('src', '/document/' + next.id);
  }

  function report() {
    var domComplete = $('.js-dom-complete'),
      onload = $('.js-onload');

    allTimings.forEach(function (timing, index) {
      domComplete.eq(index).text(timing.domComplete.toFixed(3));
      onload.eq(index).text(timing.onload.toFixed(3));
    });
  }

  $('#start').click(function () {
    nextDocument.call(this, true);
  });
})();