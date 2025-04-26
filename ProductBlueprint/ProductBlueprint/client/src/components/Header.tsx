import { Menu, Bell, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";

export default function Header() {
  const { isOpen, toggle } = useSidebar();
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center lg:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggle} 
            className="text-gray-500 focus:outline-none"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-3 md:hidden">
            <span className="font-bold text-xl text-gray-800">ProductCanvas</span>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-end">
          <Button variant="outline" className="ml-4 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1.5">
            <Crown className="h-4 w-4 text-yellow-500" />
            <span>Upgrade</span>
          </Button>
          
          <Button variant="ghost" size="icon" className="ml-4 text-gray-500">
            <Bell className="h-5 w-5" />
          </Button>
          
          <div className="hidden md:flex items-center ml-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
