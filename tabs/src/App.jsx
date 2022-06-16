import React from "react";
// https://fluentsite.z22.web.core.windows.net/quick-start
import { Provider, teamsTheme, Loader } from "@fluentui/react-northstar";
import { HashRouter as Router, Redirect, Route } from "react-router-dom";
import { useTeamsFx } from "./hooks/useTeamsFx";
import Privacy from "./extra/Privacy";
import TermsOfUse from "./extra/TermsOfUse";
import Tab from "./Tab";
import "./App.css";
import TabConfig from "./extra/TabConfig";

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function App() {
	const { theme, loading } = useTeamsFx();
	return (
		<Provider
			theme={theme || teamsTheme}
			styles={{ backgroundColor: "#eeeeee" }}
		>
			<Router>
				<Route exact path='/'>
					<Redirect to='/tab' />
				</Route>
				{loading ? (
					<Loader style={{ margin: 100 }} />
				) : (
					<>
						<Route exact path='/privacy' component={Privacy} />
						<Route
							exact
							path='/termsofuse'
							component={TermsOfUse}
						/>
						<Route exact path='/tab' component={Tab} />
						<Route exact path='/config' component={TabConfig} />
					</>
				)}
			</Router>
		</Provider>
	);
}
