function startVideoFromCamera() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      const videoElement = document.querySelector("#video");
      videoElement.srcObject = stream;
    })
    .catch((err) => {
      const $errors = document.querySelector("#errors");
      $errors.innerHTML = err;
    });
}

window.addEventListener("DOMContentLoaded", startVideoFromCamera);

function displayInfo() {
  const { userAgent } = navigator;
  const $info = document.querySelector("#info");
  $info.innerHTML = userAgent;
}

displayInfo();
