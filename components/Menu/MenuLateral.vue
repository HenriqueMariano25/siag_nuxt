<template>
  <div class="h-full">
    <div class="grid h-full relative text-white bg-primaria-900 z-10 content-between"
         :class="{ '': !menuAberto, 'w-[200px]': menuAberto }">
      <div class="flex flex-col divide-y divide-white/[.30] border-b border-b-white/[0.30]">
        <div class="flex content-center p-1 ">
          <button class="rounded hover:bg-white/[.30]" @click="menuAberto = !menuAberto">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-10 h-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
            </svg>
          </button>
          <h1 class="font-bold text-3xl self-center ml-9" v-if="menuAberto">SIAG</h1>
        </div>
        <div>
          <div class="p-1">
            <button class="items-center flex h-11 hover:bg-white/[.30] w-full p-2 rounded text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                <path fill-rule="evenodd"
                      d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                      clip-rule="evenodd"/>
              </svg>
              <span class="ml-2" v-if="menuAberto">{{ $auth.user.nome.split(" ")[0] }}</span>
            </button>
          </div>
        </div>
        <div>
          <div class="p-1">
            <NuxtLink to="/">
              <button class="items-center flex h-11 hover:bg-white/[.30] w-full p-1 rounded text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
                  <path
                    d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"/>
                  <path
                    d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"/>
                </svg>
                <span class="ml-2" v-if="menuAberto">Home</span>
              </button>
            </NuxtLink>
          </div>
          <div class="p-1">
            <NuxtLink to="/administracao">
              <button class="items-center flex h-11 hover:bg-white/[.30] w-full p-1 rounded text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
                  <path fill-rule="evenodd"
                        d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-3.873 8.703a4.126 4.126 0 017.746 0 .75.75 0 01-.351.92 7.47 7.47 0 01-3.522.877 7.47 7.47 0 01-3.522-.877.75.75 0 01-.351-.92zM15 8.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15zM14.25 12a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H15a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15z"
                        clip-rule="evenodd"/>
                </svg>
                <span class="ml-2" v-if="menuAberto">Administração</span>
              </button>
            </NuxtLink>
            <template v-if="$auth.user.permissoes.includes('solicitacao_servico')">
              <NuxtLink to="/suprimentos">
                <button class="items-center flex h-11 hover:bg-white/[.30] w-full p-1 rounded text-sm">
                  <img src="@/assets/icons/forklift-w.svg" alt="close" class="w-8 h-8"/>
                  <span class="ml-2" v-if="menuAberto">Suprimentos</span>
                </button>
              </NuxtLink>
            </template>
<!--            <template v-if="$auth.user.permissoes.includes('solicitacao_servico')">-->
<!--            <template>-->
<!--              <NuxtLink to="/filas">-->
<!--                <button class="items-center flex h-11 hover:bg-white/[.30] w-full p-1 rounded text-sm">-->
<!--                  <img src="@/assets/icons/queue-w.svg" alt="close" class="w-8 h-8"/>-->
<!--                  <span class="ml-2" v-if="menuAberto">Filas</span>-->
<!--                </button>-->
<!--              </NuxtLink>-->
<!--            </template>-->
          </div>

        </div>
      </div>


      <div class="flex flex-col divide-y divide-white/[.30] border-t border-t-white/[0.30]">
        <div>
          <div class="p-1">
            <button class="items-center flex h-11 hover:bg-white/[.30] w-full p-1 rounded text-sm"
                    @click="mostrarDialogLogout = true">
              <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8"
                   xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier"><title>enter_door_line</title>
                  <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="System" transform="translate(-864.000000, -192.000000)" fill-rule="nonzero">
                      <g id="enter_door_line" transform="translate(864.000000, 192.000000)">
                        <path
                          d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z"
                          id="MingCute" fill-rule="nonzero"></path>
                        <path
                          d="M11.5,3 C12.0523,3 12.5,3.44772 12.5,4 C12.5,4.51284071 12.113973,4.93550786 11.6166239,4.99327234 L11.5,5 L6,5 L6,19 L16,19 L16,12.5 C16,11.9477 16.4477,11.5 17,11.5 C17.51285,11.5 17.9355092,11.886027 17.9932725,12.3833761 L18,12.5 L18,19 L20,19 C20.5523,19 21,19.4477 21,20 C21,20.51285 20.613973,20.9355092 20.1166239,20.9932725 L20,21 L4,21 C3.44772,21 3,20.5523 3,20 C3,19.48715 3.38604429,19.0644908 3.88337975,19.0067275 L4,19 L4,5 C4,3.94563773 4.81587733,3.08183483 5.85073759,3.00548573 L6,3 L11.5,3 Z M13.5,11 C14.3284,11 15,11.6716 15,12.5 C15,13.3284 14.3284,14 13.5,14 C12.6716,14 12,13.3284 12,12.5 C12,11.6716 12.6716,11 13.5,11 Z M15.7928,4.17156 C16.1834,3.78103 16.8165,3.78103 17.2071,4.17156 C17.5675615,4.53204 17.5952893,5.09926651 17.2902834,5.49156153 L17.2071,5.58577 L16.7945,5.99827 L20,5.99827 C20.5522,5.99827 21,6.44599 21,6.99827 C21,7.51111071 20.6138867,7.93377786 20.1166055,7.99154234 L20,7.99827 L16.7917,7.99827 L17.2076,8.4147 C17.5978,8.80548 17.5974,9.43864 17.2066,9.82891 C16.8459538,10.1891777 16.2786805,10.2165498 15.8865601,9.91124644 L15.7924,9.82799 L13.6724,7.70525 C13.3123077,7.34469615 13.2848639,6.77776219 13.589754,6.38565419 L13.6729,6.29149 L15.7928,4.17156 Z"
                          id="形状" fill="#ffffff"></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <span class="ml-2" v-if="menuAberto">Sair</span>
            </button>
          </div>
        </div>
        <div v-if="menuAberto">
          <div class="p-1">
            <div class="w-[192px]">
              <img alt="logo" src="../../assets/img/logoagcnovo.png"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <DialogLogout @cancelar="mostrarDialogLogout = false" v-if="mostrarDialogLogout"/>
  </div>
</template>

<script>
import DialogLogout from "~/components/Dialogs/DialogLogout.vue";
export default {
  name: "MenuLateral",
  data(){
    return{
      menuAberto: false,
      mostrarDialogLogout:false
    }
  },
  components:{
    DialogLogout
  }
}
</script>

<style scoped>

</style>
