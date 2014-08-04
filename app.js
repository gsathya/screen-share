// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function gotStream(stream) {
  console.log("Received local stream");
  var video = document.querySelector("video");
  video.src = URL.createObjectURL(stream);
  window.localStream = stream;
  stream.onended = function() { console.log("Ended"); };
}

function getUserMediaError() {
  console.log("getUserMedia() failed.");
}

function onAccessApproved(id) {
  if (!id) {
    console.log("Access rejected.");
    return;
  }
  navigator.webkitGetUserMedia({
      audio:false,
      video: {
          mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: id,
              googLeakyBucket: true,
              maxWidth: window.screen.width,
              maxHeight: window.screen.height,
              maxFrameRate: 60
          }
      },
  }, gotStream, getUserMediaError);
}

var pending_request_id = null;

document.querySelector('#start').addEventListener('click', function(e) {
  chrome.tabCapture.capture({
    video: true,
    videoConstraints: {
      mandatory: {
        googLeakyBucket: true,
        maxWidth: window.screen.width,
        maxHeight: window.screen.height,
        maxFrameRate: 60
      }
    }
  }, gotStream);
});

document.querySelector('#cancel').addEventListener('click', function(e) {
  if (pending_request_id != null) {
    chrome.desktopCapture.cancelChooseDesktopMedia(pending_request_id);
  }
});

function init() {
  if (typeof Peer == 'function') {
    // PeerJS object
    var peer = new Peer({ key: 'lwjd5qra8257b9', debug: 3});

    peer.on('open', function(){
      console.log("My ID - ", peer.id);
    });

    peer.on('error', function(err){
      consoel.log("ERROR: ", err.message);
    });

    function makeCall() {
      var id = document.getElementById("their-id").value;
      var call = peer.call(id, window.localStream);
      step3(call);
    };

    function callEnded() {
      console.log("call ended");
    };

    function step3 (call) {
      window.existingCall = call;
      call.on('close', callEnded);
    };

    var callButton = document.getElementById("call");
    callButton.addEventListener('click', makeCall);

  } else {
    setTimeout(init, 100);
  }
};

init();
