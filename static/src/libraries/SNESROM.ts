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
        this.headerSize = buf.byteLength % 0x400;
        this.buffer = buf.slice(this.headerSize);
        this.size = this.buffer.byteLength;
        this.hash = md5(this.buffer);
        const tooSmall: boolean = this.size < SNESROM.MIN_ROM_SIZE;
        const tooBig: boolean = this.size > SNESROM.MAX_ROM_SIZE;
        if (!tooBig && !tooSmall) {
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
    static get HEADER_ADDRESSES() {
        return {
            title:       0x00,
            makeup:      0x15,
            romType:     0x16,
            romSize:     0x17,
            ramSize:     0x18,
            region:      0x19,
            company:     0x1a,
            version:     0x1b,
            complement:  0x1c,
            checksum:    0x1e,
            resetVector: 0x3c,
        };
    }
    static get REGIONS(): string[] {
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
        const loScore = this.scoreHeader(0x7fc0);
        const hiScore = this.scoreHeader(0xffc0);
        if (hiScore > loScore) {
            this.hiROM = true;
            this.loROM = false;
        } else if (loScore > 0) {
            this.loROM = true;
            this.hiROM = false;
        } else {
            this.loROM = this.hiROM = false;
        }
    }

    private scoreHeader(address: number) {
        const view = new DataView(this.buffer, address, 0x40);
        const title = String.fromCodePoint(
            ...Array.from({length: 21}, (v: void, k) => {
                return view.getUint8(SNESROM.HEADER_ADDRESSES.title + k);
            }),
        );
        const makeup = view.getUint8(SNESROM.HEADER_ADDRESSES.makeup);
        const romType =  view.getUint8(SNESROM.HEADER_ADDRESSES.romType);
        const romSize = view.getUint8(SNESROM.HEADER_ADDRESSES.romSize);
        const ramSize = view.getUint8(SNESROM.HEADER_ADDRESSES.ramSize);
        const region = view.getUint8(SNESROM.HEADER_ADDRESSES.region);
        const company = view.getUint8(SNESROM.HEADER_ADDRESSES.company);
        const version = view.getUint8(SNESROM.HEADER_ADDRESSES.version);
        const complement = view.getUint16(SNESROM.HEADER_ADDRESSES.complement, true);
        const checksum = view.getUint16(SNESROM.HEADER_ADDRESSES.checksum, true);
        const resetVector = view.getUint16(SNESROM.HEADER_ADDRESSES.resetVector, true);

        // 0x0000-0x7fff does not map to ROM, resetVector should not be < 0x8000
        if (resetVector < 0x8000) { return 0; }

        // loROM maps 0x8000-0xffff to ROM address 0x0000-0x7fff
        // hiROM maps 0x8000-0xffff to ROM addresses 0x8000-0xffff
        // Therefore if hiROM (header at ROM 0xffc0), resetVector points to ROM
        // at given address. If loROM (header at ROM 0x7fc0), reset vector
        // points to ROM at given address minus 0x8000

        // let resetOpcode: number;
        // if (address === 0xffc0) {
        //     resetOpcode = new Uint8Array(this.buffer, resetVector, 1)[0];
        // } else if (address === 0x7fc0) {
        //     resetOpcode = new Uint8Array(this.buffer, resetVector - 0x8000, 1)[0];
        // }

        // TODO: compile list of common starting op codes and check for valid resetOpcode

        let score = 1;

        if (this.allAscii(title)) { score += 4; }
        if (address === 0x7fc0 && makeup % 2 === 0) { score++; }
        if (address === 0xffc0 && makeup % 2 === 1) { score++; }
        if (romType < 0x08) { score++; }
        if (0x400 << romSize === this.buffer.byteLength) { score += 2; }
        if (ramSize < 0x08) { score++; }
        if (region < 0x0e) { score++; }
        if (company === 0x33) { score++; }
        if (version === 0x00) { score++; }
        if (checksum + complement === 0xffff && checksum !== 0xff00) { score += 6; }

        return score;
    }

    private parseHeader() {
        const dv = new DataView(
            this.buffer,
            this.hiROM ? 0xffc0 : 0x7fc0,
            0x40,
        );
        const region = dv.getUint8(SNESROM.HEADER_ADDRESSES.region);

        this.region = SNESROM.REGIONS[region];
        this.video = (region > 12 || region < 2) ? "NTSC" : "PAL";
        this.title = String.fromCharCode(
            ...Array.from({ length: 21 }, (v: void, k) => {
                return dv.getUint8(SNESROM.HEADER_ADDRESSES.title + k);
            }),
        ).trim();
    }

    private allAscii(str: string): boolean {
        return /^[\x00-\x7F]*$/.test(str);
    }
}

export default SNESROM;
