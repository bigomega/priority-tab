class Clock {
  constructor(){
    this.$container = document.querySelector('#clock')
  }

  _getHourMarkers({depth=0, small=.1, medium=.7, large=1.5} = {}) {
    return `
      <g class="hour-markers">
        ${[...Array(24)].map((_, h) => {
          if (h % 6 === 0)
            return `<circle class="hour-marker large" cx="0" cy="0" r="${large}" style="transform:rotate(${h / 24 * 360}deg) translate(0, ${-100+(large*2)+depth}px);"/>`
          // return `<line class="hour-marker" x1="0" y1="-100" x2="0" y2="-90" style="transform:rotate(${h/24 * 360}deg);"></line>`
          if (h % 3 === 0)
            return `<circle class="hour-marker medium" cx="0" cy="0" r="${medium}" style="transform:rotate(${h / 24 * 360}deg) translate(0, ${-100+(large*2)+depth}px);"/>`
          return `<circle class="hour-marker small" cx="0" cy="0" r="${small}" style="transform:rotate(${h / 24 * 360}deg) translate(0, ${-100+(large*2)+depth}px);"/>`
        }).join('')
        }
      </g>
    `
  }
  draw(){
    // <circle cx="0" cy="0" r="100" fill="#ccc"/>
    this.$container.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">
        <defs>
          <pattern id="clock-image" x="-95" y="-95" patternUnits="userSpaceOnUse" height="190" width="190">
            <image x="0" y="0" height="190" width="190" xlink:href="./Azimuthal_equidistant_projection_SW-2.png"></image>
          </pattern>
        </defs>
        <circle cx="0" cy="0" r="95" fill="url(#clock-image)"/>
        ${this._getHourMarkers()}
      </svg>
    `
  }
}


const clock = new Clock
clock.draw()
