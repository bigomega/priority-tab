import ReactDOM from "react-dom"
import Clock from "./clock"

const clock_config = {
  hour: {
    direction_switch: true,
    hand: {
      // width: 1,
      depth: 70,
    },
    // hand.color: 'yellow',
    is24h: true,
    marker: {
      text_split: 0, dot_split: 24, dot_size: 1.5, dot_depth: 24.5,
      // dot_skip_current: false,
    },
    now: {
      // show: false,
      minutes: false,
      seconds_ticker: false,
      // minute_progress: true,
      minute_progress_split: 4 * 3,
    }
  },
  second_ripple: true,
  second_ripple_color: '#f0f',
  // location_marker: false,
  offset: 0,
  // minute: { show_hand: true },
}

function App() {
  let now
  // now = new Date('12/10/2020 3:14')
  return (
    <div className="container">
      <div id="clock">
        <Clock date_time={now} second_ripple={undefined} {...{}}/>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("app"))
