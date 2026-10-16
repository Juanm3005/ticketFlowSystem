const cardBase = "bg-white border border-line rounded-[11px] shadow-card";

export function Card({ children }) {
    return <div className={`${cardBase} p-[18px] sm-down:p-[13px]`}>{children}</div>;
}

export function SideCard({ title, children }) {
    return (
        <div className={`${cardBase} p-[17px]`}>
            <h2 className="mt-0 mx-0 mb-[18px] text-[14px] text-[#1a2337]">{title}</h2>
            {children}
        </div>
    );
}

export function CardHeader({ title, description, children }) {
    return (
        <div className="flex items-center justify-between mb-4 sm-down:items-start sm-down:gap-2.5">
            <div>
                <h2 className="m-0 text-[16px] text-[#182136]">{title}</h2>
                <p className="mt-1 mx-0 mb-0 text-[11px] text-[#6c7689]">{description}</p>
            </div>
            {children}
        </div>
    );
}

// Usa los estilos por defecto del navegador para h2/p (igual que el diseño original)
export function SectionTitle({ title, description }) {
    return (
        <div>
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    );
}
