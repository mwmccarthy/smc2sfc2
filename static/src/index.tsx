import "babel-polyfill";
import * as React from "react"
import * as ReactDOM from "react-dom"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import spacing from 'material-ui/styles/spacing';
import BaseComponent from "./components/App";
import * as injectTapEventPlugin from "react-tap-event-plugin";

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: "#ffffff",    // white
        primary2Color: "#8176a2",    // SNES lavendar
        primary3Color: "#6d6870",    // SNES dark grey
        accent1Color: "#493580",     // SNES purple
        accent2Color: "#bdbcc0",     // SNES light grey
        accent3Color: "#6d6870",     // SNES dark grey
        pickerHeaderColor: "#493580" // SNES purple
    },
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
