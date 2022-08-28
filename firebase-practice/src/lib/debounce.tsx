export default function debounce(func: () => void) {
  let timer: NodeJS.Timer
  return function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(func, 500)
  }
}
