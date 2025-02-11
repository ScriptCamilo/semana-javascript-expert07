export default class Controller {
  #view;
  #camera;
  #worker;
  #blinkCounter = 0
  constructor({ view, camera, worker }) {
    this.#view = view;
    this.#camera = camera;
    this.#worker = this.#configureWorker(worker);

    this.#view.configureOnBtnClick(this.onBtnStart.bind(this))
  }

  static async initialize(deps) {
    const controller = new Controller(deps);
    controller.log('Not yet detecting eye blink! Click in the button to start');
    return controller.init();
  }

  #configureWorker(worker) {
    let ready = false;
    worker.onmessage = ({ data }) => {
      if('READY' === data) {
        console.log('Worker is ready');
        this.#view.enableButton();
        return ready = true;
      };
      const blinked = data.blinked;
      this.#blinkCounter += blinked;
      this.#view.togglePlayVideo();
      console.log(`Blinked: ${blinked}`);
    }

    return {
      send(msg) {
        if(!ready) return;
        worker.postMessage(msg);
      }
    }
  }

  async init() {
    console.log('init');
  }

  loop() {
    const video = this.#camera.video
    const img = this.#view.getVideoFrame(video);
    this.#worker.send(img);
    this.log('Detecting eye blink');
    setTimeout(() => this.loop(), 100);
  }

  log(txt) {
    const times = `   - blinked times: ${this.#blinkCounter}`
    this.#view.log(`Status: ${txt}`.concat(this.#blinkCounter ? times : ''));
  }

  onBtnStart() {
    this.log('Initializing detection...');
    this.#blinkCounter = 0;
    this.loop();
  }
}
