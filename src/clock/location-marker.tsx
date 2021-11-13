import { useState, useEffect } from 'react'
import { getCurrentLocation, getTransformForLatLong } from './_utils'

function LocationMarker({ now, globe_rotate }) {
  const [transform, setTransform] = useState({translate: 0, rotate: 0})
  useEffect(() => {
    getCurrentLocation(loc => setTransform(getTransformForLatLong(loc?.coords)))
  }, [])

  const day_shadow = now.num_hours > 6.5 && now.num_hours < 17.5 ? { filter: `drop-shadow(0px 0px 0.2px #fff) drop-shadow(0px 0px 0.2px #fff)` } : {}

  return (
    <g transform={`rotate(${globe_rotate})`}>
      <g transform={`rotate(${transform.rotate})`}>
        <g transform={`translate(0 ${transform.translate})`}>
          <g style={{ transform: `scale(1.5)`, ...day_shadow }} fill="#f00" stroke="#f00" strokeWidth=".2">
            <g>
              <circle cx="0" cy="0" r="1.5" fill="#fff0"></circle>
              <circle cx="0" cy="0" r=".3" strokeWidth=".5"></circle>
              <line x1="1.5" y1="0" x2="2.4" y2="0"></line>
              <line x1="-1.5" y1="0" x2="-2.4" y2="0"></line>
              <line x1="0" y1="1.5" x2="0" y2="2.4"></line>
              <line x1="0" y1="-1.5" x2="0" y2="-2.4"></line>
            </g>
          </g>
        </g>
      </g>
    </g>
  )
}

export default LocationMarker
