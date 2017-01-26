import * as React from "react";
import FileFileDownload from "material-ui/svg-icons/file/file-download";
import IconButton from "material-ui/IconButton";
import IconMenu from "material-ui/IconMenu";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import Toggle from "material-ui/Toggle";

interface IFileDownloadProps {
    handleDownload: Function;
};
interface IFileDownloadState {
    open: boolean;
    anchorEl?: Element;
};

class FileDownload extends React.Component<IFileDownloadProps, IFileDownloadState> {
    constructor(props: IFileDownloadProps) {
        super(props);
        this.state = {
            open: false,
        };
    }

    public render() {
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
                    <MenuItem
		    	primaryText="no headers (.sfc)"
			onTouchTap={() => this.props.handleDownload(false)}
		    />
                    <MenuItem
                        primaryText="with headers (.smc)"
                        onTouchTap={() => this.props.handleDownload(true)}
                    />
                </IconMenu>
            </div>
        );
    }

    private handleTouchTap(e: __MaterialUI.TouchTapEvent) {
        e.preventDefault();

        this.setState({
            anchorEl: e.currentTarget as Element,
            open: true,
        });
    }
}

export default FileDownload;
