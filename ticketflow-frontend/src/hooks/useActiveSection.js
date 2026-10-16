import { useEffect, useState } from "react";

/*
 * Detecta automáticamente qué sección está visible
 * mientras el usuario hace scroll dentro de `containerRef`
 * (el elemento que realmente tiene el scroll).
 */
export function useActiveSection(containerRef, sections) {
    const [activeSection, setActiveSection] = useState(sections[0]);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) return;

        function handleScroll() {
            const scrollTop = container.scrollTop;
            const containerTop = container.getBoundingClientRect().top;
            const atBottom = scrollTop + container.clientHeight >= container.scrollHeight - 2;

            let currentSection = sections[0];

            sections.forEach((id) => {
                const section = document.getElementById(id);

                if (!section) return;

                // Posición de la sección dentro del contenido scrolleable
                const sectionTop = section.getBoundingClientRect().top - containerTop + scrollTop;

                if (scrollTop >= sectionTop - 150) {
                    currentSection = id;
                }
            });

            // Las últimas secciones pueden ser cortas y no llegar al umbral
            if (atBottom) currentSection = sections[sections.length - 1];

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
