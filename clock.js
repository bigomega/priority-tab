function getSolarDeclination(now = new Date) {
  function getDayOfYear() {
    // var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear + 284
  }

  return 23.44 * Math.sin((360 / 365.25) * getDayOfYear() * Math.PI / 180)
  // https://stackoverflow.com/questions/62184648/how-to-calculate-the-latitude-of-the-subsolar-point-ie-solar-declination-usin
}

class Clock {
  constructor({
    hour: {
      hand_color = '#fff',
      hand_width = 3.5,
      direction_switch = false,
      marker: {
        dot_size = 1,
        dot_depth = 14,
        dot_split = 24,
        text_depth = 18,
        text_split = 4,
      } = {},
    } = {},
    offset = 0,
    $container = document.querySelector('#clock'),
    second_ticker = true,
    second_ripple = false,
    location_marker = true,
    sun_marker = true,
    fixed_sun = true,
  } = {}){
    this.hour = {
      hand_color,
      hand_width,
      direction_switch,
      marker: {
        dot_size,
        dot_depth,
        dot_split,
        text_depth,
        text_split,
      },
    }
    this.offset = offset
    this.second_ripple = second_ripple
    this.second_ticker = second_ticker
    this.location_marker = location_marker
    this.sun_marker = sun_marker
    this.fixed_sun = fixed_sun
    this.$container = $container
    this.position = null
  }

  _hToA = hours => 360 / 24 * hours
  _mToA = hours => 360 / 60 * hours

  _getHourMarkers(now = new Date) {
    const hours = now.getHours();
    const stroke_width = .5
    const { dot_split, text_split, dot_depth, text_depth, dot_size } = this.hour.marker
    return `
      <g id="hour-markers" fill="#fff" stroke="#000">
        ${[...Array(24)].map((_, h) => {
          const isCurrent = h === hours
          const rotation = this._getHourTheta(h)
          let text = '', dot = ''
          if (isCurrent || text_split && h%(24/text_split) === 0) {
            text = `
              <g class="hour-marker-text ${isCurrent ? 'current-hour' : ''}" style="transform:rotate(${rotation}deg) translate(0, ${100-text_depth}px);">
                <text class="hour-marker-text" style="transform:rotate(${-rotation}deg) ${isCurrent ? 'translate(-6px, 5px)' : 'translate(-4px, 8px)'};">${('0'+h).slice(-2)}</text>
              </g>
            `
          }
          if (dot_depth !== 0 && h !== hours && h%(24/dot_split) === 0) {
            dot = `<circle class="hour-marker-dot" cx="0" cy="0" r="${dot_size}" style="transform:rotate(${rotation}deg) translate(0, ${100-(dot_size*2)-dot_depth-2}px);" stroke-width="${stroke_width}"></circle>`
          }
          return `<g>${text}${dot}</g>`
        }).join('')}
      </g>
    `
  }

  _getMinuteHand({minutes=0} = {}) {
    const rotation = this._mToA(minutes)
    const width = 1
    const height = 100
    const stroke_width = .2
    return `
      <rect id="minute-hand" x="${-width/2}" y="${-width/2}" rx="1" ry="1" width="${width}" height="${height}" style="transform:rotate(${rotation+180}deg)" fill="#000" stroke="#ccc" stroke-width="${stroke_width}"/>
    `
  }

  _getMinuteText({ minutes = 0, text = '00', seconds = 0 } = {}) {
    const rotation = this._mToA(minutes)
    const tick = this.second_ticker ? (seconds % 2 ? '&nbsp;' : ':') : ''
    const color = '#fff'
    const depth = 94
    const size = .5
    return `<g id="minute-text" style="transform:rotate(${rotation + 180}deg) translate(-6px,${depth}px);font-size:${size}em;" fill="${color}"><text x="0" y="0" style="transform:rotate(${-rotation + 180}deg);transform-origin:6px 0px;">${tick}${text}</text></g>`
  }

  _getHourTheta(hours = 0) {
    const dir = this.hour.direction_switch ? -1 : 1
    return this._hToA(hours + this.offset * dir) * dir
  }

  _getHourHand({hours=0} = {}) {
    const rotation = this._getHourTheta(hours)
    const stroke_width = .5
    const stroke_color = '#000'
    const length = 60
    const width = this.hour.hand_width
    return `
      <g id="hour-hand" style="transform:rotate(${rotation}deg);" stroke="${stroke_color}" fill="${this.hour.hand_color}" stroke-width="${stroke_width}">
        <circle cx="0" cy="0" r="${width}"></circle>
        <polygon points="${-width},0 ${width},0 .4,${length} -.4,${length}"></polygon>
        <rect x="${-width + stroke_width}" y="-.1" width="${(width-stroke_width)*2}" height="${stroke_width}" stroke="${this.hour.hand_color}" />
      </g>
    `
  }

  _getTransformForLatLong({ latitude = 0, longitude = 0 } ={}){
    // Lat 15˚= 7px
    return {
      translate: (90-latitude) / 15 * 7,
      rotate: -longitude,
    }
  }

  _getCurrentLocation(cb, err) {
    if (this.position?.coords) {
      return cb(this.position)
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        // position = { coords: { latitude: 40.7128, longitude: -74.0060}} // NY
        // position = { coords: { latitude: -33.8688, longitude: 151.2093}} // Sydney
        // position = { coords: { latitude: 22.3193, longitude: 114.1694}} // HK
        // position = { coords: { latitude: 52.5200, longitude: 13.4050}} // Berlin
        this.position = position
        cb(position)
      }, error => {
        console.error(error)
        err(error)
      });
    } else {
      err({ msg: 'Object missing: navigator.geolocation'})
    }
  }

  _getSunPosition(now=new Date) {
    const num_hours = now.getUTCHours() + now.getUTCMinutes() / 60;
    // const diff_from_timezone = (now.getTimezoneOffset()/60) * 360/24

    return { latitude: getSolarDeclination(now), longitude: this._hToA(12 - num_hours) }
  }

  _updateSunPosition(now=new Date) {
    const pos = this._getSunPosition(now)
    this.$sun_marker_rotate.dataset.coords = pos
    const { translate, rotate } = this._getTransformForLatLong(pos)
    this.$sun_marker_rotate.style.transform = `rotate(${rotate}deg)`
    this.$sun_marker_translate.style.transform = `translate(0, ${translate}px)`
  }

  _updateMapBasedOnSun(now=new Date) {
    const offset_degree = this._hToA(this.offset)
    const sun_pos = this._getSunPosition(now)
    this.$container.querySelectorAll('.bg-rotate').forEach($el => {
      $el.style.transform = `rotate(${sun_pos.longitude + offset_degree + 180}deg)`
    })
    this.$container.querySelectorAll('.bg-rotate-reverse').forEach($el => {
      $el.style.transform = `rotate(${-sun_pos.longitude + 180}deg)`
    })
  }

  draw(now = new Date) {
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const num_minutes = minutes + seconds / 60;
    const num_hours = hours + num_minutes / 60;
    const location_marker_day_highlight = num_hours > 6.5 && num_hours < 17.5 ? 'filter: drop-shadow(0px 0px 0.2px #fff) drop-shadow(0px 0px 0.2px #fff);' : ''
    // <circle cx="0" cy="0" r="100" fill="#ccc"/>
    const globe_size = 170
    const ripple_color = '#f00'
    this.$container.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">
        <defs>
          <pattern id="clock-image" x="${-globe_size/2}" y="${-globe_size/2}" patternUnits="userSpaceOnUse" height="200" width="200">
            <image x="0" y="0" height="${globe_size}" width="${globe_size}" xlink:href="./Azimuthal_equidistant_projection_SW-2.png"></image>
          </pattern>
          <pattern id="clock-image-no-sea" x="${-globe_size/2}" y="${-globe_size/2}" patternUnits="userSpaceOnUse" height="200" width="200">
            <image x="0" y="0" height="${globe_size}" width="${globe_size}" xlink:href="./Azimuthal_equidistant_projection_SW-no-sea.png"></image>
          </pattern>
        </defs>
        <mask id="myMask">
          <g style="transform:rotate(${0 && this._hToA(this.offset)}deg)">
          <rect x="-100" y="-100" width="200" height="200" fill="#000"></rect>
          <rect class="bg-rotate-reverse" x="-100" y="-105" width="200" height="100" fill="white" style="filter: drop-shadow(0px 0px 2px white) drop-shadow(0px 0px 2px white) drop-shadow(0px 0px 2px white);"></rect>
          </g>
        </mask>
        <g id="clock-bg" class="bg-rotate">
          <circle cx="0" cy="0" r="${globe_size / 2}" fill="url(#clock-image)" style="filter:brightness(0)"></circle>
          <circle cx="0" cy="0" r="${globe_size / 2}" fill="url(#clock-image-no-sea)" style="filter:grayscale(1) contrast(0) brightness(0);/*filter:grayscale(1) contrast(1.7) brightness(1)*/"></circle>
          <circle cx="0" cy="0" r="${globe_size / 2}" fill="url(#clock-image)" mask="url(#myMask)"></circle>
        </g>
        <circle cx="0" cy="0" r="3" fill="#0000" id="second-ripple" class="${this.second_ripple ? 'active' : ''}" style="stroke:${ripple_color}"></circle>
        <g>${this._getHourMarkers(now)}</g>
        ${this._getMinuteHand({minutes})}
        <g class="bg-rotate"><g id="location-marker-rotate"><g id="location-marker-translate"><g style="transform:scale(1.5);${location_marker_day_highlight}" fill="#f00" stroke="#f00" stroke-width=".2">
          ${
            this.location_marker ?
            `<circle cx="0" cy="0" r="1.5" fill="#fff0"></circle>
            <circle cx="0" cy="0" r=".3" stroke-width=".5"></circle>
            <line x1="1.5" y1="0" x2="2.4" y2="0"></line>
            <line x1="-1.5" y1="0" x2="-2.4" y2="0"></line>
            <line y1="1.5" x1="0" y2="2.4" x2="0"></line>
            <line y1="-1.5" x1="0" y2="-2.4" x2="0"></line>`
            : ''
          }
        </g></g></g></g>
        <g class="bg-rotate"><g id="sun-marker-rotate"><g id="sun-marker-translate">
          ${this.sun_marker ? '<circle id="sun" cx="0" cy="0" r="3"></circle>' : ''}
        </g></g></g>
        ${this._getHourHand({hours: num_hours})}
        <g>${this._getMinuteText({ minutes, text: ('0'+minutes).slice(-2), seconds })}</g>
      </svg>
      <div style="
        position: absolute;
        width: 2px;
        height: 100%;
        background: red;
        left: 359px;
        top: 0px;
        opacity: .5;
        display: none;
      "></div>
    `

    this.hour.$markers = this.$container.querySelector('#hour-markers')
    this.hour.$hand = this.$container.querySelector('#hour-hand')
    this.$minute_hand = this.$container.querySelector('#minute-hand')
    this.$minute_text = this.$container.querySelector('#minute-text')
    this.$location_marker_rotate = this.$container.querySelector('#location-marker-rotate')
    this.$location_marker_translate = this.$container.querySelector('#location-marker-translate')
    this.$sun_marker_rotate = this.$container.querySelector('#sun-marker-rotate')
    this.$sun_marker_translate = this.$container.querySelector('#sun-marker-translate')

    this._getCurrentLocation(({ coords }) => {
      // update current location
      this.$location_marker_rotate.dataset.coords = coords
      const { translate: gps_translate, rotate: gps_rotate } = this._getTransformForLatLong(coords)
      this.$location_marker_rotate.style.transform = `rotate(${gps_rotate}deg)`
      this.$location_marker_translate.style.transform = `translate(0, ${gps_translate}px)`
    })
    this._updateSunPosition(now)
    this.fixed_sun && this._updateMapBasedOnSun(now)
  }

  reDraw(now=new Date) {
    // if (!this.$minute_hand || this.hour.$hand) {
    //   return this.draw()
    // }
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const num_minutes = minutes + seconds / 60;
    const num_hours = hours + num_minutes / 60;
    const minute_theta = this._mToA(minutes)
    const hour_theta = this._getHourTheta(num_hours)

    this.$minute_hand.style.transform = `rotate(${minute_theta+180}deg)`
    this.hour.$hand.style.transform = `rotate(${hour_theta}deg)`

    this.$minute_text.parentElement.innerHTML = this._getMinuteText({ minutes, text: ('0' + minutes).slice(-2), seconds })
    this.$minute_text = this.$container.querySelector('#minute-text')
    this.hour.$markers.parentElement.innerHTML = this._getHourMarkers(now)
    this.hour.$markers = this.$container.querySelector('#hour-markers')

    if(seconds < 3) { // Just in case 0 was missed
      this._updateSunPosition(now)
      this.fixed_sun && this._updateMapBasedOnSun(now)
    }
  }
}


const clock = new Clock({
  hour: {
    direction_switch: true,
    hand_width: 1,
    hand_color: '#da00fb',
    marker: { text_split: 0 }
  },
  offset: 0,
  second_ticker: false,
})
// const clock = new Clock
clock.draw()
const redraw_timer = 1000
redraw_timer && setInterval(_ => clock.reDraw(), redraw_timer)
