import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";

import App from "./App";

import { AuthProvider } from "./context/Auth/AuthContext";
import { CampaignsProvider } from "./context/Campaigns/CampaignsContext";

ReactDOM.render(
	<React.StrictMode>
	  <CssBaseline />
	  <AuthProvider>
		<CampaignsProvider>
		  {/* qualquer outro provider que precisar */}
		  <App />
		</CampaignsProvider>
	  </AuthProvider>
	</React.StrictMode>,
	document.getElementById("root")
  );

// ReactDOM.render(
// 	<React.StrictMode>
// 		<CssBaseline>
// 			<App />
// 		</CssBaseline>,
//   </React.StrictMode>

// 	document.getElementById("root")
// );
