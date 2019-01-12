function getCameraAccess() {
  const constraints = {
    video: {
      facingMode: "environment"
            },
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
        response.json().then(function(data){
          filloutEvents(data)
        });
        return;
      }
    })
    .catch(function(error){
      console.log('Fetch Error: -S', error);
    });
}

function filloutEvents(data) {
  // Get rid of elements from previous photos taken
  if ($('#inputs').children().length > 1) {
    $('#inputs').children().slice(1).remove();
  }

  // fill out first event
  if (data.descriptions.length < 1) {
    $('#msg').attr('class', 'show alert alert-warning show');
    $('#msg').html('No text detected. Try a different angle.');
  } else {
    $(`#event0`).val(data.descriptions[0]);
  }

  // Fill out other events
  for (let i=1; i<data.descriptions.length; ++i) {
    $('#inputs').append(`
      <div class="input-group">
        <input type="text" class="form-control" placeholder="Event Summary" id="event${i}">
        <span type="button" class="input-group-append btn btn-secondary" id="event${i}Btn">Add Event</span>
      </div>
    `);

    $(`#event${i}`).val(data.descriptions[i]);

    // Add button listener for created element
    $(`#event${i}Btn`).click(function(){
      addEvent(i);
    });
  }

}

function addEvent(i) {
  if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
    gapi.auth2.getAuthInstance().signIn();
    return;
  }

  // Get input group from selected value
  const summary = $(`#event${i}`).val();

  let request = gapi.client.calendar.events.quickAdd({
    'calendarId': 'primary',
    'text': summary,
  });

  request.execute(function(event){
    if (event.htmlLink) {
      $('#msg').attr('class', 'show alert alert-success show');
      $('#msg').html('Event created!');
    } else {
      $('#msg').attr("class", "show alert alert-warning show");
      $('#msg').html('There was an error creating your event.');
    }
  });
}

function addButtonListeners() {
  $('#camBtn').click(function(){
    sendImage();
  });
  $('#event0Btn').click(function(){
    addEvent(0);
  });
}
