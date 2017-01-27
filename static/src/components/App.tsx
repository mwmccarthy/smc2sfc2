import { saveAs } from "file-saver";
import * as JSZip from "jszip";
import HardwareVideogameAsset from "material-ui/svg-icons/hardware/videogame-asset";
import { Toolbar, ToolbarGroup, ToolbarTitle } from "material-ui/Toolbar";
import * as React from "react";
import SNESROM from "../libraries/SNESROM";
import FileDownload from "./FileDownload";
import FileField from "./FileField";
import RomDisplay from "./RomDisplay";

interface IAppState { roms: { [hash: string]: SNESROM }; };
interface IRomDict { [hash: string]: SNESROM; };

class App extends React.Component<void, IAppState> {
    constructor() {
        super();
        this.state = {
            roms: {},
        };
    }

    public render() {
        const romsList: JSX.Element[] = [];

        for (const key of Object.keys(this.state.roms)) {
            romsList.push(
                <RomDisplay
                    key={key}
                    rom={this.state.roms[key]}
                    remove={(hash: string) => this.handleRemove(hash)}
                />,
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
                                onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                    return this.handleFileChange(event);
                                }}
                            />
                            <FileDownload
                                handleDownload={(event: __MaterialUI.TouchTapEvent, headers: boolean) => {
                                    return this.handleDownload(event, headers);
                                }}
                            />
                        </ToolbarGroup>
                    </Toolbar>
                </div>
                <div>{romsList}</div>
            </div>
        );
    }

    private handleFileChange(event: React.FormEvent<HTMLInputElement>): void {
        const roms: IRomDict = {};
        Object.assign(roms, this.state.roms);
        const newRoms: File[] = Array.from(event.currentTarget.files);
        event.currentTarget.value = "";

        for (const file of newRoms) {
            const reader = new FileReader();
            const name = file.name;
            reader.addEventListener("load", () => {
                const buf = reader.result;
                const rom = new SNESROM(name, buf);
                Object.assign(roms, this.state.roms);
                if (!roms.hasOwnProperty(rom.hash)) {
                    roms[rom.hash] = rom;
                    this.setState({ roms });
                }
            });
            reader.readAsArrayBuffer(file);
        }
    }

    private handleRemove(hash: string): void {
        const roms: IRomDict = {};
        Object.assign(roms, this.state.roms);
        delete roms[hash];
        this.setState({ roms });
    }

    private handleDownload(event: __MaterialUI.TouchTapEvent, headers: boolean): void {
        const roms: IRomDict = {};
        Object.assign(roms, this.state.roms);
        const zip = new JSZip();
        for (const key of Object.keys(roms)) {
            const buffer = roms[key].buffer.slice(roms[key].headerSize));
            const name = roms[key].name.replace(/\.[^.]+$/, "");
            if (headers) {
                zip.file(name + ".smc", this.concatBuffers(new ArrayBuffer(512), buffer));
            } else {
                zip.file(name + ".sfc", buffer);
            }
        }
        zip.generateAsync({ type: "blob" }).then((content) => saveAs(content, "ROMS.zip"));
    }

    private concatBuffers(buffer1: ArrayBuffer, buffer2: ArrayBuffer): ArrayBuffer {
        const result = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        result.set(new Uint8Array(buffer1), 0);
        result.set(new Uint8Array(buffer2), buffer1.byteLength);
        return result.buffer;
    }
}

export default App;
