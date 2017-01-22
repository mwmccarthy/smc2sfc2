import * as React from "react";
import { Toolbar, ToolbarGroup, ToolbarTitle } from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton"
import HardwareVideogameAsset from "material-ui/svg-icons/hardware/videogame-asset"
import FileFileDownload from "material-ui/svg-icons/file/file-download"
import Toggle from "material-ui/Toggle"
import { deepPurple500, white } from "material-ui/styles/colors";
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
                    <Toolbar style={{ backgroundColor: deepPurple500 }} >
                        <ToolbarGroup firstChild={true}>
                            <HardwareVideogameAsset
                                color={white}
                                style={{ margin: "1em" }}
                            />
                            <ToolbarTitle
                                text="smc2sfc2: SNES ROM Converter"
                                style={{ color: white }}
                            />
                        </ToolbarGroup>
                        <ToolbarGroup lastChild={true}>
                            <FileField
                                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                                    return this.handleFileChange(e)
                                }}
                            />
                            <IconButton
                                tooltip="Download ROMs"
                                touch={true}
                                tooltipPosition="bottom-left">
                                <FileFileDownload
                                    color={white}
                                />
                            </IconButton>
                        </ToolbarGroup>
                    </Toolbar>
                </div>
                <div>{romsList}</div>
            </div>
        );
    }
}

export default App;