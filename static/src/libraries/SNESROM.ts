import * as md5 from "js-md5";

class SNESROM {
    name: string;
    size: number;
    headerSize: number;
    // malformed: boolean;
    rom: Uint8Array;
    hiROM: boolean;
    title: string;
    region: string;
    video: string;
    hash: string;
    // licensee: string;
    url: string;

    constructor(file: File, callback?: Function) {
        this.name = file.name;
        this.size = file.size;
        this.headerSize = this.size % SNESROM.MIN_ROM_SIZE;

        const reader: FileReader = new FileReader();

        reader.addEventListener("load", () => {
            const buffer: ArrayBuffer = reader.result;
            const blob = new Blob([buffer.slice(this.headerSize)])

            this.hash = md5(buffer);
            this.rom = new Uint8Array(buffer.slice(this.headerSize));
            this._detectMemMap();
            this._parseHeader();
            this.url = window.URL.createObjectURL(blob);

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
        const header = this.rom.slice(0xffb0, 0x10000);
        const checksum = (header[0x2c] << 8) + header[0x2d];
        const complement = (header[0x2e] << 8) + header[0x2f];

        // this should work most of the time
        // TODO: the rest of the time
        this.hiROM = (checksum + complement === 0xffff);
    }

    _parseHeader() {
        const offset = this.hiROM ? 0xffb0 : 0x7fb0;
        const header = this.rom.slice(offset, offset + 0x80);
        const title = header.slice(0x10, 0x25);
        const region = header[0x29];

        this.title = String.fromCharCode(...title).trim();
        this.region = SNESROM.REGIONS[region];
        this.video = (region > 12 || region < 2) ? "NTSC" : "PAL";
    }
}

export default SNESROM;
