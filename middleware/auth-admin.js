export default async function ({$auth, redirect}) {
  let user = $auth.state.user

  if(user && user.funcao_id === 1){
  }else{
    redirect("/admin/login")
  }
}
