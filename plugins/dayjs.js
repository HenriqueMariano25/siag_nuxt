import dayjs from "dayjs";
var isBetween = require('dayjs/plugin/isBetween')

require('dayjs/locale/pt-br')

dayjs.extend(isBetween)

export default (context, inject) => {
  inject('dayjs', dayjs)
}
