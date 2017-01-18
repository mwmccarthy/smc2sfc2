export class SNESROM {
    name: string;
    size: number;
    headerSize: number;
    malformed: boolean;
    hiROM: boolean;
    title: string;

    constructor(file: File) {
        this.name = file.name;
        this.size = file.size;
        this.headerSize = this.size % SNESROM.MIN_FILE_SIZE;

        if (this.tooBig() || this.tooSmall() || !this.justRight()) {
            this.malformed = true;
            return;
        }

        const reader: FileReader = new FileReader();

        reader.addEventListener("load", () => {
            const buffer: ArrayBuffer = reader.result;
            const dump: Uint8Array = new Uint8Array(buffer);
            const indices: { [index: string]: number } = {
                title: 0xFC0,
                makeup: 0xFD5,
                type: 0xFD6,
                ROMSize: 0xFD7,
                SRAMSize: 0xFD8,
                country: 0xFD9,
                license: 0xFDA,
                version: 0xFDB,
                checksumComplement: 0xFDC,
                checksum: 0xFDE
            };

            //this.hiROM = Boolean(dump[this.headerSize + 0xF] & 1);

            for (const key in indices) {
                indices[key] += this.hiROM ? 0xF000 : 0x7000;
            }

            this.title = String.fromCharCode(
                ...dump.slice(indices["title"], indices["title"] + 21)
            );
        });

        reader.readAsArrayBuffer(file);
    }

    static get MAX_FILE_SIZE(): number { return 0x600000; }
    static get MIN_FILE_SIZE(): number { return 0x40000; }
    static get SMC_HEADER_SIZE(): number { return 0x200; }

    tooBig(): boolean {
        return this.size > SNESROM.MAX_FILE_SIZE + SNESROM.SMC_HEADER_SIZE;
    }

    tooSmall(): boolean {
        return this.size < SNESROM.MIN_FILE_SIZE;
    }

    justRight(): boolean {
        return !this.headerSize || this.headerSize == SNESROM.SMC_HEADER_SIZE;
    }
}

