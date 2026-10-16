function DashboardHeader({ title, profileName }) {
    return (
        <header className="h-[76px] flex items-center justify-between px-7 bg-white border-b border-line sm-down:px-[15px]">
            <div>
                <h1 className="m-0 text-[19px] font-bold text-[#131c30]">{title}</h1>
                <p className="mt-[5px] mx-0 mb-0 text-[13px] text-[#6f788b]">
                    Here's what's happening with your system today.
                </p>
            </div>

            <div className="flex items-center gap-[22px]">
                <div className="flex items-center gap-2.5 cursor-pointer">
                    <div className="flex flex-col gap-0.5 sm-down:hidden">
                        <strong className="text-[12px]">{profileName}</strong>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default DashboardHeader;
