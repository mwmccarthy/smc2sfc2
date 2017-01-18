import * as React from "react";
import { FileField } from "./FileField";
import { SNESROM } from "../libraries/SNESROM";

export interface AppProps { };
export interface AppState {
    roms: SNESROM[]
};

export class App extends React.Component<AppProps, AppState> {
    constructor() {
        super();
        this.state = {
            roms: []
        };
    }

    handleFileChange(e: React.FormEvent<HTMLInputElement>): void {
        const currentRoms: SNESROM[] = this.state.roms.slice();
        const currentNames: string[] = currentRoms.map(r => r.name);
        const newRoms: File[] = Array.from(e.currentTarget.files);

        for (const rom of newRoms) {
            if (currentNames.indexOf(rom.name) < 0) {
                currentRoms.push(new SNESROM(rom, () => {
                    this.setState({ roms: currentRoms });
                }));
            }
        }
    }

    render() {
        const romsList: JSX.Element[] = this.state.roms.map((rom) => {
            return (
                <li>
                    <p>{rom.name}</p>
                    <p>{rom.title}</p>
                    <p>{rom.headerSize}</p>
                </li>
            );
        });

        return (
            <div>
                <FileField
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        return this.handleFileChange(e)
                    }}
                />
                <ol>{romsList}</ol>
            </div>
        );
    }
}
