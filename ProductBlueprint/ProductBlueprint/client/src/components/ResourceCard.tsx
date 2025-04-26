import { LucideIcon } from "lucide-react";
import { 
  Map, 
  GitBranch, 
  CheckSquare, 
  DollarSign 
} from "lucide-react";

interface ResourceCardProps {
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

export default function ResourceCard({
  title,
  description,
  icon,
  gradient
}: ResourceCardProps) {
  const getIcon = (): LucideIcon => {
    switch (icon) {
      case 'sitemap':
        return Map;
      case 'git-branch':
        return GitBranch;
      case 'check-square':
        return CheckSquare;
      case 'dollar-sign':
        return DollarSign;
      default:
        return Map;
    }
  };
  
  const Icon = getIcon();
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer">
      <div className={`h-36 ${gradient} flex items-center justify-center`}>
        <Icon className="text-white text-3xl" />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}
