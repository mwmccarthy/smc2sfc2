import * as React from "react";
import { Toolbar, ToolbarGroup, ToolbarTitle } from "material-ui/Toolbar";
import HardwareVideogameAsset from "material-ui/svg-icons/hardware/videogame-asset";
import FileField from "./FileField";
import FileDownload from "./FileDownload";
import RomDisplay from "./RomDisplay";
import SNESROM from "../libraries/SNESROM";
import * as JSZip from "jszip";
import { saveAs } from "file-saver";

interface AppProps { };
interface AppState { roms: { [hash: string]: SNESROM } };
interface RomDict { [hash: string]: SNESROM };

class App extends React.Component<AppProps, AppState> {
    constructor() {
        super();
        this.state = {
            roms: {}
        };
    }

    handleFileChange(e: React.FormEvent<HTMLInputElement>): void {
        const roms: RomDict = {};
        Object.assign(roms, this.state.roms);
        const newRoms: File[] = Array.from(e.currentTarget.files);
        e.currentTarget.value = "";

        for (const file of newRoms) {
            ((f) => {
                const reader = new FileReader();
                const name = f.name;
                reader.addEventListener("load", (e) => {
                    const buf = reader.result;
                    const rom = new SNESROM(name, buf);
                    const roms: RomDict = {};
                    Object.assign(roms, this.state.roms);
                    if (!roms.hasOwnProperty(rom.hash)) {
                        roms[rom.hash] = rom;
                        this.setState({ roms: roms });
                    }
                })
                reader.readAsArrayBuffer(f);
            })(file);
        }
    }

    handleRemove(hash: string): void {
        const roms: RomDict = {};
        Object.assign(roms, this.state.roms);
        delete roms[hash];
        this.setState({ roms: roms });
    }

    handleDownload(e: __MaterialUI.TouchTapEvent): void {
        const roms: RomDict = {};
        Object.assign(roms, this.state.roms);
        const zip = new JSZip();
        for (const key of Object.keys(roms)) {
            zip.file(roms[key].name, roms[key].buffer);
        }
        zip.generateAsync({ type: "blob" }).then((content) => saveAs(content, "ROMS.zip"));
    }

    shouldComponentUpdate(nextProps: AppProps, nextState: AppState) {
        return true;
    }

    render() {
        const romsList: JSX.Element[] = [];

        for (const key of Object.keys(this.state.roms)) {
            romsList.push(
                <RomDisplay
                    key={key}
                    rom={this.state.roms[key]}
                    remove={(hash: string) => this.handleRemove(hash)}
                />
            );
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
                                    return this.handleFileChange(e);
                                }}
                            />
                            <FileDownload
                                handleDownload={(e: __MaterialUI.TouchTapEvent) => {
                                    return this.handleDownload(e);
                                }}
                            />
                        </ToolbarGroup>
                    </Toolbar>
                </div>
                <div>{romsList}</div>
            </div>
        );
    }
}

export default App;