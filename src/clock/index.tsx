import Cn from 'classnames'
import * as _utils from './_utils'
import HourMarkers from './hour-markers'
import HourHand from './hour-hand'
import Sun from './sun'
import LocationMarker from './location-marker'
import Events from './events'

import * as styles from './index.module.scss'

import IMG_Azimuthal from "/images/Azimuthal_equidistant_projection_SW-2.png"
import IMG_Azimuthal_land from "/images/Azimuthal_equidistant_projection_SW-no-sea.png"

function Clock({
  background_opacity = 1,
  direction_switch = true,
  offset = 0,
  second_ripple = false,
  second_ripple_color = '#f00',
  location_marker = true,
  sun_marker = true,
  fixed_sun = true,
  globe_offset = 0,
  hour = {},
  minute: {
    show_hand = false,
    show_text = false,
    seconds_ticker = true,
  } = {},
  events = {},
  date_time = new Date,
} = {}) {
  const globe_size = 170

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

  const sun_pos = _utils.getSunPosition(now.date_time)
  let globe_rotate = _utils.hToA(globe_offset)
  if (fixed_sun) {
    globe_rotate += sun_pos.longitude + _utils.hToA(offset) + 180
  }
  const shadow_rotate = 180 - sun_pos.longitude

  return (
    <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">
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
          <rect transform={`rotate(${shadow_rotate})`} x="-100" y="-100" width="200" height="100" fill="white" style={{filter: `drop-shadow(white 0px 0px 1px) drop-shadow(white 0px 0px 2px) drop-shadow(white 0px 0px 3px)`}}></rect>
        </g>
      </mask>
      <g transform={`rotate(${globe_rotate})`} opacity={background_opacity}>
        <circle cx="0" cy="0" r={globe_size / 2} fill="url(#clock-image)" style={{filter: `grayscale(0) brightness(0.4)`}}></circle>
        <circle cx="0" cy="0" r={globe_size / 2} fill="url(#clock-image-no-sea)" style={{ filter: `grayscale(1) contrast(0) brightness(0)`/*filter: grayscale(1) contrast(1.8) brightness(1);*/}}></circle>
        <circle cx="0" cy="0" r={globe_size / 2} fill="url(#clock-image)" mask="url(#shadowMask)"></circle>
      </g>
      <circle
        cx="0" cy="0" r="3" fill="#0000"
        className={Cn(
          styles.secondRipple, { [styles.secondRippleActive]: second_ripple }
        )}
        style={{stroke:second_ripple_color}}
      ></circle>
      <Events _now={now} {...{ offset, direction_switch }} {...events}/>
      <HourMarkers _now={now} {...{ offset, direction_switch }} {...hour}/>
      {/* ${this.props._renderMinuteHand({ minutes })} */}
      <g opacity={background_opacity}>
        {sun_marker && <Sun now={now} globe_rotate={globe_rotate} />}
        {location_marker && <LocationMarker now={now} globe_rotate={globe_rotate} />}
      </g>
      <HourHand _now={now} {...{offset, direction_switch}} {...hour} />
      {/* <g>${this._renderMinuteText({ minutes, seconds })}</g> */}
    </svg>
  )
}

export default Clock
