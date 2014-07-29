var peer = new Peer({ key: 'lwjd5qra8257b9', debug: 3, config: {'iceServers': [
  { url: 'stun:stun.l.google.com:19302' } // Pass in optional STUN and TURN server for maximum network compatibility
]}});

peer.on('open', function(){
  document.getElementById("my-peer-id").innerHTML = peer.id;
});

// Receiving a call
peer.on('call', function(call){
  // Answer the call automatically (instead of prompting user) for demo purposes
  call.answer();
  answerCall(call);
});

function endCall(){
  console.log("Call ended");
}

function answerCall(call) {
  // Hang up on an existing call if present
  if (window.existingCall) {
    window.existingCall.close();
  }

  // Wait for stream on the call, then set peer video display
  call.on('stream', function(stream){
    console.log("Received local stream");
    var video = document.querySelector("video");
    video.src = URL.createObjectURL(stream);
    window.localstream = stream;
    stream.onended = function() { console.log("Ended"); };
  });

  // UI stuff
  window.existingCall = call;
  call.on('close', endCall);
}

