export default class Camera {
  video;

  constructor() {
    this.video = document.createElement('video');
  }

  static async init() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Browser API navigator.mediaDevices.getUserMedia not available')
    }
    const videoConfig = {
      audio: false,
      video: {
        width: globalThis.screen.availWidth,
        height: globalThis.screen.availHeight,
        frameRate: {
          ideal: 60,
        },
      }
    };
    const stream = await navigator.mediaDevices.getUserMedia(videoConfig);
    const camera = new Camera();
    camera.video.srcObject = stream;

    // camera.video.height = 320 * 2;
    // camera.video.width = 480 * 2;
    // camera.video.style.transform = 'scale(-1)';
    // camera.video.style['-webkit-transform'] = 'scaleX(-1)';
    // document.body.insertBefore(camera.video, document.querySelector('div.content'));

    await new Promise((resolve) => {
      camera.video.onloadedmetadata = () => {
        resolve(camera.video);
      };
    });

    camera.video.play();

    return camera;
  }
}
