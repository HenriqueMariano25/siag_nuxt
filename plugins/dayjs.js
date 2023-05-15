import dayjs from "dayjs";
require('dayjs/locale/pt-br')


export default (context, inject) => {
  inject('dayjs', dayjs)
}
