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

function authorize() {
  data = {}
  let req = new Request(
    'API/auth',
    {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {'Content-Type':
      'application/json; charset=utf-8'
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
        return;
      }
    })
    .catch(function(error){
      console.log('Fetch Error: -S', error);
    });
}

function addButtonListeners() {
  document.getElementById('camBtn').addEventListener('click', function(){
    sendImage();
  });
  document.getElementById('authBtn').addEventListener('click', function(){
    authorize();
  });

}
