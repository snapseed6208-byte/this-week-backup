import { Router, Route, Switch } from "wouter";
import { HomePage } from "@/pages/Home";
import { ThemeLibraryPage } from "@/pages/ThemeLibrary";
import { ThemeDetailPage } from "@/pages/ThemeDetail";
import { HistoryPage } from "@/pages/History";

export function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/library" component={ThemeLibraryPage} />
        <Route path="/theme/:id" component={ThemeDetailPage} />
        <Route path="/history" component={HistoryPage} />
        {/* 404 catch-all → redirect to home */}
        <Route>
          <HomePage />
        </Route>
      </Switch>
    </Router>
  );
}
