// Celcius to Fahrenheit function
export function cToF(celsius) {
  const cTemp = celsius
  const cToFahr = (cTemp * 9) / 5 + 32
  return cToFahr
}

// Fahrenheit to Celcius function
export function fToC(fahrenheit) {
  const fTemp = fahrenheit
  const fToCel = ((fTemp - 32) * 5) / 9
  return fToCel.toFixed(2)
}

// JSON Parse function
export function jsonParse(data = '') {
  return JSON.parse(JSON.stringify(data))
}
