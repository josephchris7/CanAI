import { useLocation } from "wouter";
import { Clock, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  status: string;
  documentCount: number;
  updatedAt: string;
  collaborators?: { id: string; name: string; avatar?: string }[];
}

export default function ProjectCard({
  id,
  name,
  description,
  status,
  documentCount,
  updatedAt,
  collaborators = []
}: ProjectCardProps) {
  const [_, setLocation] = useLocation();
  
  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "planning":
        return "secondary";
      case "in progress":
        return "default";
      default:
        return "outline";
    }
  };
  
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };
  
  const handleOpenProject = () => {
    setLocation(`/projects/${id}`);
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all">
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <Badge variant={getBadgeVariant(status)}>
            {status}
          </Badge>
          <div className="text-gray-500">
            <Button variant="ghost" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="19" cy="12" r="1"/>
                <circle cx="5" cy="12" r="1"/>
              </svg>
            </Button>
          </div>
        </div>
        <h3 className="text-md font-semibold mb-1 text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <div className="flex items-center mt-4 text-sm text-gray-500">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-1.5" />
            <span>{documentCount} document{documentCount !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center ml-4">
            <Clock className="h-4 w-4 mr-1.5" />
            <span>Updated {getTimeAgo(updatedAt)}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 flex justify-between">
        <div className="flex -space-x-2">
          {collaborators.length > 0 ? (
            collaborators.map((collaborator, index) => (
              <div 
                key={collaborator.id}
                className={cn(
                  "w-6 h-6 rounded-full border border-white flex items-center justify-center",
                  collaborator.avatar ? "bg-gray-100" : "bg-blue-500 text-white"
                )}
                title={collaborator.name}
              >
                {collaborator.avatar ? (
                  <img 
                    src={collaborator.avatar} 
                    alt={collaborator.name} 
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <span className="text-xs font-medium">
                    {collaborator.name.charAt(0)}
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="w-6 h-6 rounded-full border border-white bg-gray-200 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">U</span>
            </div>
          )}
        </div>
        <Button 
          variant="link" 
          className="text-primary text-sm font-medium hover:text-blue-600 px-0"
          onClick={handleOpenProject}
        >
          Open
        </Button>
      </div>
    </div>
  );
}
