export const prepararFiltro = {
  methods: {
    prepararFiltro(filtrosRecebidos) {
      let filtros = Object.assign({}, filtrosRecebidos)
      let keys = Object.keys(filtros)

      for (let f of keys) {
        if(Object.keys(filtros[f]).includes('$in'))
          continue

        if (Object.keys(filtros[f]).includes('$or'))
          continue

        filtros[f] = {$iLike: `%${filtros[f]}%`}
      }
      return filtros
    },
  },
}
