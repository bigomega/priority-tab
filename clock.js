class Clock {
  constructor({
    hour_hand_color = '#fff',
    hour_direction_switch = false,
    offset = 12,
    $container = document.querySelector('#clock'),
    second_ticker = true,
    second_ripple = false,
    location_marker = true,
  } = {}){
    this.hour_hand_color = hour_hand_color
    this.hour_direction_switch = hour_direction_switch
    this.offset = offset
    this.second_ripple = second_ripple
    this.second_ticker = second_ticker
    this.location_marker = location_marker
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
    const tick = this.second_ticker ? (seconds % 2 ? '&nbsp;' : ':') : ''
    const color = '#fff'
    const depth = 94
    const size = .5
    return `<g id="minute-text" style="transform:rotate(${rotation + 180}deg) translate(-6px,${depth}px);font-size:${size}em;" fill="${color}"><text x="0" y="0" style="transform:rotate(${-rotation + 180}deg);transform-origin:6px 0px;">${tick}${text}</text></g>`
  }

  _getHourTheta({ hours = 0 } = {}) {
    return 360 / 24 * (hours + this.offset) * (this.hour_direction_switch ? -1 : 1)
  }

  _getHourHand({hours=0} = {}) {
    const rotation = this._getHourTheta({hours})
    const stroke_width = .5
    const stroke_color = '#000'
    const length = 60
    const width = 3.5
    return `
      <g id="hour-hand" style="transform:rotate(${rotation}deg);" stroke="${stroke_color}" fill="${this.hour_hand_color}" stroke-width="${stroke_width}">
        <circle cx="0" cy="0" r="${width}"/>
        <polygon points="${-width},0 ${width},0 .4,${length} -.4,${length}"></polygon>
        <rect x="${-width + stroke_width}" y="-.1" width="${(width-stroke_width)*2}" height="${stroke_width}" stroke="${this.hour_hand_color}" />
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

  _getTransformForLatLong({ latitude = 0, longitude = 0 } ={}){
    // Lat 15˚= 7px
    return {
      translate: (90-latitude) / 15 * 7,
      rotate: -longitude,
    }
  }

  _getCurrentLocation(){
    this.$location_marker_rotate.style.display = 'block'
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const {translate, rotate} = this._getTransformForLatLong(position.coords)
        this.$location_marker_rotate.style.transform = `rotate(${rotate}deg)`
        this.$location_marker_translate.style.transform = `translate(0, ${translate}px)`
      }, error => {
        console.error(error)
        this.$location_marker_rotate.style.display = 'none'
      });
    } else {
      this.$location_marker_rotate.style.display = 'none'
    }
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
    const ripple_color = '#f00'
    this.$container.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">
        <defs>
          <pattern id="clock-image" x="${-globe_size/2}" y="${-globe_size/2}" patternUnits="userSpaceOnUse" height="200" width="200">
            <image x="0" y="0" height="${globe_size}" width="${globe_size}" xlink:href="./Azimuthal_equidistant_projection_SW-2.png"></image>
          </pattern>
        </defs>
        <circle cx="0" cy="0" r="${globe_size/2}" fill="url(#clock-image)"/>
        <circle cx="0" cy="0" r="3" fill="#0000" id="second-ripple" class="${this.second_ripple ? 'active' : ''}" style="stroke:${ripple_color}"/>
        ${this._getHourMarkers({hours})}
        ${this._getMinuteHand({minutes})}
        ${this._getHourHand({hours: num_hours})}
        <g>${this._getMinuteText({ minutes, text: ('0'+minutes).slice(-2), seconds })}</g>
        ${this._getHourText({ hours, text: ('0'+hours).slice(-2) })}
        <g id="location-marker-rotate"><g id="location-marker-translate"><g style="transform:scale(1.5)" fill="#f00" stroke="#f00" stroke-width=".2">
          ${
            this.location_marker ?
            `<circle cx="0" cy="0" r="1.5" fill="#ffffffa3" />
            <circle cx="0" cy="0" r=".3" stroke-width=".5"/>
            <line x1="1.5" y1="0" x2="2.4" y2="0"></line>
            <line x1="-1.5" y1="0" x2="-2.4" y2="0"></line>
            <line y1="1.5" x1="0" y2="2.4" x2="0"></line>
            <line y1="-1.5" x1="0" y2="-2.4" x2="0"></line>`
            : ''
          }
        </g></g></g>
      </svg>
    `

    this.$minute_hand = this.$container.querySelector('#minute-hand')
    this.$hour_hand = this.$container.querySelector('#hour-hand')
    this.$hour_text = this.$container.querySelector('#hour-text')
    this.$minute_text = this.$container.querySelector('#minute-text')
    this.$location_marker_rotate = this.$container.querySelector('#location-marker-rotate')
    this.$location_marker_translate = this.$container.querySelector('#location-marker-translate')
    this._getCurrentLocation()
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
    const minute_theta = 360/60 * minutes
    const hour_theta = this._getHourTheta({hours: num_hours})

    this.$minute_hand.style.transform = `rotate(${minute_theta+180}deg)`
    this.$hour_hand.style.transform = `rotate(${hour_theta}deg)`
    this.$minute_text.parentElement.innerHTML = this._getMinuteText({ minutes, text: ('0' + minutes).slice(-2), seconds })
    this.$minute_text = this.$container.querySelector('#minute-text')
  }
}


// const clock = new Clock({ hour_direction_switch: true, offset: 0, second_ripple: false, second_ticker: false })
const clock = new Clock
clock.draw()
const redraw_timer = 1000
redraw_timer && setInterval(_ => clock.reDraw(), redraw_timer)
