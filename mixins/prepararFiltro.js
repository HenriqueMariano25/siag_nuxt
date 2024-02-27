export const prepararFiltro = {
  methods: {
    prepararFiltro(filtrosRecebidos) {
      let filtros = {}

      for (let filtro of filtrosRecebidos) {
        let keyPrimaria = Object.keys(filtro)[0]
        let keySecundaria = Object.keys(filtro[keyPrimaria])[0]

        if(keySecundaria.includes('$in')){
          filtros = {...filtros, ...filtro}
          continue
        }

        if (keySecundaria.includes('$or')){
          filtros = { ...filtros, ...filtro }
          continue
        }

        if (keySecundaria.includes('$bet')) {
          filtros = { ...filtros, ...filtro }
          continue
        }

        if(keyPrimaria.includes('.id')){
          filtros[keyPrimaria] = filtro[keyPrimaria]
          continue
        }

        filtros[keyPrimaria] = {$iLike: `%${filtro[keyPrimaria]}%`}
      }

      return filtros
    },
  },
}
