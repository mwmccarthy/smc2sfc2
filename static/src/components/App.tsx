import * as React from "react";
import { FileField } from "./FileField";

export interface AppProps {};
export interface AppState {
    roms: File[]
};

export class App extends React.Component<AppProps, AppState> {
    constructor() {
        super();
        this.state = {
            roms: []
        };
    }

    handleFileChange(e: React.FormEvent<HTMLInputElement>) {
        const roms = this.state.roms.slice();
        const rom = e.currentTarget.files[0];
        this.setState({
            roms: roms.concat(rom)
        })
        return;
    }

    render() {
        const roms = this.state.roms.map((rom) => {
            return (
                <li>{rom.name}</li>
            );
        });

        return (
            <div>
                <FileField
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        return this.handleFileChange(e)
                    }}
                />
                <ol>{roms}</ol>
            </div>
        );
    }
}

// const form: HTMLElement = document.getElementById("convert-form");

// form.addEventListener("submit", function(event: Event): void {

//     event.preventDefault();

//     const rom: File = this['file-field'].files[0];
//     const reader: FileReader = new FileReader();

//     this['file-field'].value = "";

//     reader.addEventListener("load", function(): void {
//         const buffer: ArrayBuffer = this.result;
//         console.log('Do some stuff.');
//         // Do some stuff.
//     });

//     if (rom instanceof File) {
//         reader.readAsArrayBuffer(rom);
//     }
// });