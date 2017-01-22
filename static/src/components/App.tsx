import * as React from "react";
import AppBar from "material-ui/AppBar";
import { FileField } from "./FileField";
import RomDisplay from "./RomDisplay";
import { SNESROM } from "../libraries/SNESROM";

interface AppProps { };
interface AppState {
    roms: { [hash: string]: SNESROM }
};

class App extends React.Component<AppProps, AppState> {
    constructor() {
        super();
        this.state = {
            roms: {}
        };
    }

    handleFileChange(e: React.FormEvent<HTMLInputElement>): void {
        const roms: { [hash: string]: SNESROM } = {};
        Object.assign(roms, this.state.roms);
        const newRoms: File[] = Array.from(e.currentTarget.files);
        for (const f of newRoms) {
            new SNESROM(f, (rom: SNESROM) => {
                if (!roms[rom.hash]) roms[rom.hash] = rom;
                this.setState({ roms: roms });
            });
        }
    }

    render() {
        const romsList: JSX.Element[] = [];

        for (const key in this.state.roms) {
            if (this.state.roms.hasOwnProperty(key)) {
                romsList.push(
                    <RomDisplay key={key} rom={this.state.roms[key]} />
                );
            }
        }

        // .map((rom, k) => {
        //     return <RomDisplay rom={rom} key={rom.hash} />;
        // });

        return (
            <div>
                <FileField
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        return this.handleFileChange(e)
                    }}
                />
                <div>{romsList}</div>
            </div>
        );
    }
}

export default App;