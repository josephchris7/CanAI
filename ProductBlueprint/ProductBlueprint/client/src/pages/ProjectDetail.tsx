import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, FileText, Download, Clock, Users, Pencil, Trash2, Save, Sparkles, RefreshCw } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function ProjectDetail() {
  const [_, setLocation] = useLocation();
  const [match, params] = useRoute("/projects/:id");
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  
  // Fetch project details
  const { data: project, isLoading } = useQuery({
    queryKey: ['/api/projects', params?.id],
    onSuccess: (data) => {
      setEditedDescription(data.description);
    }
  });
  
  // Fetch project documents
  const { data: documents } = useQuery({
    queryKey: ['/api/projects', params?.id, 'documents']
  });
  
  // Update project mutation
  const updateProject = useMutation({
    mutationFn: async ({ description }: { description: string }) => {
      const res = await apiRequest('PATCH', `/api/projects/${params?.id}`, { description });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', params?.id] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update project: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Delete project mutation
  const deleteProject = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', `/api/projects/${params?.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete project: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Export document
  const handleExport = async (documentId: string, format: string) => {
    try {
      const res = await apiRequest('GET', `/api/documents/${documentId}/export?format=${format}`, undefined);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project?.name}-${format}.${format === 'pdf' ? 'pdf' : 'docx'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setExportDialogOpen(false);
      
      toast({
        title: "Export successful",
        description: `Document exported in ${format.toUpperCase()} format`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the document",
        variant: "destructive",
      });
    }
  };
  
  // AI regeneration mutation
  const regenerateWithAI = useMutation({
    mutationFn: async (documentId: string) => {
      const res = await apiRequest('POST', `/api/documents/${documentId}/regenerate-with-ai`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', params?.id, 'documents'] });
      toast({
        title: "AI Generation Complete",
        description: "Document was regenerated with AI successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "AI Generation Failed",
        description: `Failed to regenerate document: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>Project not found</p>
            <Button className="mt-4" onClick={() => setLocation("/")}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          {/* Project header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <Badge variant={
                  project.status === "Active" ? "success" : 
                  project.status === "Planning" ? "secondary" : 
                  "default"
                }>
                  {project.status}
                </Badge>
              </div>
              <p className="text-gray-500 mt-1">{project.type} • {project.industry}</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Project Documents</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {documents && documents.length > 0 ? (
                      documents.map((doc) => (
                        <Card key={doc.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-gray-500" />
                                <span>{doc.name}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => handleExport(doc.id, 'pdf')}
                                >
                                  PDF
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleExport(doc.id, 'docx')}
                                >
                                  DOCX
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">No documents available for export</p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="destructive" 
                onClick={() => deleteProject.mutate()}
                disabled={deleteProject.isPending}
              >
                {deleteProject.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                Delete
              </Button>
            </div>
          </div>
          
          {/* Project content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
              <TabsTrigger value="mvp">MVP</TabsTrigger>
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Project Description</CardTitle>
                      {!isEditing ? (
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => updateProject.mutate({ description: editedDescription })}
                          disabled={updateProject.isPending}
                        >
                          {updateProject.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        rows={6}
                        className="resize-none"
                      />
                    ) : (
                      <p className="text-gray-700">{project.description}</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Created</h4>
                        <p className="flex items-center gap-2 text-gray-700">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Project Type</h4>
                        <p className="text-gray-700">{project.type}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Industry</h4>
                        <p className="text-gray-700">{project.industry}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Team</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">You</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-3">
                  <CardHeader>
                    <CardTitle>Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {documents && documents.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {documents.map((doc) => (
                          <Card key={doc.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start">
                                <div className="flex-shrink-0 w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                                  <FileText className="text-primary" />
                                </div>
                                <div className="ml-4">
                                  <h3 className="font-medium text-gray-900">{doc.name}</h3>
                                  <p className="mt-1 text-sm text-gray-500">{doc.type}</p>
                                  <p className="mt-1 text-xs text-gray-400">Updated {new Date(doc.updatedAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-6">No documents generated yet</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="roadmap">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Product Roadmap</CardTitle>
                    <CardDescription>Strategic development timeline for your product</CardDescription>
                  </div>
                  {documents?.find(d => d.type === "roadmap") && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => regenerateWithAI.mutate(documents.find(d => d.type === "roadmap")!.id)}
                      disabled={regenerateWithAI.isPending}
                    >
                      {regenerateWithAI.isPending ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5 mr-1" />
                          Regenerate with AI
                        </>
                      )}
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {documents?.find(d => d.type === "roadmap") ? (
                    <div className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: documents.find(d => d.type === "roadmap")?.content || "" }} />
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Roadmap Generated Yet</h3>
                      <p className="text-gray-500 mb-4">Generate a product roadmap to visualize your development timeline.</p>
                      <Button className="gap-2">
                        <Sparkles className="h-4 w-4" />
                        Generate with AI
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mvp">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>MVP Blueprint</CardTitle>
                    <CardDescription>Essential features for your minimum viable product</CardDescription>
                  </div>
                  {documents?.find(d => d.type === "mvp") && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => regenerateWithAI.mutate(documents.find(d => d.type === "mvp")!.id)}
                      disabled={regenerateWithAI.isPending}
                    >
                      {regenerateWithAI.isPending ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5 mr-1" />
                          Regenerate with AI
                        </>
                      )}
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {documents?.find(d => d.type === "mvp") ? (
                    <div className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: documents.find(d => d.type === "mvp")?.content || "" }} />
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No MVP Blueprint Generated Yet</h3>
                      <p className="text-gray-500 mb-4">Create an MVP blueprint to outline your minimum viable product features.</p>
                      <Button className="gap-2">
                        <Sparkles className="h-4 w-4" />
                        Generate with AI
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="architecture">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Architecture Design</CardTitle>
                    <CardDescription>Technical structure and components of your application</CardDescription>
                  </div>
                  {documents?.find(d => d.type === "architecture") && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => regenerateWithAI.mutate(documents.find(d => d.type === "architecture")!.id)}
                      disabled={regenerateWithAI.isPending}
                    >
                      {regenerateWithAI.isPending ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5 mr-1" />
                          Regenerate with AI
                        </>
                      )}
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {documents?.find(d => d.type === "architecture") ? (
                    <div className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: documents.find(d => d.type === "architecture")?.content || "" }} />
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Architecture Design Generated Yet</h3>
                      <p className="text-gray-500 mb-4">Create a technical architecture design for your product.</p>
                      <Button className="gap-2">
                        <Sparkles className="h-4 w-4" />
                        Generate with AI
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
