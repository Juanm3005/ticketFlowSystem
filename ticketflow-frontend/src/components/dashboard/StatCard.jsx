const ICON_COLORS = {
    blue: "bg-[linear-gradient(135deg,#3456ec,#243fd0)]",
    green: "bg-[linear-gradient(135deg,#3bc97d,#1ca862)]",
    orange: "bg-[linear-gradient(135deg,#ffbf37,#f39b00)]",
    cyan: "bg-[linear-gradient(135deg,#4eacf0,#318ed5)]",
    purple: "bg-[linear-gradient(135deg,#8a65e9,#6542cf)]",
};

function StatCard({ icon, color, label, value, showNote = false }) {
    return (
        <div className="min-h-[102px] flex items-center gap-[15px] p-[17px] bg-white border border-line rounded-[11px] shadow-card">
            <div className={`w-[46px] h-[46px] shrink-0 flex items-center justify-center rounded-full text-[21px] text-white ${ICON_COLORS[color]}`}>
                {icon}
            </div>

            <div>
                <p className="m-0 text-[11px] text-[#637087]">{label}</p>
                <h2 className="my-[5px] mx-0 text-[22px] text-[#151e31]">{value !== null ? value : "Loading..."}</h2>
                {showNote && <small className="text-[10px]" />}
            </div>
        </div>
    );
}

export default StatCard;
