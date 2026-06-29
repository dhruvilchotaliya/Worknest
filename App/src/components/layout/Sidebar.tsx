import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { Tooltip } from "@mui/material";
import Icon from "../common/display/Icon";
import Typography from "../common/display/Typography";
import { primaryNavItems, bottomNavItems } from "../../config/navConfig";
import type { NavItem } from "../../types/nav";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SIDEBAR_EXPANDED_WIDTH = 220;
const SIDEBAR_COLLAPSED_WIDTH = 64;
const LOCAL_STORAGE_KEY = "worknest_sidebar_collapsed";

// ---------------------------------------------------------------------------
// SidebarNavItem
// ---------------------------------------------------------------------------

interface SidebarNavItemProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

const SidebarNavItem = ({
  item,
  isActive,
  isCollapsed,
  onClick,
}: SidebarNavItemProps) => {
  const button = (
    <button
      id={`sidebar-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
      onClick={onClick}
      className={[
        "flex items-center gap-2.5 w-full rounded-lg px-2.5 py-1.5",
        "cursor-pointer transition-colors duration-150 group",
        "border border-transparent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        isActive
          ? "bg-indigo-600 text-white shadow-sm"
          : "text-slate-400 hover:bg-slate-800/60 hover:text-white",
        isCollapsed ? "justify-center" : "",
      ].join(" ")}
    >
      {/* Icon */}
      <span className="flex-shrink-0">
        <Icon
          icon={item.icon}
          size="small"
          className={
            isActive ? "text-white" : "text-slate-400 group-hover:text-white"
          }
        />
      </span>

      {/* Label */}
      {!isCollapsed && (
        <Typography
          component="body2"sidebar-collapse-toggle
          testId={`sidebar-nav-label-${item.label}`}
          className={[
            "font-medium text-[13px] whitespace-nowrap overflow-hidden transition-colors duration-150",
            isActive
              ? "text-white"
              : "text-slate-300 group-hovsidebar-collapse-toggleer:text-white",
          ].join(" ")}
        >
          {item.label}
        </Typography>
      )}
    </button>
  );

  if (isCollapsed) {
    return (
      <Tooltip title={item.label} placement="right" arrow>
        {button}
      </Tooltip>
    );
  }

  return button;
};

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const handleNavClick = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate],
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      id="app-sidebar"
      aria-label="Primary navigation"
      style={{
        width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
        minWidth: isCollapsed
          ? SIDEBAR_COLLAPSED_WIDTH
          : SIDEBAR_EXPANDED_WIDTH,
      }}
      className={[
        "flex flex-col h-screen group",
        "bg-slate-900 border-r border-slate-800/80",
        "transition-[width,min-width] duration-300 ease-in-out",
        "overflow-visible",
        "relative z-40 shadow-md select-none",
      ].join(" ")}
    >
      {/* Floating Collapse / Expand Toggle Button on the right border edge */}
      <button
        id="sidebar-collapse-toggle"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={toggleCollapsed}
        className={[
          "absolute right-0 translate-x-1/2 z-50 top-[1.2rem]",
          "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
          "pointer-events-none group-hover:pointer-events-auto focus-visible:pointer-events-auto",
          "flex h-5 w-5 items-center justify-center rounded-full",
          "bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-md cursor-pointer",
          "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white",
          "hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:scale-110 active:scale-95 transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        ].join(" ")}
      >
        {isCollapsed ? (
          <Icon
            icon="ChevronRight"
            size="small"
            className="!w-3 h-3"
          />
        ) : (
          <Icon
            icon="ChevronLeft"
            size="small"
            className="!w-3 h-3"
          />
        )}
      </button>

      {/* Brand/Logo Header inside Sidebar */}
      <div className="flex h-14 items-center px-4 border-b border-slate-800/60 flex-shrink-0">
        {isCollapsed ? (
          <div className="flex h-8 w-8 mx-auto items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
            <span className="text-[13px] font-black text-white leading-none">
              W
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
              <span className="text-[13px] font-black text-white leading-none">
                W
              </span>
            </div>
            <Typography
              component="h6"
              testId="sidebar-brand-name"
              className="font-bold text-white tracking-tight text-base leading-none"
            >
              WorkNest
            </Typography>
          </div>
        )}
      </div>

      {/* Primary nav items */}
      <nav className="flex flex-col gap-1 p-2 pt-3 flex-shrink-0">
        {primaryNavItems.map((item) => (
          <SidebarNavItem
            key={item.path}
            item={item}
            isActive={isActive(item.path)}
            isCollapsed={isCollapsed}
            onClick={() => handleNavClick(item.path)}
          />
        ))}
      </nav>

      {/* Spacer to push settings & collapse to the bottom */}
      <div className="flex-1" />

      {/* Bottom nav items */}
      <div className="flex flex-col gap-1 p-2 border-t border-slate-800/60 flex-shrink-0">
        {bottomNavItems.map((item) => (
          <SidebarNavItem
            key={item.path}
            item={item}
            isActive={isActive(item.path)}
            isCollapsed={isCollapsed}
            onClick={() => handleNavClick(item.path)}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
