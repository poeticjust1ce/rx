"use client";

import * as Pi from "react-icons/pi";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  ArrowLeftRight,
  ArrowRightToLine,
  CalendarCheck,
  Clock,
  Package,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import SignOutButton from "@/components/SignOutButton";
import { motion, AnimatePresence } from "framer-motion";

const ManagerNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    inventory: true,
    team: true,
  });
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setIsOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const navGroups = [
    {
      title: "Dashboard",
      items: [
        {
          title: "Dashboard",
          link: "/manager/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "My Inventory",
      items: [
        {
          title: "My Inventory",
          link: "/manager/inventory",
          icon: Package,
        },
      ],
    },
    {
      title: "Deliveries",
      items: [
        {
          title: "Deliveries",
          link: "/manager/deliveries",
          icon: ClipboardList,
        },
      ],
    },
    {
      title: "Transfers",
      collapsible: true,
      items: [
        {
          title: "My Transfers",
          link: "/manager/transfers/my-transfers",
          icon: ArrowLeftRight,
        },
        {
          title: "Transfer Products",
          link: "/manager/transfers",
          icon: ArrowRightToLine,
        },
        {
          title: "Transfer History",
          link: "/manager/transfers/history",
          icon: Clock,
        },
      ],
    },
    {
      title: "Team",
      collapsible: true,
      items: [
        {
          title: "My Team",
          link: "/manager/team",
          icon: Users,
        },
        {
          title: "Team Attendance",
          link: "/manager/attendance",
          icon: CalendarCheck,
        },
      ],
    },
  ];

  const renderNavItem = (item) => (
    <motion.div
      key={item.title}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => isMobile && setIsOpen(false)}
    >
      <Link
        href={item.link}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
          pathname === item.link
            ? "bg-primary text-primary-foreground font-medium shadow-md"
            : "hover:bg-accent text-accent-foreground"
        )}
      >
        <item.icon size={20} className="flex-shrink-0" />
        <span>{item.title}</span>
      </Link>
    </motion.div>
  );

  const renderCollapsibleSection = (group) => {
    const SectionIcon = group.items[0].icon;

    return (
      <div key={group.title} className="space-y-1">
        <motion.button
          className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-accent transition-all"
          onClick={() => toggleSection(group.title.toLowerCase())}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            <SectionIcon size={20} className="flex-shrink-0" />
            <span>{group.title}</span>
          </div>
          {openSections[group.title.toLowerCase()] ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </motion.button>

        <AnimatePresence>
          {openSections[group.title.toLowerCase()] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pl-7"
            >
              {group.items.map((item) => renderNavItem(item))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden lg:flex lg:flex-col lg:w-64 h-screen fixed left-0 top-0 bg-card border-r shadow-sm z-40"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center justify-center p-6 border-b"
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            PharmaManager
          </h1>
        </motion.div>

        <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
          {navGroups.map((group) =>
            group.collapsible
              ? renderCollapsibleSection(group)
              : group.items.map((item) => renderNavItem(item))
          )}
        </nav>

        <motion.div
          className="p-4 border-t"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between gap-2">
            <SignOutButton className="flex-1" />
          </div>
        </motion.div>
      </motion.aside>

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b shadow-sm z-40"
      >
        <div className="flex items-center justify-between p-4">
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-accent"
            whileTap={{ scale: 0.9 }}
          >
            <Pi.PiList size={24} />
          </motion.button>

          <motion.h1
            className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            PharmaManager
          </motion.h1>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && isMobile && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="absolute left-0 top-0 h-full w-64 bg-card shadow-lg z-50"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  PharmaManager
                </h1>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-accent"
                  whileTap={{ scale: 0.9 }}
                >
                  <Pi.PiX size={20} />
                </motion.button>
              </div>

              <nav className="flex flex-col gap-1 p-4">
                {navGroups.map((group) =>
                  group.collapsible
                    ? renderCollapsibleSection(group)
                    : group.items.map((item) => renderNavItem(item))
                )}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                <SignOutButton className="w-full" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="lg:hidden h-16"></div>
    </>
  );
};

export default ManagerNavbar;
