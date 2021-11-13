import { getSunPosition, getTransformForLatLong } from "./_utils"

const sun_style = {
  fill: 'yellow',
  filter: 'drop-shadow(0px 0px 0.1px #ffa500) drop-shadow(0px 0px 1px #fa0f) drop-shadow(0px 0px 1px #fa09) drop-shadow(0px 0px 1px #fa09) drop-shadow(0px 0px 1px #ff09) drop-shadow(0px 0px 2px #fff) drop-shadow(0px 0px 3px #fff)',
}

function Sun({ now, globe_rotate = 0 }) {
  const radius = 3
  const pos = getSunPosition(now.date_time)
  const { translate, rotate } = getTransformForLatLong(pos)
  return (
    <g transform={`rotate(${globe_rotate})`}>
      <g transform= {`rotate(${rotate})`}>
        <g transform={`translate(0 ${translate})`}>
          <circle style={sun_style} cx="0" cy="0" r={radius}></circle>
        </g>
      </g>
    </g>
  )
}

export default Sun
