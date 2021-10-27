class Clock {
  constructor({
    hour_hand_color = '#fff',
    hour_direction_switch = false,
    offset = 12,
    $container = document.querySelector('#clock'),
    ticker = true,
  } = {}){
    this.hour_hand_color = hour_hand_color
    this.hour_direction_switch = hour_direction_switch
    this.offset = offset
    this.$container = $container
  }

  _getHourMarkers({depth=14, small=1, medium=1.5, large=2, hours} = {}) {
    const stroke_width = .5
    return `
      <g class="hour-markers" fill="#fff" stroke="#000" style="transform:rotate(${360/24*this.offset}deg);opacity:.5">
        ${[...Array(24)].map((_, h) => {
          // if (h !== hours) return
          if (h % 6 === 0) {
            return `<circle class="hour-marker large" cx="0" cy="0" r="${large}" style="transform:rotate(${h / 24 * 360}deg) translate(0, ${100-(large*2)-depth}px);" stroke-width="${stroke_width}"/>`
          }
          if (h % 3 === 0) {
            return `<circle class="hour-marker medium" cx="0" cy="0" r="${medium}" style="transform:rotate(${h / 24 * 360}deg) translate(0, ${100-(large*2)-depth}px);" stroke-width="${stroke_width}"/>`
          }
          return `<circle class="hour-marker small" cx="0" cy="0" r="${small}" style="transform:rotate(${h / 24 * 360}deg) translate(0, ${100-(large*2)-depth}px);" stroke-width="${stroke_width}"/>`
        }).join('')
        }
      </g>
    `
  }

  _getMinuteHand({minutes=0} = {}) {
    const rotation = 360/60 * minutes
    const width = 1
    const height = 100
    const stroke_width = .2
    return `
      <rect id="minute-hand" x="${-width/2}" y="${-width/2}" rx="1" ry="1" width="${width}" height="${height}" style="transform:rotate(${rotation+180}deg)" fill="#000" stroke="#ccc" stroke-width="${stroke_width}"/>
    `
  }

  _getMinuteText({ minutes = 0, text = '00', seconds = 0 } = {}) {
    const rotation = 360 / 60 * minutes
    const color = '#fff'
    const depth = 94
    const size = .5
    return `<g id="minute-text" style="transform:rotate(${rotation+180}deg) translate(-6px,${depth}px);font-size:${size}em;" fill="${color}"><text x="0" y="0" style="transform:rotate(${-rotation+180}deg);transform-origin:6px 0px;">${seconds%2 ? ':' : '<nbsp/>'}${text}</text></g>`
  }

  _getHourHand({hours=0} = {}) {
    const rotation = 360 / 24 * (hours+this.offset) * (this.hour_direction_switch ? -1 : 1)
    const stroke_width = .5
    const hour_hand_stroke_color = '#000'
    const hand_length = 60
    return `
      <g id="hour-hand" style="transform:rotate(${rotation}deg);" stroke="${hour_hand_stroke_color}" fill="${this.hour_hand_color}">
        <circle cx="0" cy="0" r="3.5" stroke-width="${stroke_width}"/>
        <polygon points="-3.5,0 3.5,0 .4,${hand_length} -.4,${hand_length}" stroke-width="${stroke_width}"></polygon>
        <rect x="-3.3" y="-.5" width="6.6" height="1" stroke-width="0"/>
      </g>
    `
  }

  _getHourText({hours = 0, text = '00'} = {}){
    const rotation = 360 / 24 * (hours+this.offset) * (this.hour_direction_switch ? -1 : 1)
    const color = '#fff'
    const depth = 83
    const size = 1
    return `<g id="hour-text" style="transform:rotate(${rotation}deg) translate(-10px,${depth}px);font-size:${size}em;" fill="${color}"><text x="0" y="0" style="transform:rotate(${-rotation}deg);transform-origin:10px -5px;">${text}</text></g>`
  }

  draw() {
    const now = new Date()
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const num_minutes = minutes + seconds / 60;
    const num_hours = hours + num_minutes / 60;
    // <circle cx="0" cy="0" r="100" fill="#ccc"/>
    const globe_size = 170
    this.$container.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">
        <defs>
          <pattern id="clock-image" x="${-globe_size/2}" y="${-globe_size/2}" patternUnits="userSpaceOnUse" height="200" width="200">
            <image x="0" y="0" height="${globe_size}" width="${globe_size}" xlink:href="./Azimuthal_equidistant_projection_SW-2.png"></image>
          </pattern>
        </defs>
        <circle cx="0" cy="0" r="95" fill="url(#clock-image)"/>
        ${this._getHourMarkers({hours})}
        ${this._getMinuteHand({minutes: num_minutes})}
        ${this._getHourHand({hours: num_hours})}
        <g>
        ${this._getMinuteText({ minutes: num_minutes, text: ('0'+minutes).slice(-2), seconds })}
        </g>
        ${this._getHourText({ hours, text: ('0'+hours).slice(-2) })}
      </svg>
    `
    this.$minute_hand = this.$container.querySelector('#minute-hand')
    this.$hour_hand = this.$container.querySelector('#hour-hand')
    this.$hour_text = this.$container.querySelector('#hour-text')
    this.$minute_text = this.$container.querySelector('#minute-text')
  }

  reDraw() {
    // if (!this.$minute_hand || this.$hour_hand) {
    //   return this.draw()
    // }
    const now = new Date()
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const num_minutes = minutes + seconds / 60;
    const num_hours = hours + num_minutes / 60;
    const minute_theta = 360/60 * num_minutes
    const hour_theta = 360 / 60 * (num_hours + this.offset) * (this.hour_direction_switch ? -1 : 1)

    this.$minute_hand.style.transform = `rotate(${minute_theta+180}deg)`
    this.$hour_hand.style.transform = `rotate(${hour_theta}deg)`
    // this.$minute_text.parentElement.innerHTML = this._getMinuteText({ minutes: num_minutes, text: ('0' + minutes).slice(-2), seconds })
  }
}


// const clock = new Clock({ hour_direction_switch: true, offset: 0 })
const clock = new Clock
clock.draw()
// const redraw_timer = 1000
// redraw_timer && setInterval(_ => clock.reDraw(), redraw_timer)
