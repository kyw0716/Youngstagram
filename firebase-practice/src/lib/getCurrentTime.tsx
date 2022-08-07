export default function getCurrentTime() {
  const date = new Date()
  const Year = String(date.getFullYear())
  const Month = String(date.getMonth() + 1).padStart(2, "0")
  const Day = String(date.getDate()).padStart(2, "0")
  const Hour = String(date.getHours()).padStart(2, "0")
  const Minute = String(date.getMinutes()).padStart(2, "0")
  const Second = String(date.getSeconds()).padStart(2, "0")
  const MSecond = String(date.getMilliseconds()).padStart(3, "0")
  return Year + Month + Day + Hour + Minute + Second + MSecond
}
