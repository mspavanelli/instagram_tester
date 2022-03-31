function startVideoFromCamera() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      const videoElement = document.querySelector("#video");
      videoElement.srcObject = stream;
    })
    .catch((err) => console.error(err));
}

window.addEventListener("DOMContentLoaded", startVideoFromCamera);
