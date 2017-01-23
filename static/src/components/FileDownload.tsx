import * as React from "react";
import FileFileDownload from "material-ui/svg-icons/file/file-download";
import IconButton from "material-ui/IconButton";
import IconMenu from "material-ui/IconMenu";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import Toggle from "material-ui/Toggle";

interface FileDownloadProps {
    handleDownload: Function
};
interface FileDownloadState {
    open: boolean,
    anchorEl?: Element
};

class FileDownload extends React.Component<FileDownloadProps, FileDownloadState> {
    constructor(props: FileDownloadProps) {
        super(props);
        this.state = {
            open: false
        };
    }

    handleTouchTap(e: __MaterialUI.TouchTapEvent) {
        e.preventDefault();

        this.setState({
            open: true,
            anchorEl: e.currentTarget as Element
        });
    }

    render() {
        const downloadButton = (
            <IconButton
                tooltip="Download ROMs"
                touch={true}
                tooltipPosition="bottom-left"
                onTouchTap={(e) => this.handleTouchTap(e)}
            >
                <FileFileDownload color={"#ffffff"} />
            </IconButton>
        );

        return (
            <div>
                <IconMenu
                    iconButtonElement={downloadButton}
                    anchorOrigin={{ horizontal: "middle", vertical: "bottom" }}
                    targetOrigin={{ horizontal: "right", vertical: "top" }}
                >
                    <Toggle />
                    <MenuItem primaryText="with headers (.smc)" />
                    <MenuItem
                        primaryText="no headers (.sfc)"
                        onTouchTap={(e) => this.props.handleDownload(e)}
                    />
                </IconMenu>
            </div>
        );
    }
}

export default FileDownload;