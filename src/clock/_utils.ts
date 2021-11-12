export const hToA = (hours: number) => 360 / 24 * hours
export const mToA = (hours: number) => 360 / 60 * hours
export const nDigits = (v: number, n = 2) => ('0000000' + Math.floor(v)).slice(-n)

export function getHourTheta({ hours = 0, offset = 0, direction_switch = false }) {
  const dir = direction_switch ? -1 : 1
  return hToA(hours + offset * dir) * dir
}

export function getTransformForLatLong({ latitude = 0, longitude = 0 } = {}){
  // Lat 15˚= 7px
  return {
    translate: (90 - latitude) / 15 * 7,
    rotate: -longitude,
  }
}

export function getSolarDeclination(now = new Date) {
  function getDayOfYear() {
    // var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now.getTime() - start.getTime();
    var oneDay = 1000 * 60 * 60 * 24;
    var dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear + 284
  }

  return 23.44 * Math.sin((360 / 365.25) * getDayOfYear() * Math.PI / 180)
  // https://stackoverflow.com/questions/62184648/how-to-calculate-the-latitude-of-the-subsolar-point-ie-solar-declination-usin
}
