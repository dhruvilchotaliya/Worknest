import React, { createContext, useState, useEffect, useMemo } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

interface ThemeContextType {
	isDark: boolean;
	toggleTheme: (event?: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType>({
	isDark: false,
	toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isDark, setIsDark] = useState<boolean>(() => {
		const stored = localStorage.getItem("theme");
		if (stored) return stored === "dark";
		return window.matchMedia("(prefers-color-scheme: dark)").matches;
	});

	useEffect(() => {
		const root = window.document.documentElement;
		if (isDark) {
			root.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			root.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	}, [isDark]);

	const toggleTheme = (event?: React.MouseEvent) => {
		const mainContent = document.getElementById("app-main-content");
		if (!event || !mainContent || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setIsDark((prev) => !prev);
			return;
		}

		const rect = mainContent.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		const width = rect.width;
		const height = rect.height;
		const corners = [
			{ x: 0, y: 0 },
			{ x: width, y: 0 },
			{ x: 0, y: height },
			{ x: width, y: height },
		];
		const maxDistance = corners.reduce((max, corner) => {
			const dist = Math.hypot(corner.x - x, corner.y - y);
			return Math.max(max, dist);
		}, 0);

		const overlay = document.createElement("div");
		overlay.className = "theme-transition-overlay";
		
		const nextDark = !isDark;
		overlay.style.backgroundColor = nextDark ? "#0f172a" : "#f1f5f9";
		overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;
		overlay.style.transition = "clip-path 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)";
		
		mainContent.appendChild(overlay);

		requestAnimationFrame(() => {
			overlay.style.clipPath = `circle(${maxDistance}px at ${x}px ${y}px)`;
		});

		const handleAnimationEnd = () => {
			setIsDark(nextDark);
			setTimeout(() => {
				overlay.remove();
			}, 50);
		};

		overlay.addEventListener("transitionend", handleAnimationEnd, { once: true });
	};

	const muiTheme = useMemo(
		() =>
			createTheme({
				palette: {
					mode: isDark ? "dark" : "light",
					primary: {
						main: "#4f46e5", // Indigo-600
					},
					background: {
						default: isDark ? "#0b0f19" : "#f8fafc",
						paper: isDark ? "#111827" : "#ffffff",
					},
				},
			}),
		[isDark]
	);

	return (
		<ThemeContext.Provider value={{ isDark, toggleTheme }}>
			<MuiThemeProvider theme={muiTheme}>
				<CssBaseline />
				{children}
			</MuiThemeProvider>
		</ThemeContext.Provider>
	);
};

export default ThemeContext;
