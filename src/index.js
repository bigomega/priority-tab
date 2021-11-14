import ReactDOM from "react-dom"
import { useState, useEffect } from 'react'
import Clock from "./clock"

const clock_config = {
  // direction_switch: false,
  hour: {
    hand: {
      // width: 1,
      depth: 50,
      color: 'yellow',
    },
    marker: {
      // is24h: false,
      text: { split: 0,
        // depth: 70,
      },
      dot: {
        // size: 1.5,
        // depth: 24.5,
        // dot_skip_current: false,
      },
      now: {
        // display: false,
        minutes: false,
        seconds_ticker: false,
        minute_progress: {
          display: true,
          height: 1,
          // bg: '#000'
          // width: 30,
          // split: 4 * 3,
        },
      }
    },
  },
  second_ripple: true,
  second_ripple_color: '#f0f',
  location_marker: false,
  minute: { show_hand: true },
  events: {
    // spread: 8+2,
    // depth: 62.5-2,
    list: [
      {
        from: 515,
        to: 700,
        color: '#ff9300',
        text: ' 🦮 🌤',
      }, {
        from: 1700,
        to: 2000,
        stroke_width: .4,
        color: '#5100a3',
        text: '🦮  🏋️  🚿',
      }, {
        from: 2130,
        to: 500,
        color: '#111',
        text: ' SLEEP (8.5h)',
        text_color: '#fff6',
        background_image_tags: ['night,sleep', 'stars'],
      // }, {
      //   at: 510,
      //   text: '🍌',
      //   spread: 12,
      //   depth: 52,
      }, {
        at: 750,
        text: '🥪',
        depth: 50,
        spread: 12,
      }, {
        at: 1300,
        text: '🍛',
        depth: 55,
        spread: 12,
        at_text_offset_deg: -15,
      // }, {
      //   at: 1720,
      //   text: '☕️',
      //   depth: 60,
      //   spread: 12,
      }, {
        at: 2000,
        text: '🍕',
        spread: 12,
        depth: 65,
        // at_highlight_duration: 2,
        // at_text_offset_deg: -5,
      }
    ]
  },
}

function App({start_time = new Date}) {
  const [now, setNow] = useState(start_time)
  useEffect(() => {
    const tickInterval = setInterval(() => {
      now.setSeconds(now.getSeconds() + 1)
      setNow(new Date(now.getTime()))
    }, 1000)
    return () => clearInterval(tickInterval)
  })

  return (
    <div className="container">
      <div id="clock">
        <Clock date_time={now} {...clock_config}/>
      </div>
    </div>
  )
}
let start_time
// start_time = new Date('10/13/2021 7:59')
ReactDOM.render(<App start_time={start_time}/>, document.getElementById("app"))
