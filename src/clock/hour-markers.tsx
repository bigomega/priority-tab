import * as _utils from './_utils'
import * as React from 'react'
function HourMarkers({
  direction_switch = false,
  is24h = true,
  marker: {
    dot_size = 1,
    dot_depth = 16,
    dot_split = 24,
    dot_skip_current = true,
    text_depth = 20,
    text_split = 4,
  } = {},
  now: {
    show = true,
    minutes = true,
    seconds_ticker = true,
    minute_progress = false,
    minute_progress_split = 4,
  } = {},
  _now,
  offset = 0,
}) {

  const stroke_width = .5
  const progress_height = 2
  const progress_width = 25
  const progress_color = '#fff'
  const progress_offset = 2
  const progress_stroke_width = .5
  const current = {
    show, minutes, seconds_ticker, minute_progress, minute_progress_split,
  }
  return (
    <g id="hour-markers" fill="#fff" stroke="#000">
      {[...Array(24)].map((_, _h) => {
        const isCurrent = _h === _now.hours && current.show
        const rotation = _utils.getHourTheta({ hours: _h, direction_switch, offset })
        let hour_text = is24h ? _h : (_h % 12 || 12)
        let hour_text_tick: React.ReactElement,
          hour_text_minutes: React.ReactElement,
          hour_text_ampm: React.ReactElement,
          text: React.ReactElement,
          dot: React.ReactElement,
          progress: React.ReactElement
        ;

        // if (!isCurrent) { hour_text = this._nDigits(hour_text) }
        if (isCurrent && current.seconds_ticker) {
          hour_text_tick = <tspan className={`tick ${_now.seconds % 2 ? 'on' : ''}`}>:</tspan>
        }
        if (isCurrent && current.minutes) {
          hour_text_minutes = <tspan className="minutes">${_utils.nDigits(_now.minutes)}</tspan>
        }
        if (!is24h && _h > 11) {
          hour_text_ampm = <tspan className="pm">p</tspan>
        }

        if (isCurrent && current.minute_progress) {
          progress = (
            <g>
              <rect
                width={progress_width}
                height={progress_height}
                style={{fill:'#0003', strokeWidth: progress_stroke_width, stroke:'#000'}}
                x="0"
                y={progress_offset}
              ></rect>
              <rect
                width={(_now.minutes / 60 * progress_width) - progress_stroke_width}
                height={progress_height - progress_stroke_width}
                style={{fill:progress_color, strokeWidth:0, stroke:'#000'}}
                x={progress_stroke_width / 2}
                y={progress_offset + progress_stroke_width / 2}
              ></rect>
              <g>
                {[...Array(current.minute_progress_split)].map((_, i) => {
                  const x_offset = progress_width * i / current.minute_progress_split
                  return (
                    <line
                      x1="${x_offset}"
                      y1="${progress_offset}"
                      x2="${x_offset}"
                      y2="${progress_height + progress_offset}"
                      style={{strokeWidth:progress_stroke_width,stroke: '#0009'}}
                    ></line>
                  )
                })}
              </g>
            </g>
          )
        }

        if (isCurrent || text_split && _h % (24 / text_split) === 0) {
          const translate = isCurrent ? `translate(${current.minutes || current.minute_progress ? -13 : -6}px, 5px)` : 'translate(-4px, 8px)'
          text = (
            <g className={`hour-marker-text ${isCurrent ? 'current-hour' : ''}`} style={{transform:`rotate(${rotation}deg) translate(0, ${100 - text_depth}px)`}}>
              <g style={{ transform: `rotate(${-rotation}deg) ${translate}`}}>
                {progress}
                <text style={{ transform:`translate(${current.minute_progress && !current.minutes ? 7 : 0}px,0px)`}}>
                  {hour_text}
                </text>
              </g>
            </g>
          )
        }

        if ((!isCurrent || !dot_skip_current) && dot_split && _h % (24 / dot_split) === 0) {
          const translate = `translate(0, ${100 - (dot_size * 2) - dot_depth - 2}px)`
          dot = <circle
            className="hour-marker-dot"
            cx="0" cy="0" r={dot_size}
            style={{transform:`rotate(${rotation}deg) ${translate}`}}
            strokeWidth={stroke_width}
          ></circle>
        }
        return <g key={_h}>{dot}{text}</g>
      })}
    </g>
  )
}

export default HourMarkers
