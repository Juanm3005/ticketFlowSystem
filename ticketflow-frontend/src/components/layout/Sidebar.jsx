function SidebarItem({ icon, label, active, onClick }) {
    return (
        <button
            className={`w-full h-[45px] flex items-center gap-3.5 px-3.5 border-none rounded-lg bg-transparent text-[#d4d9e7] text-[14px] text-left cursor-pointer transition-[background,color] hover:bg-white/7 hover:text-white md-down:justify-center md-down:p-0 ${active ? "" : "md-down:text-[0px]"}`}
            onClick={onClick}
        >
            <span className="w-5 text-[19px] text-center md-down:text-[18px]">{icon}</span>
            {label}
        </button>
    );
}

function Sidebar({ items, activeSection, onNavigate, onLogout }) {
    return (
        <aside className="w-[220px] h-screen shrink-0 flex flex-col py-[22px] px-[15px] bg-sidebar text-white md-down:w-[70px] md-down:py-5 md-down:px-2.5 sm-down:hidden">
            <div className="h-[55px] flex items-center gap-2.5 px-1 text-[20px] font-bold md-down:justify-center">
                <div className="w-10 h-10 flex items-center justify-center rounded-[9px] bg-[#2d4bea] text-white text-[13px] font-extrabold shadow-[0_5px_15px_rgba(45,75,234,0.35)] md-down:shrink-0">
                    TF
                </div>

                <span className="md-down:text-[0px]">
                    Ticket<span className="text-[#3860ed]">Flow</span>
                </span>
            </div>

            <nav className="mt-[30px] flex flex-col gap-[7px]">
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
                className="mt-auto h-[45px] flex items-center gap-[13px] px-3.5 border border-white/8 rounded-lg bg-white/2 text-white text-[14px] cursor-pointer hover:bg-white/7 md-down:justify-center md-down:p-0 md-down:text-[0px]"
                onClick={onLogout}
            >
                <span className="md-down:text-[20px]">↪</span>
                Logout
            </button>
        </aside>
    );
}

export default Sidebar;
