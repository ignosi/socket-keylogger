let socket = io();

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('newMessage', (message) => {
  console.log(message);
});

socket.on('disconnect', () => {
  console.log('DisConnected to server');
});

window.addEventListener('keydown', function (e) {
  console.log(e.keyCode);
  if (
    e.keyCode === 37 ||
    e.keyCode === 38 ||
    e.keyCode === 39 ||
    e.keyCode === 40
  ) {
    socket.emit('keydownevent', {
      keyType: e.keyCode,
      startTime: new Date().getTime(),
    });
    window.addEventListener('keyup', function (e) {
      console.log(e.keyCode);

      socket.emit('keyupevent', {
        keyType: e.keyCode,
        endTime: new Date().getTime(),
      });
    });
  }
});

socket.on('keypressevent', (msg) => {
  //console.log(msg);
  if (msg.keyType === 37 && msg.keyupType === 37) {
    //console.log('Left: ', msg);
    document.getElementById('leftstart').innerText = msg.startTime;
    document.getElementById('leftend').innerText = msg.endTime;
    document.getElementById('lefttotal').innerText =
      msg.endTime - msg.startTime;
  }
  if (msg.keyType === 38 && msg.keyupType === 38) {
    //console.log('Up: ', msg);
    document.getElementById('upstart').innerText = msg.startTime;
    document.getElementById('upend').innerText = msg.endTime;
    document.getElementById('uptotal').innerText = msg.endTime - msg.startTime;
  }
  if (msg.keyType === 39 && msg.keyupType === 39) {
    //console.log('Right: ', msg);
    document.getElementById('rightstart').innerText = msg.startTime;
    document.getElementById('rightend').innerText = msg.endTime;
    document.getElementById('righttotal').innerText =
      msg.endTime - msg.startTime;
  }
  if (msg.keyType === 40 && msg.keyupType === 40) {
    //console.log('down: ', msg);
    document.getElementById('downstart').innerText = msg.startTime;
    document.getElementById('downend').innerText = msg.endTime;
    document.getElementById('downtotal').innerText =
      msg.endTime - msg.startTime;
  }
});
