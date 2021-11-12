import ReactDOM from "react-dom"
import Clock from "./clock"

function App() {
  return (
    <div className="container">
      <div id="clock">
        <Clock />
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("app"))
