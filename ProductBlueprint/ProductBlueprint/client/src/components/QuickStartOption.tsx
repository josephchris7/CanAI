import { LucideIcon } from "lucide-react";
import { 
  Lightbulb, 
  Box, 
  Map 
} from "lucide-react";

interface QuickStartOptionProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  iconColor: string;
  onClick?: () => void;
}

export default function QuickStartOption({
  title,
  description,
  icon,
  color,
  iconColor,
  onClick
}: QuickStartOptionProps) {
  const getIcon = (): LucideIcon => {
    switch (icon) {
      case 'lightbulb':
        return Lightbulb;
      case 'cube':
        return Box;
      case 'sitemap':
        return Map;
      default:
        return Lightbulb;
    }
  };
  
  const Icon = getIcon();
  
  return (
    <div 
      className="rounded-lg border border-gray-200 bg-gray-50 p-4 hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className={iconColor} />
        </div>
        <div className="ml-4">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}
