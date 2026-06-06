import React from 'react';

const Table = ({
  columns,
  data,
  renderRow,
  className = '',
  headerClass = 'bg-secondary',
  thClass = 'text-left text-base e text-tableTh font-medium uppercase px-4 py-3',
  tableClass = 'w-full',
}) => {
  return (
    <div className={`overflow-x-auto rounded-lg ${className}`}>
      <table className={tableClass}>
        <thead className={headerClass}>
          <tr>
            {columns.map((column, index) => {
              const header = React.isValidElement(column)
                ? column
                : (typeof column === 'object' && column !== null && 'label' in column)
                  ? column.label
                  : column;

              return (
                <th
                  key={index}
                  className={thClass}
                >
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.map((item, index) => (
            <tr key={index} className="border-b border-gray-100 text-base  text-tableText last:border-b-0">
              {renderRow(item, index)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
