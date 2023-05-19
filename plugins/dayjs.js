import dayjs from "dayjs";
var isBetween = require('dayjs/plugin/isBetween')
var weekOfYear = require('dayjs/plugin/weekOfYear')

require('dayjs/locale/pt-br')

dayjs.extend(isBetween)
dayjs.extend(weekOfYear)

export default (context, inject) => {
  inject('dayjs', dayjs)
}
