import * as React from "react";
import { SNESROM } from "../libraries/SNESROM";
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from "material-ui/FlatButton";
import Toggle from "material-ui/Toggle"

interface RomDisplayProps {
    rom: SNESROM
};

function RomDisplay(props: RomDisplayProps) {
    return (
        <div className="rom-display" style={{ margin: "1em" }}>
            <Card>
                <CardHeader
                    title={props.rom.title}
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                <CardText expandable={true}>
                    <p>Region: {props.rom.region}</p>
                    <p>HiROM: {String(props.rom.hiROM)}</p>
                    <p>ID: {props.rom.id}</p>
                    <p>Header size: {props.rom.headerSize}</p>
                </CardText>
                <CardActions>
                    <FlatButton label="Download" primary={true} />
                    <Toggle
                        label="Remove header?"
                        labelPosition="right"
                    />
                </CardActions>
            </Card >
        </div>
    );
};

export default RomDisplay;