const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const unixTime = () => {
  // const timestamp = Date.parse(new Date());
  // const date = new Date(timestamp);
  const date = new Date();
  const uTime = date.getTime()
  return uTime
}

module.exports = {
  formatTime: formatTime,
  unixTime
}
