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
        // document.getElementById('ind').setAttribute('aria-valuenow', 100);
        // document.getElementById('ind').style.width = 100 + "%";
        // document.getElementById('indText').innerHTML = 'Finished'

        response.json().then(function(data){
          filloutEvents(data)
        });

        // Reset progress bar after 3 seconds
        // setTimeout(function(){
        //   document.getElementById('ind').setAttribute('aria-valuenow', 10);
        //   document.getElementById('ind').style.width = 10 + "%";
        //   document.getElementById('indText').innerHTML = 'Waiting ...';
        // }, 3000);

        return;
      }
    })
    .catch(function(error){
      console.log('Fetch Error: -S', error);
    });
}

function filloutEvents(data) {
  // Get rid of elements from previous photos taken
  if ($('#events-tab').children().length > 1) {
    $('#events-tab').children().slice(1).remove();
    // make first tab selected
    $('#events-tab').children().children().attr('class', 'nav-link active');
    $('#events-tab').children().children().attr('aria-selected', 'true');
  }

  if ($('#events-tabContent').children().length > 1) {
    $('#events-tabContent').children().slice(1).remove();
    // make first input selected
    $('#events-tabContent').children().attr('class', 'tab-pane fade show active');
  }



  const summary1 = document.getElementById('event1EntryCont');
  if (data.descriptions.length == 1) {
    summary1.value = data.descriptions[0];
  } else if (data.descriptions.length > 1) {
    summary1.value = data.descriptions[0];
    // add the rest of the events
    for (let i=1; i<data.descriptions.length; ++i) {
      // create other pills
      let elt = document.createElement('li');
      elt.setAttribute('class', 'nav-item');
      document.getElementById('events-tab').appendChild(elt);

      let elt2 = document.createElement('a');
      elt2.setAttribute('class', 'nav-link');
      elt2.setAttribute('href', '#event' + (i+1).toString() + 'Entry');
      elt2.setAttribute('id', 'event' + (i+1).toString() + '-tab');
      elt2.setAttribute('data-toggle', 'pill');
      elt2.setAttribute('role', 'tab');
      elt2.setAttribute('aria-controls', 'event' + (i+1).toString() + 'Entry');
      elt2.setAttribute('aria-selected', 'false');
      elt2.innerHTML = 'Event ' + (i+1).toString();
      elt.appendChild(elt2);

      // create other entries
      let entry = document.createElement('div');
      entry.setAttribute('class', 'tab-pane fade');
      entry.setAttribute('id', 'event' + (i+1).toString() + 'Entry');
      entry.setAttribute('role', 'tabpanel');
      entry.setAttribute('aria-labelledby', 'event' + (i+1).toString() + '-tab');
      document.getElementById('events-tabContent').appendChild(entry);

      let entry2 = document.createElement('div');
      entry2.setAttribute('class', 'input-group');
      entry.appendChild(entry2);

      let entry3 = document.createElement('input');
      entry3.setAttribute('type', 'text');
      entry3.setAttribute('class', 'form-control');
      entry3.setAttribute('placeholder', 'Event Summary');
      entry3.setAttribute('id', 'event' + (i+1).toString() + 'EntryCont');
      entry2.appendChild(entry3);
      // Fill out entry
      entry3.value = data.descriptions[i];
    }
  } else {
    const alert = document.getElementById('msg');
    alert.setAttribute('class', 'show alert alert-warning show');
    alert.innerHTML = `No text detected.
                      Try a different angle.`;
  }
}

function addEvent() {
  if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
  } else {
    gapi.auth2.getAuthInstance().signIn();
  }

  const selectedTab = document.getElementsByClassName('tab-pane fade show active');
  // get value from input group of selected tab
  const summary = selectedTab[0].children[0].children[0].value;
  let request = gapi.client.calendar.events.quickAdd({
    'calendarId': 'primary',
    'text': summary,
  });

  request.execute(function(event){
    const alert = document.getElementById('msg');
    if (event.htmlLink) {
      alert.setAttribute('class', 'show alert alert-success show');
      alert.innerHTML = 'Event created!';
    } else {
      alert.setAttribute("class", "show alert alert-warning show");
      alert.innerHTML = 'There was an error creating your event.';
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
