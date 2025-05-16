export const name = "daw-slider";

class Slider extends HTMLElement {
    constructor() {
        super();
        const root = this.attachShadow({ mode: "open" });
        root.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 10px;
        }

        input[type=range] {
            writing-mode: vertical-lr;
            direction: rtl;
            appearance: slider-vertical;
            width: 3px;
            vertical-align: bottom;
        }

        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #4CAF50;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 2px rgba(0,0,0,0.5);
        }

        input[type=range]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #4CAF50;
          border: none;
          border-radius: 50%;
          cursor: pointer;
        }

        input[type=range]::-ms-thumb {
          width: 20px;
          height: 20px;
          background: #4CAF50;
          border: none;
          border-radius: 50%;
          cursor: pointer;
        }
      </style>
      <input type="range" orientation="vertical" min="0" max="100" value="50">
    `;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        return `
            <style>
                .slider {
                    writing-mode: vertical-lr;
                    direction: rtl;
                    appearance: slider-vertical;
                    width: 16px;
                    vertical-align: bottom;
                }
            </style>
        `;
    }
}

export default function register() {
    window.customElements.define(name, Slider);
}
