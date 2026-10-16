import { useEffect, useState } from "react";

/*
 * Detecta automáticamente qué sección está visible
 * mientras el usuario hace scroll dentro de `containerRef`.
 */
export function useActiveSection(containerRef, sections) {
    const [activeSection, setActiveSection] = useState("dashboard");

    useEffect(() => {
        const container = containerRef.current;

        if (!container) return;

        function handleScroll() {
            const scrollTop = container.scrollTop;

            let currentSection = "dashboard";

            sections.forEach((id) => {
                const section = document.getElementById(id);

                if (!section) return;

                const sectionTop = section.offsetTop;

                if (scrollTop >= sectionTop - 150) {
                    currentSection = id;
                }
            });

            setActiveSection(currentSection);
        }

        container.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return activeSection;
}

export function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (section) {
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}
