import * as React from "react";
import { Toolbar, ToolbarGroup, ToolbarTitle } from "material-ui/Toolbar";
import HardwareVideogameAsset from "material-ui/svg-icons/hardware/videogame-asset";
import FileField from "./FileField";
import FileDownload from "./FileDownload";
import RomDisplay from "./RomDisplay";
import SNESROM from "../libraries/SNESROM";

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

        e.currentTarget.value = "";

        for (const f of newRoms) {
            new SNESROM(f, (rom: SNESROM) => {
                if (!(rom.hash in roms)) roms[rom.hash] = rom;
                this.setState({ roms: roms });
            });
        }
    }

    handleRemove(hash: string): void {
        const roms: { [hash: string]: SNESROM } = {};
        Object.assign(roms, this.state.roms);
        delete roms[hash];
        this.setState({ roms: roms });
    }

    render() {
        const romsList: JSX.Element[] = [];

        for (const key in this.state.roms) {
            if (this.state.roms.hasOwnProperty(key)) {
                romsList.push(
                    <RomDisplay
                        key={key}
                        rom={this.state.roms[key]}
                        remove={(hash: string) => this.handleRemove(hash)}
                    />
                );
            }
        }

        return (
            <div>
                <div style={{ margin: "0rem" }}>
                    <Toolbar style={{ backgroundColor: "#493580" }} >
                        <ToolbarGroup firstChild={true}>
                            <HardwareVideogameAsset
                                color={"#ffffff"}
                                style={{ margin: "1em" }}
                            />
                            <ToolbarTitle
                                text="smc2sfc2"
                                style={{ color: "#ffffff" }}
                            />
                        </ToolbarGroup>
                        <ToolbarGroup lastChild={true}>
                            <FileField
                                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                                    return this.handleFileChange(e)
                                }}
                            />
                            <FileDownload />
                        </ToolbarGroup>
                    </Toolbar>
                </div>
                <div>{romsList}</div>
            </div>
        );
    }
}

export default App;