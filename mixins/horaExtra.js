import dayjs from "dayjs"

export const horaExtra = {
  methods: {
    horaExtra(hora_extra) {

      return hora_extra > 0
        ? `${("00" + hora_extra.toString().split(".")[0]).slice(-2)}:${hora_extra.toString().split(".").length > 1
          ? (( "00" + (hora_extra.toString().split(".")[1] * 0.6).toFixed(0) ).slice(-2))
          : "00"
        }`
        : "00:00"
    },
  },
}

export const horaExtraProjetada = {
  methods: {
    horaExtraProjetada(data, hora_extra) {
      if (hora_extra && dayjs(data).day() >= 1 && dayjs(data).day() <= 5) {
        let horaExtraAdicionada = ((parseFloat(hora_extra) + 2).toFixed(2)).toString()

        return hora_extra > 0
          ? `${("00" + horaExtraAdicionada.split(".")[0]).slice(
            -2
          )}:${horaExtraAdicionada.split(".").length > 1
            ? ("00" + (horaExtraAdicionada.split(".")[1] * 0.6).toFixed(0)).slice(
              -2
            )
            : "00"
          }`
          : `${("00" + horaExtraAdicionada.split(".")[0]).slice(-2)}:${horaExtraAdicionada.split(".").length > 1
            ? ("00" + (horaExtraAdicionada.split(".")[1] * 0.6).toFixed(0)).slice(
              -2
            )
            : "00"
          }`
      } else if (hora_extra && (dayjs(data).day() === 0 || dayjs(data).day() === 6)) {
        let horaExtraAdicionada = ((parseFloat(hora_extra) + 7.50).toFixed(2)).toString()

        return hora_extra > 0
          ? `${("00" + horaExtraAdicionada.split(".")[0]).slice(
            -2
          )}:${hora_extra.split(".").length > 1
            ? (
              "00" +
              (
                (horaExtraAdicionada).split(".")[1] * 0.6
              ).toFixed(0)
            ).slice(-2)
            : "00"
          }`
          : `${("00" + (horaExtraAdicionada).split(".")[0]).slice(-2)}:${hora_extra.split(".").length > 1
            ? ("00" + (horaExtraAdicionada.split(".")[1] * 0.6).toFixed(0)).slice(
              -2
            )
            : "00"
          }`
      }
    },
  },
}
