import React from "react";

const LayerControl = ({ label, checked, onChange }) => {
    return <div className="py-1 pl-1">
        <label className="inline-flex items-center">
            <input
                className="form-checkbox text-indigo-600"
                type="checkbox"
                checked={checked}
                onChange={onChange}
            />
            <span className="ml-2">{` ${label}`}</span>
        </label>
    </div>;
};

export default LayerControl;

