import * as React from "react";
import RaisedButton from "material-ui/RaisedButton";

export interface FileFieldProps {
    onChange: Function
};

export function FileField(props: FileFieldProps) {
    return (
        <div className="file-field" style={{ margin: "1em" }}>
            <RaisedButton
                containerElement="label"
                label="Add Files"
                fullWidth={true}
                primary={true}
            >
                <input
                    type="file"
                    accept=".smc, .sfc"
                    onChange={(e) => props.onChange(e)}
                    style={{ display: "none" }}
                    multiple
                />
            </RaisedButton>
        </div>
    );
}