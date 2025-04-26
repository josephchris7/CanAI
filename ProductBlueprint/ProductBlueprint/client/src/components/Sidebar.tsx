import { Link, useLocation } from "wouter";
import { 
  Home, 
  FileText, 
  Lightbulb, 
  GitBranch, 
  Map, 
  Settings, 
  HelpCircle,
  Box
} from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: FileText, label: "My Projects", href: "/projects" },
  { icon: Lightbulb, label: "Templates", href: "/templates" },
  { icon: GitBranch, label: "Roadmaps", href: "/roadmaps" },
  { icon: Map, label: "Architecture", href: "/architecture" },
];

const secondaryNavItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help & Support", href: "/help" },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { isOpen } = useSidebar();
  
  return (
    <div 
      className={cn(
        "bg-white border-r border-gray-200 h-full transition-all duration-300 ease-in-out z-30",
        isOpen 
          ? "flex flex-col w-64 md:flex md:flex-col" 
          : "hidden md:flex md:flex-col md:w-64"
      )}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-primary to-accent text-white p-1.5 rounded">
            <Box className="h-4 w-4" />
          </div>
          <span className="font-bold text-xl text-gray-800">ProductCanvas</span>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => (
          <Link 
            key={item.label} 
            href={item.href}
          >
            <a
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg",
                location === item.href
                  ? "bg-blue-50 text-primary"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="ml-3">{item.label}</span>
            </a>
          </Link>
        ))}
        
        <div className="pt-2 pb-2">
          <div className="border-t border-gray-200"></div>
        </div>
        
        {secondaryNavItems.map((item) => (
          <Link 
            key={item.label} 
            href={item.href}
          >
            <a
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg",
                location === item.href
                  ? "bg-blue-50 text-primary"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="ml-3">{item.label}</span>
            </a>
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">U</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">User</p>
            <p className="text-xs text-gray-500">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
