const sun_style = {
  fill: 'yellow',
  filter: 'drop-shadow(0px 0px 0.1px #ffa500) drop-shadow(0px 0px 1px #fa0f) drop-shadow(0px 0px 1px #fa09) drop-shadow(0px 0px 1px #fa09) drop-shadow(0px 0px 1px #ff09) drop-shadow(0px 0px 2px #fff) drop-shadow(0px 0px 3px #fff)',
}

function Sun(props) {
  return (
    <g className="globe-rotate">
      <g id="sun-marker-rotate">
        <g id="sun-marker-translate">
          <circle style={sun_style} cx="0" cy="0" r="3"></circle>
        </g>
      </g>
    </g>
  )
}

export default Sun
