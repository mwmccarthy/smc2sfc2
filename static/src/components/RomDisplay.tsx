import * as React from "react";
import SNESROM from "../libraries/SNESROM";
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from "material-ui/FlatButton";
import NavigationExpandMore from "material-ui/svg-icons/navigation/expand-more";

interface RomDisplayProps {
    rom: SNESROM,
    key: string
    remove: Function
};

function RomDisplay(props: RomDisplayProps) {
    return (
        <div style={{ margin: "1rem" }}>
            <Card>
                <CardHeader
                    avatar={ <NavigationExpandMore/> }
                    title={props.rom.title}
                    actAsExpander={true}
                    showExpandableButton={false}
                />
                {/* TODO: Add thegamesdb info */}
                {/*
                <CardMedia expandable={true}>
                    <img src="http://thegamesdb.net/banners/graphical/1526-g.png"/>
                </CardMedia>
                */}
                <CardText expandable={true}>
                    <p>File Name: {props.rom.name}</p>
                    <p>Region: {props.rom.region}</p>
                    <p>Video: {props.rom.video}</p>
                    <p>MemMap: {props.rom.hiROM ? "HiROM" : "LoROM"}</p>
                    <p>MD5: {props.rom.hash}</p>
                    <p>Header: {props.rom.headerSize ? "Yes" : "No"}</p>
                </CardText>
                <CardActions style={{ textAlign: "right" }}>
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