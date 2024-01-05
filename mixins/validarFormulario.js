export function validarFormulario(campos, variavel) {
	let erros = []

	for (let campo of campos) {
		if (variavel[`${campo}`] === null || variavel[`${campo}`] === "") erros.push(campo)
	}

	return erros
}
