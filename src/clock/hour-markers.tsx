import * as React from 'react'
import Cn from 'classnames'
import Progress from './progress'
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
      // check progress for other options
      minute_progress = { display: false },
    } = {},
  } = {},
  _now,
}) {
  const dot_stroke_width = .5

  const _dot = getDotConfig(dot)
  const _text = getTextConfig(text)
  // for ease of reading & understanding below
  const current = { display, minutes, seconds_ticker }
  const show_progress = minute_progress.display
  return (
    <g id="hour-markers" fill="#fff" stroke="#000">
      {[...Array(24)].map((_, _h) => {
        const isCurrent = _h === _now.hours && current.display
        const rotation = _utils.getHourTheta({ hours: _h, direction_switch, offset })
        let text: React.ReactElement, dot: React.ReactElement

        // if Current. OR. based on text split
        if (isCurrent || isPartOfSplit(_h, _text.split)) {
          const translate = isCurrent ? `translate(${current.minutes || show_progress ? -13 : -6}px, 5px)` : 'translate(-4px, 8px)'
          text = (
            <g className={Cn(styles.hourMarkerText, {[styles.currentHour]: isCurrent})} style={{transform:`rotate(${rotation}deg) translate(0, ${100 - _text.depth}px)`}}>
              <g style={{ transform: `rotate(${-rotation}deg) ${translate}`}}>
                {isCurrent && show_progress &&
                  <Progress percent={_now.minutes / 60} {...minute_progress} />
                }
                <text style={{ transform:`translate(${show_progress && !current.minutes ? 5 : 0}px,0px)`}}>
                  <tspan>{is24h ? _h : (_h % 12 || 12)}</tspan>
                  {isCurrent && current.seconds_ticker &&
                    <tspan className={Cn(styles.tick, { [styles.on]: _now.seconds % 2 })}>:</tspan>
                  }
                  {isCurrent && current.minutes &&
                    <tspan className={styles.minutes}>{_utils.nDigits(_now.minutes)}</tspan>
                  }
                  {
                    !is24h && _h > 11 &&
                    <tspan className={styles.pm}>p</tspan>
                  }
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
            strokeWidth={dot_stroke_width}
          ></circle>
        }

        return <g key={_h}>{dot}{text}</g>
      })}
    </g>
  )
}

export default HourMarkers
