import dayjs from "dayjs";

export default async ({ store, $axios }) =>  {
  try {

    let funcionariosBuscado = store.state.funcionarios.funcionarios

    let subSetoresBuscados = await $axios.$get("/efetivo/sub_setor")
      .then((resp) => {
        return resp.subSetores
      })

    if(funcionariosBuscado.length <= 0){

      let subSetores = []
      let subSetoresFuncionario = []
      let funcoes = []

      store.commit("funcionarios/DEFINIR_ESTA_BUSCANDO", true)

      let resp = await $axios.$get('/efetivo/buscar')

      let funcionarios = resp.dados.funcionarios

      new Promise(resolve => {
        funcionarios.forEach((funcionario) => {
          if (!subSetoresFuncionario.includes(funcionario["sub_setor"]))
            subSetoresFuncionario.push(funcionario["sub_setor"])
          if (!subSetores.find((sub) => sub.nome === funcionario.sub_setor)) {
            let subEncontrato = subSetoresBuscados.find(
              (sub) => sub.nome === funcionario["sub_setor"]
            )

            let setor
            let setor_id

            if (subEncontrato) {
              setor = subEncontrato.Setor.nome
              setor_id = subEncontrato.Setor.id
            } else {
              setor = null
              setor_id = null
            }
            subSetores.push({
              nome: funcionario["sub_setor"],
              setor,
              setor_id,
            })
          }
          if (!funcoes.includes(funcionario["cargo"]))
            funcoes.push(funcionario["cargo"])

          let sub = subSetoresBuscados.find(
            (sub) => sub.nome === funcionario.sub_setor
          )
          if (sub) {
            funcionario.setor = sub.Setor.nome
            funcionario.setor_id = sub.Setor.id
          }
        })

        let ultimaBusca = dayjs()

        store.commit("funcionarios/DEFINIR_FUNCIONARIOS", { funcionarios, ultimaBusca})
        store.commit("funcionarios/DEFINIR_SUBSETORESAJUSTE", subSetores)
        store.commit("funcionarios/DEFINIR_SUBSETORES", subSetoresFuncionario)
        store.commit("funcionarios/DEFINIR_FUNCOES", funcoes)

        return resolve
      })

      store.commit("funcionarios/DEFINIR_ESTA_BUSCANDO", false)
    }
  }catch (e){
    console.log(e)
  }
}
