const HEADER_SIZES = {
    md: {
        title: "m-0 text-[#172033] text-[19px] font-bold",
        description: "mt-[5px] mx-0 mb-0 text-[#7b8496] text-[12px]",
    },
    // Tipografía del encabezado de las tarjetas (la usa el modal de Create Ticket)
    sm: {
        title: "m-0 text-[16px] text-[#182136] font-bold",
        description: "mt-1 mx-0 mb-0 text-[11px] text-[#6c7689]",
    },
};

function Modal({ title, description, onClose, maxWidth = "max-w-[480px]", headerSize = "md", children }) {
    const header = HEADER_SIZES[headerSize];

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-5 bg-[rgba(15,23,42,0.45)] backdrop-blur-[3px]">
            <div className={`w-full ${maxWidth} bg-white rounded-[14px] shadow-modal overflow-hidden animate-modal-appear`}>
                <div className="flex items-start justify-between pt-[22px] px-6 pb-[18px] border-b border-[#edf0f5]">
                    <div>
                        <h2 className={header.title}>{title}</h2>
                        <p className={header.description}>{description}</p>
                    </div>

                    <button
                        type="button"
                        className="w-[30px] h-[30px] flex items-center justify-center border-none rounded-md bg-transparent text-[#8b94a6] text-[22px] cursor-pointer transition-all hover:bg-[#f1f3f7] hover:text-[#374151]"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}

export function ModalActions({ className = "mt-[22px]", children }) {
    return (
        <div className={`flex justify-end gap-[9px] pt-[18px] border-t border-[#edf0f5] ${className}`}>
            {children}
        </div>
    );
}

export default Modal;
