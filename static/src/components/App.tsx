import * as React from "react";
import AppBar from "material-ui/AppBar";
import { FileField } from "./FileField";
import RomDisplay from "./RomDisplay";
import { SNESROM } from "../libraries/SNESROM";


interface AppProps { };
interface AppState {
    roms: SNESROM[]
};

class App extends React.Component<AppProps, AppState> {
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
            return <RomDisplay rom={rom} />;
        });

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