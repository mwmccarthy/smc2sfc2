import * as React from "react";
import FlatButton from "material-ui/FlatButton";

interface FileFieldProps {
    onChange: Function
};

function FileField(props: FileFieldProps) {
    return (
        <div className="file-field" style={{ margin: "1rem" }}>
            <FlatButton
                containerElement="label"
                label="Add Files"
                primary={true}
            >
                <input
                    type="file"
                    accept=".smc, .sfc"
                    onChange={(e) => props.onChange(e)}
                    style={{ display: "none" }}
                    multiple
                />
            </FlatButton>
        </div>
    );
}

export default FileField;