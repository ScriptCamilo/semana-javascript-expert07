export default class HandGestureView {
  #handCanvas = document.querySelector('#hands');
  #canvasContext = this.#handCanvas.getContext('2d');
  #fingerLookupIndexes;

  constructor({ fingerLookupIndexes }) {
    this.#handCanvas.width = globalThis.screen.availWidth;
    this.#handCanvas.height = globalThis.screen.availHeight;
    this.#fingerLookupIndexes = fingerLookupIndexes;
  };

  clearCanvas() {
    this.#canvasContext.clearRect(0, 0, this.#handCanvas.width, this.#handCanvas.height);
  };

  loop(fn) {
    requestAnimationFrame(fn);
  };

  scrollPage(top) {
    scroll({
      top,
      behavior: 'smooth',
    });
  };

  clickOnElement(x, y) {
    const element = document.elementFromPoint(x, y);
    if(!element) return;

    const rect = element.getBoundingClientRect();
    const event = new MouseEvent('click',  {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: rect.left + x,
      clientY: rect.top + y,
    });

    element.dispatchEvent(event);
  }

  drawResults(hands) {
    for(const { keypoints, handedness} of hands) {
      if(!keypoints) continue;

      this.#canvasContext.fillStyle = handedness === 'Left' ? 'blue' : 'yellow';
      this.#canvasContext.strokeStyle = 'white';
      this.#canvasContext.lineWidth = 8;
      this.#canvasContext.lineJoin = 'round';

      this.#drawJoints(keypoints);
      this.#drawFingersAndHoverElements(keypoints);
    }
  };

  #drawFingersAndHoverElements(keypoints) {
    const fingers = Object.keys(this.#fingerLookupIndexes);
    for(const finger of fingers) {
      const points = this.#fingerLookupIndexes[finger].map((index) => {
        return keypoints[index]
      });
      const region = new Path2D();
      const [{ x, y }] = points;
      region.moveTo(x, y);

      for(const point of points) {
        region.lineTo(point.x, point.y);
      }
      this.#canvasContext.stroke(region);
    }
  }

  #drawJoints(keypoints) {
    for(const { x, y } of keypoints) {
      this.#canvasContext.beginPath();
      const newX = x - 2;
      const newY = y - 2;
      const radius = 3;
      const startAngle = 0;
      const endAngle = 2 * Math.PI;

      this.#canvasContext.arc(newX, newY, radius, startAngle, endAngle);
      this.#canvasContext.fill();
    }
  }

}
