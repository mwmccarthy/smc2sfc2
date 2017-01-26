import * as md5 from "js-md5";

class SNESROM {
    public name: string;
    public size: number;
    public headerSize: number;
    public buffer: ArrayBuffer;
    public hiROM: boolean;
    public title: string;
    public region: string;
    public video: string;
    public hash: string;

    constructor(name: string, buf: ArrayBuffer) {
        this.name = name;
        this.buffer = buf;
        this.size = buf.byteLength;
        this.headerSize = this.size % SNESROM.MIN_ROM_SIZE;
        this.hash = md5(this.buffer);
        this.detectMemMap();
        this.parseHeader();
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
            "South Korea",
        ];
    }

    private detectMemMap() {
        // checking for internal ROM header at 0xffb0 (HiROM)
        const dv = new DataView(
            this.buffer,
            this.headerSize + 0xffb0,
            0x30,
        );
        const checksum = dv.getUint16(0x2c);
        const complement = dv.getUint16(0x2e);

        // This should work almost all of the time. TODO: the rest of the time
        this.hiROM = (checksum + complement === 0xffff);
    }

    private parseHeader() {
        const dv = new DataView(
            this.buffer,
            this.headerSize + (this.hiROM ? 0xffb0 : 0x7fb0),
            0x40,
        );
        const region = dv.getUint8(0x29);

        this.region = SNESROM.REGIONS[region];
        this.video = (region > 12 || region < 2) ? "NTSC" : "PAL";
        this.title = String.fromCharCode(
            ...Array.from({ length: 21 }, (v: void, k) => dv.getUint8(0x10 + k)),
        ).trim();
    }
}

export default SNESROM;
