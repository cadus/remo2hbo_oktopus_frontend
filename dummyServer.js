//This generates an event stream with random values to simulate the actual sensor data.

const http = require("http");

http
  .createServer((request, response) => {
    console.log('Request url: ${request.url}');

    const eventHistory = [];

    request.on("close", () => {
      if (!response.finished) {
        response.end();
        console.log("Stopped sending events.");
      }
    });

    if (request.url.toLowerCase() === "/events") {
      response.writeHead(200, {
        Connection: "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*"
      });

      checkConnectionToRestore(request, response, eventHistory);

      sendEvents(response, eventHistory);
    } else {
      response.writeHead(404);
      response.end();
    }
  })
  .listen(5000, () => {
    console.log("Server running at http://127.0.0.1:5000/");
  });

  function generateEventData(response, eventHistory, bioSignal) {
    setInterval(() => {
      if (!response.finished) {
        const eventString =
          'event: ' + bioSignal + '\ndata: ' + Math.round(Math.random()*100) + '\n\n';
        response.write(eventString);
        eventHistory.push(eventString);
      }
    }, 500);
  }

  function sendEvents(response, eventHistory) {

      generateEventData(response, eventHistory, 'ekg');
      generateEventData(response, eventHistory, 'pulse');
      generateEventData(response, eventHistory, 'temperature');
      generateEventData(response, eventHistory, 'oxygen');
      generateEventData(response, eventHistory, 'systole');
      generateEventData(response, eventHistory, 'diastole');




      setTimeout(() => {
        if (!response.finished) {
          const eventString = "id: 64\nevent: closedConnection\ndata: \n\n";
          eventHistory.push(eventString);
        }
      }, 60000);
  }

  function checkConnectionToRestore(request, response, eventHistory) {
    if (request.headers["last-event-id"]) {
      const eventId = parseInt(request.headers["last-event-id"]);

      const eventsToResend = eventHistory.filter(e => e.id > eventId);

      eventsToResend.forEach(e => {
        if (!response.finished) {
          response.write(e);
        }
      });
    }
  }
