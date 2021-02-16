export default function({ store, redirect }) {
  if (!store.state.auth.status.loggedIn) {
    return redirect('/login');
  } else {
    redirect('/edit');
  }
}
