import * as md5 from "js-md5";

class SNESROM {
    public name: string;
    public size: number;
    public headerSize: number;
    public buffer: ArrayBuffer;
    public hiROM: boolean;
    public loROM: boolean;
    public title: string;
    public region: string;
    public video: string;
    public hash: string;

    constructor(name: string, buf: ArrayBuffer) {
        this.name = name;
        this.headerSize = buf.byteLength % SNESROM.MIN_ROM_SIZE;
        this.buffer = buf.slice(this.headerSize);
        this.size = this.buffer.byteLength;
        this.hash = md5(this.buffer);
        if (SNESROM.MIN_ROM_SIZE <= this.size && this.size <= SNESROM.MAX_ROM_SIZE) {
            this.detectMemMap();
            this.parseHeader();
        }
    }

    public valid(): boolean {
        return this.hiROM || this.loROM;
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
        // Get checksum and complement from loROM and hiROM locations
        const loChecks = new Uint16Array(this.buffer, 0x7fdc, 2);
        const hiChecks = new Uint16Array(this.buffer, 0xffdc, 2);

        // This should work almost all of the time. TODO: the rest of the time
        this.loROM = (loChecks[0] + loChecks[1] === 0xffff);
        this.hiROM = (hiChecks[0] + hiChecks[1] === 0xffff);
    }

    private parseHeader() {
        const dv = new DataView(
            this.buffer,
            this.hiROM ? 0xffb0 : 0x7fb0,
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
