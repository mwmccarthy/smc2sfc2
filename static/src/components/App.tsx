import * as React from "react";

export interface AppProps {};
export interface AppState {};

export class App extends React.Component<AppProps, AppState> {
    constructor() {
        super();
    }

    render() {
        return <h1>Yo.</h1>;
    }
}