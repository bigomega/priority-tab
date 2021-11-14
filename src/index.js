import ReactDOM from "react-dom"
import { useState, useEffect } from 'react'
import Clock from "./clock"

const clock_config = {
  hour: {
    direction_switch: true,
    hand: {
      // width: 1,
      depth: 60,
    },
    // hand.color: 'yellow',
    marker: {
      // is24h: false,
      text: { split: 0 },
      dot: { split: 24, size: 1.5, depth: 24.5,
        // dot_skip_current: false,
      },
      now: {
        // display: false,
        minutes: false,
        seconds_ticker: false,
        minute_progress: {
          display: true,
          // width: 30,
          // split: 4 * 3,
        },
      }
    },
  },
  second_ripple: true,
  second_ripple_color: '#f0f',
  // location_marker: false,
  // minute: { show_hand: true },
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
// start_time = new Date('10/13/2021 6:33')
ReactDOM.render(<App start_time={start_time}/>, document.getElementById("app"))
