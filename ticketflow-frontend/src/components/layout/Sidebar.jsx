import { LogoutIcon } from "../icons/NavIcons";

function SidebarItem({ icon, label, active, onClick }) {
    return (
        <button
            title={label}
            aria-current={active ? "page" : undefined}
            className={`group relative w-full h-11 flex items-center gap-3 px-3 border-none rounded-[10px] text-[14px] font-inherit text-left cursor-pointer transition-[background,color] md-down:justify-center md-down:px-0 ${
                active
                    ? "bg-[#2d4bea]/20 text-white font-semibold"
                    : "bg-transparent text-[#a9b2c8] hover:bg-white/6 hover:text-white"
            }`}
            onClick={onClick}
        >
            <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full bg-[#4f6bff] transition-[height] ${active ? "h-5" : "h-0"}`}
            />

            <span
                className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-[18px] transition-[background,color] ${
                    active
                        ? "bg-[#2d4bea] text-white shadow-[0_4px_12px_rgba(45,75,234,0.45)]"
                        : "text-[#8e98b3] group-hover:text-white"
                }`}
            >
                {icon}
            </span>

            <span className="truncate md-down:hidden">{label}</span>
        </button>
    );
}

function Sidebar({ items, activeSection, onNavigate, onLogout }) {
    return (
        <aside className="w-[220px] h-screen shrink-0 flex flex-col py-[22px] px-[15px] bg-sidebar text-white md-down:w-[70px] md-down:py-5 md-down:px-2.5 sm-down:hidden">
            <div className="h-[55px] flex items-center gap-2.5 px-1 pb-[22px] mb-[22px] box-content border-b border-white/8 text-[20px] font-bold md-down:justify-center md-down:px-0">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,#3d5cf5,#2440d8)] text-white text-[13px] font-extrabold shadow-[0_5px_15px_rgba(45,75,234,0.35)]">
                    TF
                </div>

                <span className="md-down:hidden">
                    Ticket<span className="text-[#5b7bff]">Flow</span>
                </span>
            </div>

            <p className="m-0 mb-2.5 px-3 text-[10px] font-semibold tracking-[1.2px] uppercase text-[#5f6a85] md-down:hidden">
                Menu
            </p>

            <nav className="flex flex-col gap-1.5">
                {items.map((item) => (
                    <SidebarItem
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        active={activeSection === item.id}
                        onClick={() => onNavigate(item.id)}
                    />
                ))}
            </nav>

            <button
                title="Logout"
                className="group mt-auto h-11 flex items-center gap-3 px-3 border border-white/8 rounded-[10px] bg-white/2 text-[#c5ccdc] text-[14px] font-inherit cursor-pointer transition-[background,color,border-color] hover:bg-[#ef4444]/12 hover:border-[#ef4444]/30 hover:text-[#ff8a8a] md-down:justify-center md-down:px-0"
                onClick={onLogout}
            >
                <span className="w-8 h-8 shrink-0 flex items-center justify-center text-[18px]">
                    <LogoutIcon />
                </span>
                <span className="md-down:hidden">Logout</span>
            </button>
        </aside>
    );
}

export default Sidebar;
