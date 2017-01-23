import * as md5 from "js-md5";

class SNESROM {
    name: string;
    size: number;
    headerSize: number;
    buffer: ArrayBuffer;
    hiROM: boolean;
    title: string;
    region: string;
    video: string;
    hash: string;

    constructor(file: File, callback?: Function) {
        this.name = file.name;
        this.size = file.size;
        this.headerSize = this.size % SNESROM.MIN_ROM_SIZE;

        const reader: FileReader = new FileReader();

        reader.addEventListener("load", () => {
            this.buffer = reader.result;
            this.hash = md5(this.buffer);
            this._detectMemMap();
            this._parseHeader();
            if (callback) callback(this);
        });

        reader.readAsArrayBuffer(file);
    }

    static get MAX_ROM_SIZE(): number { return 0x600000; }
    static get MIN_ROM_SIZE(): number { return 0x40000; }
    static get SMC_HEADER_SIZE(): number { return 0x200; }
    static get REGIONS(): string[] {
        // from snes9x
        return [
            "Japan",
            "USA and Canada",
            "Oceania, Europe and Asia",
            "Sweden",
            "Finland",
            "Denmark",
            "France",
            "Holland",
            "Spain",
            "Germany, Austria, and Switzerland",
            "Italy",
            "Hong Kong and China",
            "Indonesia",
            "South Korea"
        ];
    }

    tooBig(): boolean {
        return this.size > SNESROM.MAX_ROM_SIZE + SNESROM.SMC_HEADER_SIZE;
    }

    tooSmall(): boolean {
        return this.size < SNESROM.MIN_ROM_SIZE;
    }

    _detectMemMap() {
        // checking for internal ROM header at 0xffb0 (HiROM)
        const dv = new DataView(
            this.buffer,
            this.headerSize + 0xffb0,
            0x30
        );
        const checksum = dv.getUint16(0x2c);
        const complement = dv.getUint16(0x2e);

        // This should work almost all of the time. TODO: the rest of the time
        this.hiROM = (checksum + complement === 0xffff);
    }

    _parseHeader() {
        const dv = new DataView(
            this.buffer,
            this.headerSize + (this.hiROM ? 0xffb0 : 0x7fb0),
            0x40
        );
        const region = dv.getUint8(0x29);
        
        this.region = SNESROM.REGIONS[region];
        this.video = (region > 12 || region < 2) ? "NTSC" : "PAL";
        this.title = String.fromCharCode(
            ...Array.from({ length: 21 }, (v: void, k) => dv.getUint8(0x10 + k))
        ).trim();
    }
}

export default SNESROM;
