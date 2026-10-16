import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import { useActiveSection, scrollToSection } from "../../hooks/useActiveSection";

function DashboardLayout({ navItems, title, profileName, children }) {
    const navigate = useNavigate();
    const contentRef = useRef(null);
    const activeSection = useActiveSection(contentRef, navItems.map((item) => item.id));

    function handleLogout() {
        localStorage.removeItem("authHeader");
        navigate("/login");
    }

    return (
        <div className="w-full h-screen flex overflow-hidden bg-[#f6f8fc] text-[#172033]">
            <Sidebar
                items={navItems}
                activeSection={activeSection}
                onNavigate={scrollToSection}
                onLogout={handleLogout}
            />

            <main className="flex-1 min-w-0 h-screen overflow-y-auto overflow-x-hidden">
                <DashboardHeader title={title} profileName={profileName} />

                <div ref={contentRef} className="pt-[18px] px-6 pb-[30px] sm-down:p-3">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default DashboardLayout;
