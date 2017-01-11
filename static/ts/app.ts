const form: HTMLElement = document.getElementById("convert-form");

form.addEventListener("submit", function(event: Event): void {
    
    event.preventDefault();

    const rom: File = this['file-field'].files[0];
    const reader: FileReader = new FileReader();

    this['file-field'].value = "";

    reader.addEventListener("load", function(): void {
        const buffer: ArrayBuffer = this.result;
        console.log('Do some stuff.');
        // Do some stuff.
    });

    if (rom instanceof File) {
        reader.readAsArrayBuffer(rom);
    }
});
