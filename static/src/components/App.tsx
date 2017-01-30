import { saveAs } from "file-saver";
import * as JSZip from "jszip";
import LinearProgress from "material-ui/LinearProgress";
import Snackbar from "material-ui/Snackbar";
import HardwareVideogameAsset from "material-ui/svg-icons/hardware/videogame-asset";
import { Toolbar, ToolbarGroup, ToolbarTitle } from "material-ui/Toolbar";
import * as React from "react";
import SNESROM from "../libraries/SNESROM";
import FileDownload from "./FileDownload";
import FileField from "./FileField";
import RomDisplay from "./RomDisplay";

interface IAppState {
    loading: boolean;
    roms: { [hash: string]: SNESROM };
    notify: boolean;
    notification: string;
};
interface IRomDict { [hash: string]: SNESROM; };

class App extends React.Component<void, IAppState> {
    constructor() {
        super();
        this.state = {
            loading: false,
            roms: {},
            notify: false,
            notification: "",
        };
    }

    public render() {
        const romsList: JSX.Element[] = [];
        const progressBar: JSX.Element = this.state.loading
            ? (<LinearProgress mode="indeterminate"/>)
            : null;

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
                                enabled={Object.keys(this.state.roms).length > 0}
                            />
                        </ToolbarGroup>
                    </Toolbar>
                </div>
                <div>{progressBar}</div>
                <div>{romsList}</div>
                <Snackbar
                    open={this.state.notify}
                    message={this.state.notification}
                    autoHideDuration={4000}
                />
            </div>
        );
    }

    private shouldComponentUpdate(nextProps: void, nextState: IAppState): boolean {
        if (this.state.notify === true && nextState.notify === false) {
            return false;
        } else {
            return true;
        }
    }

    private handleFileChange(event: React.FormEvent<HTMLInputElement>): void {
        const state = Object.assign({}, this.state);
        const numFiles = event.currentTarget.files.length;
        const newRoms: File[] = Array.from(event.currentTarget.files);

        // TODO: do this with React
        event.currentTarget.value = "";

        state.loading = true;
        this.setState(state);

        let romCount = 0;
        let notAddedCount = 0;

        for (const file of newRoms) {
            const reader = new FileReader();
            const name = file.name;
            reader.addEventListener("load", () => {
                const rom = new SNESROM(name, reader.result);
                romCount++;
                if (state.roms.hasOwnProperty(rom.hash) || !rom.valid()) {
                    notAddedCount++;
                } else {
                    state.roms[rom.hash] = rom;
                }
                if (romCount === newRoms.length) {
                    state.loading = false;
                    if (notAddedCount > 0) {
                        state.notify = true;
                        if (notAddedCount > 1) {
                            state.notification = notAddedCount
                                + " duplicate or invalid ROMs were not added.";
                        } else {
                            state.notification = "1 duplicate or invalid ROM was not added.";
                        }
                    }
                    this.setState(state);
                    if(state.notify) {
                        state.notify = false;
                        state.notification = "";
                        this.setState(state);
                    }
                }
            });
            reader.readAsArrayBuffer(file);
        }
    }

    private handleRemove(hash: string): void {
        const state = Object.assign({}, this.state);
        delete state.roms[hash];
        this.setState(state);
    }

    private handleDownload(event: __MaterialUI.TouchTapEvent, headers: boolean): void {
        const state = Object.assign({}, this.state);
        state.loading = true;
        this.setState(state);
        const zip = new JSZip();
        for (const key of Object.keys(state.roms)) {
            const buffer = state.roms[key].buffer;
            const name = state.roms[key].name.replace(/\.[^.]+$/, "");
            if (headers) {
                zip.file(name + ".smc", this.concatBuffers(new ArrayBuffer(512), buffer));
            } else {
                zip.file(name + ".sfc", buffer);
            }
        }
        zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, (headers ? "smc" : "sfc") + " ROMs.zip");
            state.loading = false;
            this.setState(state);
        });
    }

    private concatBuffers(buffer1: ArrayBuffer, buffer2: ArrayBuffer): ArrayBuffer {
        const result = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        result.set(new Uint8Array(buffer1), 0);
        result.set(new Uint8Array(buffer2), buffer1.byteLength);
        return result.buffer;
    }
}

export default App;

