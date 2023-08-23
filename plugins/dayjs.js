import dayjs from "dayjs";
var isBetween = require('dayjs/plugin/isBetween')
var weekOfYear = require('dayjs/plugin/weekOfYear')
var utc = require('dayjs/plugin/utc')

require('dayjs/locale/pt-br')

dayjs.extend(isBetween)
dayjs.extend(weekOfYear)
dayjs.extend(utc)
dayjs.locale('pt-br')
// dayjs.extend()

export default (context, inject) => {
  inject('dayjs', dayjs)
}
