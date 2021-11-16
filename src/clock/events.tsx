import Arc from './arc'
import { getHourTheta } from './_utils'

function militaryToDecimal(time = 0) {
  return Math.floor(time/100) + (time%100)/60
}
const absAngle = (ang = 0) => ang + (ang < 0 ? 360 : 0)


function getLocalEventDefaults({
  color, depth, spread, stroke_width, text_color, inactive_opacity,
  at,
  from = 0,
  to = 0,
  text = '',
  at_highlight_duration = 1,
  at_text_offset_deg = 0,
  page_background_image_tags = ['random', 'clouds,night'],
  // clock_image_tags = ['clock'],
  // reminder: true,
  // reminder_dismissible: '',
}){
  return { from, to, color, depth, spread, text, page_background_image_tags, text_color, at_highlight_duration, at_text_offset_deg, stroke_width, at, inactive_opacity }
}

function Events({
  offset,
  direction_switch,
  display = true,
  list = [],
  color = '#000',
  depth = 63.5,
  spread = 10,
  stroke_width = .2,
  text_color = '#fff',
  inactive_opacity = .35,
  _now,
}){
  if (!display) {
    return <g></g>
  }

  const global_config = { color, depth, spread, stroke_width, text_color, inactive_opacity }
  return (
    <g>
      {list.map((local_event, i) => {
        const { from, to, color, depth, spread, text, page_background_image_tags, text_color, at_highlight_duration, at_text_offset_deg, stroke_width, at, inactive_opacity } = getLocalEventDefaults({...global_config, ...local_event})
        const from_hours = militaryToDecimal(from)
        const to_hours = militaryToDecimal(to)
        const id = from + text + i
        let is_active:boolean
        if (at !== undefined ) {
          const at_hours = militaryToDecimal(at)
          const at_angle = getHourTheta({hours: at_hours, offset, direction_switch})
          is_active = _now.num_hours >= at_hours && _now.num_hours < at_hours + at_highlight_duration
          return (
            <g
              key={at+id}
              transform={`rotate(${at_angle+at_text_offset_deg}) translate(0 ${depth})`}
              style={{ opacity: is_active ? 1 : inactive_opacity }}
            >
              <text
                style={{ textShadow: Array(2).fill('0 0 30px white').join(',') }}
                transform={`rotate(${-at_angle-at_text_offset_deg})`}
                fontSize={spread} fill={text_color}
              >
                {text}
              </text>
            </g>
          )
        }

        const from_angle = getHourTheta({hours: from_hours, offset, direction_switch})
        const to_angle = getHourTheta({hours: to_hours, offset, direction_switch})
        const dir = direction_switch ? -1 : 1
        const dist = absAngle((to_angle - from_angle) * dir)
        const rotate = from_angle + (direction_switch ? - dist : 0)
        is_active = _now.num_hours >= from_hours && _now.num_hours < to_hours
        if (to < from) { // goes to the next day
          is_active = _now.num_hours >= from_hours || _now.num_hours < to_hours
        }
        return (
          <g key={id} style={{opacity: is_active ? 1 : inactive_opacity}}>
            <Arc
              fill={color}
              transform={`rotate(${rotate})`}
              end_angle={dist}
              strokeWidth={stroke_width}
              stroke="#fff"
              {...{ depth, spread }}
              />
            <Arc
              id={id}
              type="text-ref"
              // text_direction={true}
              transform={`rotate(${rotate})`}
              end_angle={dist}
              strokeWidth={stroke_width}
              {...{ depth, spread }}
            />
            {is_active &&
              <text fontSize={spread - stroke_width * 2} fill={text_color}>
                <textPath xmlSpace="preserve" xlinkHref={'#'+id}>{text}</textPath>
              </text>
            }
          </g>
        )
      })}
    </g>
  )
}

// 0:6 => 0:90
// 17:22 => 255:330

// 0:6 => 0:-90 => 0:270 => 270:0
// 22:4 => -330:-60 => 30:300 => 300:30
// 17:22 => -255:-330 => 105:30 => 30:105
//

export default Events
