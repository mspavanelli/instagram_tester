navigator.mediaDevices
	.getUserMedia({
		audio: true,
		video: true
	})
	.then(stream => {
		// Inicializando a câmera de gravação e o stream dela
		let cameraRecording = document.querySelector('#camera-recording video');
		cameraRecording.srcObject = stream;
		cameraRecording.captureStream = cameraRecording.captureStream || cameraRecording.mozCaptureStream;

		// Guardando o stream da gravação em uma var
		let cameraStream = [];
		const media_recorder = new MediaRecorder(cameraRecording.captureStream());
		media_recorder.ondataavailable = event => cameraStream.push(event.data);

		// let devices = [];
		// navigator.mediaDevices.enumerateDevices().then((d) => {
		// 	devices = d.filter((d) => d.kind === 'videoinput');
			// Useful to change the Active camera, front or back cam
		// });

		/*
			Holds the timeout address so we can clear it if the user
		 	restarts the recording
		*/
		let stopTimeout = null;

		const recordButton = document.querySelector('#record');
		recordButton.addEventListener('click', () => {
			const recordingState = recordButton.getAttribute('state');
			/*
				Se o usuário clicou no botão e a gravação ta rolando
				É porque ele quer parar a gravação
				Isso aqui não vai existir em produção porque o usuário é obrigado
				a gravar os vídeos de 7 segundos!
			*/
			if (recordingState === 'playing') {
				recordButton.querySelector('.bola').style.backgroundColor = 'red';
				recordButton.querySelector('.text').textContent = 'Gravar';
				recordButton.removeAttribute('state');
				media_recorder.stop();

				if (stopTimeout) {
					clearTimeout(stopTimeout);
				}

				return;
			}

			// Se chegou aqui é pq o usuário ta começando uma gravação nova
			recordButton.setAttribute('state', 'playing');
			recordButton.querySelector('.bola').style.backgroundColor = 'green';
			recordButton.querySelector('.text').textContent = 'GRAVANDO';

			// Começa a gravar, trigga o método media_recorder.ondataavailable
			media_recorder.start();

			/*
				Caso o media_recorder pare porque acabou o tempo ou porque o usuário
				clicou no botão de novo, mostrar o playback do que foi gravado
			*/
			media_recorder.addEventListener('stop', () => {
				const videoBlob = new Blob(cameraStream, { type: 'video/webm' });
				const videoUrl = URL.createObjectURL(videoBlob);

				document.querySelector('#playback-preview video').src = videoUrl;
				document.querySelector('#playback-preview').style.display = 'block';
				document.querySelector('#camera-recording').style.display = 'none';
				document.querySelector('#send').style.display = 'block';
				document.querySelector('#record').style.display = 'none';
			});

			// Depois de 3 segundos que o usuário deu play, para a gravação
			stopTimeout = setTimeout(() => {
				recordButton.querySelector('.bola').style.backgroundColor = 'red';
				recordButton.querySelector('.text').textContent = 'Gravar';
				recordButton.removeAttribute('state');
				media_recorder.stop();
				return;
			}, 3000);
		})

		const playbackPreview = document.querySelector('#playback-preview');
		playbackPreview.addEventListener('click', () => {
			const video = playbackPreview.querySelector('video');

			if (!video.onended) {
				video.onplay = () => {
					playbackPreview.classList.add('playing');
				};
				video.onended = () => {
					playbackPreview.classList.remove('playing');
				};
			}

			if (video.paused) {
				video.play();
			} else {
				video.pause();
			}
		});


		// Lógica do envio do arquivo, cria um formdata
		// const sendButton = document.querySelector('#send');
		// sendButton.addEventListener('click', () => {
		// 	const form = new FormData();
		// 	const file = new File([cameraStream], 'fileName');
		// 	form.append('data', file);
		// });

	});