import * as React from "react"
import * as ReactDOM from "react-dom"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import * as Colors from "material-ui/styles/colors";
import spacing from 'material-ui/styles/spacing';
import BaseComponent from "./components/App";
import * as injectTapEventPlugin from "react-tap-event-plugin";

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: Colors.white,
        // primary2Color: Colors.grey200,
        // primary3Color: Colors.grey400,
        accent1Color: Colors.deepPurple500,
        // accent2Color: Colors.grey100,
        // accent3Color: Colors.grey500,
        // pickerHeaderColor: Colors.deepPurple500
    }
});

const App = () => (
    <MuiThemeProvider muiTheme={muiTheme}>
        <BaseComponent />
    </MuiThemeProvider>
);

injectTapEventPlugin();
ReactDOM.render(
    <App />,
    document.getElementById("app")
);
