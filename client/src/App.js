import { Cards } from "./Components/Cards";
import { CreateCard } from "./Components/Cards/Create";
import { Header } from "./Components/Header";
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom'
import { RefactorCard } from "./Components/Cards/Refactor";

function App() {
  return (
    <Router>
      <Header/>
      <Switch>

        <Route path= '/' exact>
          <Cards/>
        </Route>

        <Route path= '/create'>
          <CreateCard></CreateCard>
        </Route>

        <Route path= '/refactor/:id'>
          <RefactorCard></RefactorCard>
        </Route>

      </Switch>
    </Router>
  );
}

export default App;
