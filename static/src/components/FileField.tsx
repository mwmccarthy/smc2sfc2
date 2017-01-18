import * as React from "react";

export interface FileFieldProps {
    onChange: Function
};

export function FileField(props: FileFieldProps) {
    const styles = {
        div: {
            position: "relative"
        },
        file: {
            position: "absolute",
            zIndex: 2,
            opacity: 0,
            width: "100%"
        },
        button: {
            position: "relative",
            width: "100%"
        }
    };
    
    return (
        <div className="file-field">
            <input
                type="file"
                accept=".smc, .sfc"
                onChange={(e) => props.onChange(e)}
                style={styles.file}
                multiple
            />
            <button style={styles.button}>
                Add Files
            </button>
        </div>
    );
}