import * as React from "react";
import { SNESROM } from "../libraries/SNESROM";

export interface RomDisplayProps {
    rom: SNESROM
};

export function RomDisplay(props: RomDisplayProps) {
    return (
        <div className="rom-display">
            <p>Name: {props.rom.name}</p>
            <p>Title: {props.rom.title}</p>
            <p>Region: {props.rom.region}</p>
            <p>HiROM: {String(props.rom.hiROM)}</p>
            <p>ID: {props.rom.id}</p>
            <p>Header size: {props.rom.headerSize}</p>
            <a href={props.rom.url} download={props.rom.title+".sfc"}>
                Download
            </a>
        </div>
    );
}