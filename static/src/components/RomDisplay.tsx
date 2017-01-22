import * as React from "react";
import { SNESROM } from "../libraries/SNESROM";
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from "material-ui/FlatButton";
import NavigationExpandMore from "material-ui/svg-icons/navigation/expand-more";
import Toggle from "material-ui/Toggle"

interface RomDisplayProps {
    rom: SNESROM,
    key: string
    remove: Function
};

function RomDisplay(props: RomDisplayProps) {
    return (
        <div style={{ margin: "1em" }}>
            <Card>
                <CardHeader
                    avatar={ <NavigationExpandMore/> }
                    title={props.rom.title}
                    actAsExpander={true}
                    showExpandableButton={false}
                />
                <CardText expandable={true}>
                    <p>Region: {props.rom.region}</p>
                    <p>HiROM: {String(props.rom.hiROM)}</p>
                    <p>MD5: {props.rom.hash}</p>
                    <p>Header size: {props.rom.headerSize}</p>
                </CardText>
                <CardActions style={{ textAlign: 'right' }}>
                    <FlatButton
                        label="remove"
                        secondary={true}
                        onTouchTap={() => props.remove(props.rom.hash)}
                    />
                </CardActions>
            </Card >
        </div>
    );
};

export default RomDisplay;