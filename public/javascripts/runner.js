(function () {
  var documentData = $('#documents').text(),
    documents = JSON.parse(documentData);

  var regularTimings = [],
    nocacheTimings = [];

  function benchmark(url, repetitions, callback) {
    var frameTimings = [],
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

        if (count++ < repetitions)
          win.location.reload();
        else {
          iframe.remove();
          callback(frameTimings);
          callback({
            // calculate mean
            domComplete: frameTimings.reduce(function (r, t) {
             return r + (t.domComplete - t.connectStart); 
            }, 0) / count,
            onload: frameTimings.reduce(function (r, t) {
              return r + (t.loadEventEnd - t.connectStart);
            }, 0) / count
          });
        }
      })
      .attr('src', url);
  }

  function nextDocument() {
    var next = documents.shift(),
      regularUrl = '/document/' + next.id,
      nocacheUrl = '/document/' + next.id + '/nocache',
      loadsPerDocument = 5;

    benchmark(regularUrl, loadsPerDocument + 1, function (frameTimings) {
      // throw out first timing; need to prime cache first
      frameTimings.shift();

      regularTimings.push({
        // calculate mean
        domComplete: frameTimings.reduce(function (r, t) {
         return r + (t.domComplete - t.connectStart); 
        }, 0) / loadsPerDocument,
        onload: frameTimings.reduce(function (r, t) {
          return r + (t.loadEventEnd - t.connectStart);
        }, 0) / loadsPerDocument
      });

      benchmark(nocacheUrl, loadsPerDocument, function (frameTimings) {
        nocacheTimings.push({
          // calculate mean
          domComplete: frameTimings.reduce(function (r, t) {
           return r + (t.domComplete - t.connectStart); 
          }, 0) / loadsPerDocument,
          onload: frameTimings.reduce(function (r, t) {
            return r + (t.loadEventEnd - t.connectStart);
          }, 0) / loadsPerDocument
        });

        if (documents.length)
          nextDocument();
        else
          report();
      });
    });
  }

  function report() {
    var cache = $('.js-cache'),
      nocache = $('.js-nocache');

    regularTimings.forEach(function (timing, index) {
      cache.eq(index).text(timing.domComplete.toFixed(3));
    });
    nocacheTimings.forEach(function (timing, index) {
      nocache.eq(index).text(timing.onload.toFixed(3));
    });
  }

  $('#start').click(function () {
    nextDocument.call(this, true);
  });
})();