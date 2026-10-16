export function Table({ children }) {
    return (
        <div className="w-full overflow-x-auto border border-line rounded-[7px]">
            <table className="w-full min-w-[800px] border-collapse text-[10px]">
                {children}
            </table>
        </div>
    );
}

export function Th({ children }) {
    return (
        <th className="h-[35px] px-2.5 text-left whitespace-nowrap bg-[#fafbfc] text-[#59657b] font-semibold border-b border-line">
            {children}
        </th>
    );
}

export function Tr({ children }) {
    return <tr className="hover:bg-[#fafbff]">{children}</tr>;
}

export function Td({ className = "", ...props }) {
    return (
        <td
            className={`h-[42px] px-2.5 whitespace-nowrap text-[#465269] border-b border-[#edf0f5] [tr:last-child>&]:border-b-0 ${className}`}
            {...props}
        />
    );
}

export function EmptyRow({ colSpan, message }) {
    return (
        <Tr>
            <Td colSpan={colSpan}>
                <div>{message}</div>
            </Td>
        </Tr>
    );
}

const pageButtonBase = "w-[26px] h-[26px] border rounded-[5px] text-[10px] cursor-pointer";
const pageButton = `${pageButtonBase} border-[#e2e6ed] bg-white text-[#59657a]`;
const selectedPageButton = `${pageButtonBase} border-[#d9e0ff] bg-[#eef2ff] text-[#3155e7]`;

export function TableFooter({ showSummary = true }) {
    return (
        <div className="h-10 flex items-end justify-between pt-2.5 text-[#69758a] text-[10px]">
            {showSummary && (
                <span>
                    {/* PAGINACIÓN */}
                </span>
            )}

            <div className="flex gap-1">
                <button className={pageButton}>‹</button>
                <button className={selectedPageButton}>1</button>
                <button className={pageButton}>›</button>
            </div>
        </div>
    );
}
