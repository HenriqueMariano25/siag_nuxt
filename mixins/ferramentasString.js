

export const primeiraMaiuscula = {
    methods: {
        primeiraMaiuscula(palavra) {
            if(palavra == null) return ""

            palavra = palavra[0].toUpperCase() + palavra.substring(1);

            return palavra
        },
    },
}