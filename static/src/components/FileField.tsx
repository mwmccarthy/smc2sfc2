import * as React from "react";

export interface FileFieldProps {
    onChange: Function
};

export function FileField(props: FileFieldProps) {
    return (
        <input
            className="file-field"
            type="file"
            onChange={(e) => props.onChange(e)}
        />
    );
}