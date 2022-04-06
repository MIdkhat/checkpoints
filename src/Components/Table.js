
import React from "react";

const Table = ({ data }) => {
    return (
        <>
            <table className="table table-fixed w-full">
                <thead>
                    <tr>
                        <th className='bg-blue-100 border text-left px-8 py-1'>#</th>
                        <th className='bg-blue-100 border text-left px-8 py-1'>Name</th>
                        <th className='bg-blue-100 border text-left px-8 py-1'>Inside</th>
                    </tr>
                </thead>
                <tbody>
                    {data.features.map((f, i) => {
                        return (
                            <tr key={i}>
                                <th className='border text-left px-8 py-1'>{i + 1}</th>
                                <td className='border text-left px-8 py-1'>{f.properties.Name}</td>
                                <td className={`${f.properties.inside ? 'text-green-600' : 'font-bold text-red-600'} border text-left px-8 py-1`}>{f.properties.inside.toString()}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

        </>
    )
};

export default Table;