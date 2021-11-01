import "./App.css";
import PostsList from "./components/Posts/PostsList";
import Header from "./components/Header/Header";
import NewPost from "./components/Posts/NewPost";
import AuthContext from "./store/auth-context";
import { useContext } from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import Chat from "./components/Chat/Chat";
import { ModalContextProvider } from "./store/modal-context";
import NoPageFound from "./components/UI/NoPageFound";

function App() {
  const authCtx = useContext(AuthContext);
  const { pathname } = useLocation();
  return (
    <div className="app">
      <ModalContextProvider>
        <Header />
      </ModalContextProvider>
      <Switch>
        <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
        <Route path="/" exact>
          <Redirect to="/home" />
        </Route>
        {authCtx.user && (
          <Route path="/chat/" exact>
            <Chat />
          </Route>
        )}

        <Route path="/home">
          <PostsList />
          {authCtx.user && <NewPost username={authCtx.username} />}
        </Route>
        <Route path="*">
          <NoPageFound />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
