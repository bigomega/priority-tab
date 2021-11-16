import ReactDOM from "react-dom"
import { useState, useEffect } from 'react'
import Clock from "./clock"
import _configs from "./config-presets"

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
        <Clock date_time={now} {..._configs.author.config}/>
      </div>
    </div>
  )
}
let start_time
// start_time = new Date('10/13/2021 18:19')
ReactDOM.render(<App start_time={start_time}/>, document.getElementById("app"))
