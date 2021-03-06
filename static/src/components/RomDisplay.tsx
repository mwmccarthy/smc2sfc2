import { Card, CardActions, CardHeader, CardMedia, CardText } from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import NavigationExpandMore from "material-ui/svg-icons/navigation/expand-more";
import * as React from "react";
import SNESROM from "../libraries/SNESROM";

interface IRomDisplayProps {
    rom: SNESROM;
    key: string;
    remove: Function;
};

function RomDisplay(props: IRomDisplayProps) {
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
                    <p>File Size: {props.rom.size}</p>
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
