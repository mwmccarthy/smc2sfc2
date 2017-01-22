import * as md5 from "js-md5";

export class SNESROM {
    name: string;
    size: number;
    headerSize: number;
    // malformed: boolean;
    rom: Uint8Array;
    hiROM: boolean;
    title: string;
    region: number;
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

        this.title = String.fromCharCode(...title).trim();
        this.region = header[0x29];

        // weird logic here is from snes9x, can't find documentation
        // let licensee: number;
        // if (header[0x2a] !== 0x33) {
        //     licensee = (header[0x2a] & 0xF00) * 36 + (header[0x2a] & 0xf);
        // }
        // else if (this._isalnum(header[0]) && this._isalnum(header[1])) {
        //     let lt1, rt1, lt2, rt2;
        //     lt1 = header[0] - (header[0] >= 97 ? 32 : 0);
        //     lt1 = header[0] - (header[0] >= 97 ? 32 : 0);
        //     lt2 = (lt1 > 57) ? (lt1 - 55) : (lt1 - 48);
        //     rt2 = (rt1 > 57) ? (rt1 - 55) : (rt1 - 48);
        //     licensee = lt2 * 36 + rt2;
        // }
        // this.licensee = LICENSEES[licensee] || "unknown";
    }

    // _hashBuffer(buf: ArrayBuffer): string {
    //     const dv = new DataView(buf);
    //     const words = Array.from(
    //         { length: dv.byteLength / 4 }, (v: void, k) => dv.getUint32(k * 4)
    //     );
    //     const wa = new WordArray(words);
    //     return MD5(wa);
    // }

    _isalnum(n: number) {
        const char = String.fromCharCode(n);
        return (char >= 'a' && char <= 'z') ||
            (char >= 'A' && char <= 'Z') ||
            (char >= '0' && char <= '9');
    }
}
