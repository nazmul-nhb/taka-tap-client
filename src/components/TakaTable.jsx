import { useState } from 'react';
import PropTypes from 'prop-types';
import { RiSortAsc, RiSortDesc } from 'react-icons/ri';
import { useReactTable, getCoreRowModel, flexRender, getSortedRowModel, getPaginationRowModel, getFilteredRowModel } from '@tanstack/react-table';
import '../styles/table.css';

const TakaTable = ({ data, columns }) => {
    const [sortUser, setSortUser] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const table = useReactTable({
        data, columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { sorting: sortUser, globalFilter },
        onSortingChange: setSortUser,
        onGlobalFilterChange: setGlobalFilter,
    });

    const handleSearchChange = (e) => {
        setGlobalFilter(e.target.value);
    };

    const buttonClasses = 'px-3 border disabled:cursor-not-allowed disabled:text-gray-300 disabled:border-gray-300 disabled:hover:text-gray-300 disabled:hover:bg-transparent text-takaOrange border-takaOrange hover:bg-takaOrange hover:text-white';

    return (
        <div className='taka-container container overflow-x-auto taka-scrollbar scrollbar-thin mx-auto'>
            <input
                type="text"
                value={globalFilter ?? ''}
                onChange={handleSearchChange}
                placeholder="Search by name, email, or mobile"
                className="search-input mb-4 p-2 border border-white outline-none text-takaOrange focus:outline-white bg-[#ffffff8d] transition-all duration-700 w-full mx-auto block"
            />
            <table className='taka-table table shadow-sm shadow-takaOrange'>
                <thead>
                    {table.getHeaderGroups()?.map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {
                                headerGroup.headers?.map(header => (
                                    <th className='text-white bg-takaOrange text-lg font-semibold' key={header.id} onClick={header.column.getToggleSortingHandler()}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {
                                            { asc: <RiSortAsc className='inline ml-2' />, desc: <RiSortDesc className='inline ml-2' /> }[
                                            header.column.getIsSorted() ?? null
                                            ]
                                        }
                                    </th>
                                ))
                            }
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows?.map(row => (
                        <tr key={row.id}>
                            {
                                row.getVisibleCells()?.map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='flex justify-center items-center gap-4 mt-5 mb-12'>
                <button className={buttonClasses}
                    disabled={!table.getCanPreviousPage()}
                    onClick={() => table.setPageIndex(0)}>First</button>
                <button className={buttonClasses}
                    disabled={!table.getCanPreviousPage()}
                    onClick={() => table.previousPage()}
                >
                    Previous
                </button>
                <button className={buttonClasses}
                    disabled={!table.getCanNextPage()}
                    onClick={() => table.nextPage()}
                >
                    Next
                </button>
                <button className={buttonClasses}
                    disabled={!table.getCanNextPage()}
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
                    Last
                </button>
            </div>
        </div>
    );
};

TakaTable.propTypes = {
    columns: PropTypes.array,
    data: PropTypes.array,
};

export default TakaTable;
