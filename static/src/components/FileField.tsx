import FlatButton from "material-ui/FlatButton";
import * as React from "react";

interface IFileFieldProps {
    onChange: Function;
};

function FileField(props: IFileFieldProps) {
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
