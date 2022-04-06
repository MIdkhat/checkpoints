
import React from "react";

const Table = ({ data }) => {
    const cellStyle = 'border text-left text-sm lg:text-xs px-8 lg:px-2 py-1'
    const headerStyle = `bg-blue-100 ${cellStyle}`
    return (
        <>
            <table className="table table-fixed w-full">
                <thead>
                    <tr>
                        <th className={headerStyle}>#</th>
                        <th className={headerStyle}>Name</th>
                        <th className={headerStyle}>Inside</th>
                    </tr>
                </thead>
                <tbody>
                    {data.features.map((f, i) => {
                        return (
                            <tr key={i}>
                                <th className={cellStyle}>{i + 1}</th>
                                <td className={cellStyle}>{f.properties.Name}</td>
                                <td className={`${f.properties.inside ? 'text-green-600' : 'font-bold text-red-600'} ${cellStyle}`}>{f.properties.inside.toString()}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

        </>
    )
};

export default Table;