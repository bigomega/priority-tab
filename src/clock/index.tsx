import * as _utils from './_utils'
import HourMarkers from './hour-markers'

import * as classes from './index.module.scss'

import IMG_Azimuthal from "/images/Azimuthal_equidistant_projection_SW-2.png"
import IMG_Azimuthal_land from "/images/Azimuthal_equidistant_projection_SW-no-sea.png"

function Clock({
  hour = {},
  minute: {
    show_hand = false,
    show_text = false,
    seconds_ticker = true,
  } = {},
  offset = 0,
  second_ripple = false,
  second_ripple_color = '#f00',
  location_marker = true,
  sun_marker = true,
  fixed_sun = true,
  date_time = new Date,
} = {}) {

  const now = {
    date_time,
    hours: date_time.getHours(),
    minutes: date_time.getMinutes(),
    seconds: date_time.getSeconds(),
    num_minutes: 0,
    num_hours: 0,
  }
  now.num_minutes = now.minutes + now.seconds / 60
  now.num_hours = now.hours + now.num_minutes / 60
  const location_marker_day_highlight = now.num_hours > 6.5 && now.num_hours < 17.5 ? {filter: `drop-shadow(0px 0px 0.2px #fff) drop-shadow(0px 0px 0.2px #fff)`} : {}
  // <circle cx="0" cy="0" r="100" fill="#ccc"/>
  const globe_size = 170


  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">
      <defs>
        <pattern id="clock-image" x={-globe_size / 2} y={-globe_size / 2} patternUnits="userSpaceOnUse" height="200" width="200">
          <image x="0" y="0" height={globe_size} width={globe_size} xlinkHref={IMG_Azimuthal}></image>
        </pattern>
        <pattern id="clock-image-no-sea" x={-globe_size / 2} y={-globe_size / 2} patternUnits="userSpaceOnUse" height="200" width="200">
          <image x="0" y="0" height={globe_size} width={globe_size} xlinkHref={IMG_Azimuthal_land}></image>
        </pattern>
      </defs>
      <mask id="shadowMask">
        <g style={{ transform: `rotate(${0 && _utils.hToA(offset)}deg)`}}>
        <rect x="-100" y="-100" width="200" height="200" fill="#000"></rect>
        <rect className="shadow-rotate" x="-100" y="-100" width="200" height="100" fill="white" style={{filter: `drop-shadow(white 0px 0px 1px) drop-shadow(white 0px 0px 2px) drop-shadow(white 0px 0px 3px)`}}></rect>
        </g>
      </mask>
      <g id="clock-bg" className="globe-rotate">
        <circle cx="0" cy="0" r={globe_size / 2} fill="url(#clock-image)" style={{filter: `grayscale(0) brightness(0.4)`}}></circle>
        <circle cx="0" cy="0" r={globe_size / 2} fill="url(#clock-image-no-sea)" style={{ filter: `grayscale(1) contrast(0) brightness(0)`/*filter: grayscale(1) contrast(1.8) brightness(1);*/}}></circle>
        <circle cx="0" cy="0" r={globe_size / 2} fill="url(#clock-image)" mask="url(#shadowMask)"></circle>
      </g>
      <circle cx="0" cy="0" r="3" fill="#0000" id="second-ripple" className={second_ripple ? 'active' : ''} style={{stroke:second_ripple_color}}></circle>
      <HourMarkers _now={now} offset={offset} {...hour}/>
      {/* ${this.props._renderMinuteHand({ minutes })} */}
      <g className="globe-rotate"><g id="sun-marker-rotate"><g id="sun-marker-translate">
        ${sun_marker && <circle id="sun" cx="0" cy="0" r="3"></circle>}
      </g></g></g>
      <g className="globe-rotate">
        <g id="location-marker-rotate">
          <g id="location-marker-translate">
            <g style={{transform:`scale(1.5)`,...location_marker_day_highlight}} fill="#f00" stroke="#f00" strokeWidth=".2">
              ${location_marker &&
                <g>
                  <circle cx="0" cy="0" r="1.5" fill="#fff0"></circle>
                  <circle cx="0" cy="0" r=".3" strokeWidth=".5"></circle>
                  <line x1="1.5" y1="0" x2="2.4" y2="0"></line>
                  <line x1="-1.5" y1="0" x2="-2.4" y2="0"></line>
                  <line y1="1.5" x1="0" y2="2.4" x2="0"></line>
                  <line y1="-1.5" x1="0" y2="-2.4" x2="0"></line>
                </g>
              }
            </g>
          </g>
        </g>
      </g>
      {/* ${this._renderHourHand({ hours: num_hours })} */}
      {/* <g>${this._renderMinuteText({ minutes, seconds })}</g> */}
    </svg>
  )
}

export default Clock
