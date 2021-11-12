import * as React from 'react'
import Cn from 'classnames'
import * as _utils from './_utils'
import * as styles from './hour-markers.module.scss'

function isPartOfSplit(value:number, split_by:number, total = 24) {
  return split_by && value % (24 / split_by) === 0
}

function getDotConfig({ size = 1, depth = 16, split = 24, skip_current = true }) {
  return { size, depth, split, skip_current }
}

function getTextConfig({ depth = 20, split = 4 }) {
  return { depth, split }
}

function HourMarkers({
  direction_switch = false,
  offset = 0,
  marker: {
    is24h = true,
    dot = {},
    text = {},
    now: {
      display = true,
      minutes = true,
      seconds_ticker = true,
      minute_progress = false,
      minute_progress_split = 4,
    } = {},
  } = {},
  _now,
}) {
  const stroke_width = .5
  const progress_height = 2
  const progress_width = 25
  const progress_color = '#fff'
  const progress_offset = 2
  const progress_stroke_width = .5

  const _dot = getDotConfig(dot)
  const _text = getTextConfig(text)
  const current = {
    display, minutes, seconds_ticker, minute_progress, minute_progress_split,
  }
  return (
    <g id="hour-markers" fill="#fff" stroke="#000">
      {[...Array(24)].map((_, _h) => {
        const isCurrent = _h === _now.hours && current.display
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
          hour_text_tick = <tspan className={Cn(styles.tick, {[styles.on]: _now.seconds % 2})}>:</tspan>
        }
        if (isCurrent && current.minutes) {
          hour_text_minutes = <tspan className={styles.minutes}>{_utils.nDigits(_now.minutes)}</tspan>
        }
        if (!is24h && _h > 11) {
          hour_text_ampm = <tspan className={styles.pm}>p</tspan>
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

        // if Current. OR. based on text split
        if (isCurrent || isPartOfSplit(_h, _text.split)) {
          const translate = isCurrent ? `translate(${current.minutes || current.minute_progress ? -13 : -6}px, 5px)` : 'translate(-4px, 8px)'
          text = (
            <g className={Cn(styles.hourMarkerText, {[styles.currentHour]: isCurrent})} style={{transform:`rotate(${rotation}deg) translate(0, ${100 - _text.depth}px)`}}>
              <g style={{ transform: `rotate(${-rotation}deg) ${translate}`}}>
                {progress}
                <text style={{ transform:`translate(${current.minute_progress && !current.minutes ? 7 : 0}px,0px)`}}>
                  {hour_text}
                </text>
              </g>
            </g>
          )
        }

        // if not current and skip-it AND based on dot split
        if (!(_dot.skip_current && isCurrent) && isPartOfSplit(_h, _dot.split)) {
          const translate = `translate(0, ${100 - (_dot.size * 2) - _dot.depth - 2}px)`
          dot = <circle
            className={styles.hourMarkerDot}
            cx="0" cy="0" r={_dot.size}
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
