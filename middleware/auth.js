export default ({store, redirect}) => {
  if(!store.state.usuario || !store.state.usuario.token){
    return redirect('/login')
  }
}
