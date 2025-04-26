import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import ResourceCard from "@/components/ResourceCard";
import QuickStartOption from "@/components/QuickStartOption";
import NewProjectModal from "@/components/NewProjectModal";
import { useSidebar } from "@/hooks/use-sidebar";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Plus, Sparkles, X } from "lucide-react";

// Resource template definitions
const resourceTemplates = [
  { 
    id: "architecture",
    title: "System Architecture", 
    description: "Technical infrastructure design templates",
    icon: "sitemap",
    gradient: "bg-gradient-primary"
  },
  { 
    id: "roadmap",
    title: "Product Roadmap", 
    description: "Strategic feature planning templates",
    icon: "git-branch",
    gradient: "bg-gradient-secondary"
  },
  { 
    id: "mvp",
    title: "MVP Blueprint", 
    description: "Minimal viable product frameworks",
    icon: "check-square",
    gradient: "bg-gradient-success"
  },
  { 
    id: "business",
    title: "Business Model", 
    description: "Revenue and monetization strategy templates",
    icon: "dollar-sign",
    gradient: "bg-gradient-warning"
  }
];

// Quick start options
const quickStartOptions = [
  {
    id: "idea",
    title: "Product Idea Template",
    description: "Define your product concept and vision",
    icon: "lightbulb",
    color: "bg-primary bg-opacity-10",
    iconColor: "text-primary"
  },
  {
    id: "mvp",
    title: "MVP Blueprint",
    description: "Outline your minimum viable product",
    icon: "cube",
    color: "bg-secondary bg-opacity-10",
    iconColor: "text-secondary"
  },
  {
    id: "architecture",
    title: "Architecture Design",
    description: "Create a technical architecture plan",
    icon: "sitemap",
    color: "bg-accent bg-opacity-10",
    iconColor: "text-accent"
  }
];

export default function Dashboard() {
  const { isOpen } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAIBanner, setShowAIBanner] = useState(true);
  
  // Fetch projects from the server
  const { data: projects, isLoading } = useQuery({
    queryKey: ['/api/projects']
  });
  
  // Check for OpenAI API key
  const [hasOpenAIKey, setHasOpenAIKey] = useState(false);
  
  useEffect(() => {
    // This is a simple check - in a real app, you'd want to verify the key is valid
    const checkForApiKey = async () => {
      try {
        const response = await fetch('/api/check-openai-key');
        const data = await response.json();
        setHasOpenAIKey(data.hasKey);
      } catch (error) {
        console.error("Failed to check OpenAI key:", error);
        setHasOpenAIKey(false);
      }
    };
    
    checkForApiKey();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          {/* AI Feature Banner */}
          {showAIBanner && (
            <Alert className="mb-6 border-2 border-[#9abf80] bg-[#9abf80]/10">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-[#9abf80] mt-0.5" />
                  <div>
                    <AlertTitle className="text-[#1c325b] font-medium mb-1">
                      AI-Powered Document Generation
                    </AlertTitle>
                    <AlertDescription className="text-gray-700">
                      ProductCanvas now uses AI to create more intelligent and customized planning documents. 
                      {!hasOpenAIKey && " Add your OpenAI API key in settings to enable AI-powered features."}
                    </AlertDescription>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0 rounded-full"
                  onClick={() => setShowAIBanner(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Alert>
          )}
          
          {/* Welcome section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
            <p className="mt-1 text-gray-600">Let's build your product roadmap today.</p>
          </div>
          
          {/* Quick start section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Create New Project</h2>
                <p className="text-gray-600 mt-1">Start planning your product idea in minutes</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Project
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickStartOptions.map((option) => (
                <QuickStartOption 
                  key={option.id}
                  title={option.title}
                  description={option.description}
                  icon={option.icon}
                  color={option.color}
                  iconColor={option.iconColor}
                  onClick={() => setIsModalOpen(true)}
                />
              ))}
            </div>
          </div>
          
          {/* Recent Projects */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
              <a href="#" className="text-sm font-medium text-primary hover:text-blue-600">View all</a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                // Show skeleton loaders while loading
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                    <div className="flex items-center mt-4">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mr-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))
              ) : (
                projects?.map((project) => (
                  <ProjectCard 
                    key={project.id}
                    id={project.id}
                    name={project.name}
                    description={project.description}
                    status={project.status}
                    documentCount={project.documentCount}
                    updatedAt={project.updatedAt}
                    collaborators={project.collaborators}
                  />
                )) || (
                  <div className="col-span-3 text-center p-8 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-500">No projects found. Create your first project to get started!</p>
                  </div>
                )
              )}
            </div>
          </div>
          
          {/* Resources & Templates */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Resources & Templates</h2>
              <a href="#" className="text-sm font-medium text-primary hover:text-blue-600">Browse library</a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {resourceTemplates.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  title={resource.title}
                  description={resource.description}
                  icon={resource.icon}
                  gradient={resource.gradient}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
      
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
