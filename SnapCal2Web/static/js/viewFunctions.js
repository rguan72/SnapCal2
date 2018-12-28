function getCameraAccess() {
  const constraints = {
    video: true,
    audio: false,
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      player.srcObject = stream;
    });

}

function sendImage() {
  const video = document.getElementById('player');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  context.drawImage(player, 0, 0, canvas.width, canvas.height);

  let b64img = canvas.toDataURL('image/jpeg', .7);
  data = {data: b64img}

  let req = new Request(
    'API/img_process',
    {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(data)
    }
  );

  fetch(req)
    .then(function(response){
      if (response.status !== 200) {
        console.log('Issue encountered: Status Code -- ' + response.status);
        return;
      }
      else {
        document.getElementById('ind').setAttribute('aria-valuenow', 100);
        document.getElementById('ind').style.width = 100 + "%";
        document.getElementById('indText').innerHTML = 'Finished'

        // Reset progress bar after 3 seconds
        setTimeout(function(){
          document.getElementById('ind').setAttribute('aria-valuenow', 10);
          document.getElementById('ind').style.width = 10 + "%";
          document.getElementById('indText').innerHTML = 'Waiting ...';
        }, 3000);

        return;
      }
    })
    .catch(function(error){
      console.log('Fetch Error: -S', error);
    });
}

function addEvent() {
  if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
    console.log('Signed In!')
  } else {
    gapi.auth2.getAuthInstance().signIn();
  }

  // Get time zone offset
  const date1 = new Date();
  const offset = date1.getTimezoneOffset();
  const hours = offset/60;

  if (hours < 10) {
    var tzoffset = '0' + hours.toString() + ':00';
  } else {
    var tzoffset = hours.toString() + ':00';
  }

  const summary = document.getElementById('eventEntry').value;
  const location = document.getElementById('locationEntry').value;
  const start_date = document.getElementById('startdateEntry').value;
  const start_time = document.getElementById('starttimeEntry').value;
  const end_date = document.getElementById('enddateEntry').value;
  const end_time = document.getElementById('endtimeEntry').value;

  var event = {
    'summary': summary,
    'location': location,
    'start': {
      'dateTime': start_date + 'T' + start_time + ':00-' + tzoffset,
    },
    'end': {
      'dateTime': end_date + 'T' + end_time + ':00-' + tzoffset,
    }

  }


  let request = gapi.client.calendar.events.insert({
    'calendarId': 'primary',
    'resource': event,
  });


  request.execute(function(event) {
    const alert = document.getElementById('msg');
    if (event.htmlLink) {
      alert.setAttribute("class", "show alert alert-success show");
      alert.innerHTML = 'Event created: ' + event.htmlLink;
    } else {
      alert.setAttribute("class", "show alert alert-warning show");
      alert.innerHTML = 'There was an error creating your event. Make sure you entered a start time, end time, and summary.'
    }

  });

}

function addButtonListeners() {
  document.getElementById('camBtn').addEventListener('click', function(){
    sendImage();
  });

  document.getElementById('submitBtn').addEventListener('click', function(){
    addEvent();
  });
}
