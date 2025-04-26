import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { ZodError } from "zod";
import { generateDocument } from "./utils/generator";
import { aiGenerator } from "./utils/ai";
import { insertProjectSchema, insertDocumentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generic error handler for Zod validation errors
  const handleZodError = (error: ZodError) => {
    return {
      error: "Validation error",
      details: error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }))
    };
  };

  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      
      // For each project, count documents and add them to the response
      const projectsWithCounts = await Promise.all(projects.map(async (project) => {
        const documents = await storage.getDocumentsByProject(project.id);
        return {
          ...project,
          documentCount: documents.length
        };
      }));
      
      res.json(projectsWithCounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Get project by ID
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid project ID" });
      }
      
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // Create new project
  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      
      // Generate documents based on user selections
      const needs = validatedData.needs as any;
      if (needs) {
        if (needs.roadmap) {
          await generateDocument(project, "roadmap", storage);
        }
        if (needs.mvp) {
          await generateDocument(project, "mvp", storage);
        }
        if (needs.architecture) {
          await generateDocument(project, "architecture", storage);
        }
        if (needs.projectPlan) {
          await generateDocument(project, "plan", storage);
        }
      }
      
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(handleZodError(error));
      }
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  // Update project
  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid project ID" });
      }
      
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      // Allow partial updates
      const updateSchema = insertProjectSchema.partial();
      const validatedData = updateSchema.parse(req.body);
      
      const updatedProject = await storage.updateProject(id, validatedData);
      res.json(updatedProject);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(handleZodError(error));
      }
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  // Delete project
  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid project ID" });
      }
      
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      await storage.deleteProject(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Get documents by project ID
  app.get("/api/projects/:id/documents", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      if (isNaN(projectId)) {
        return res.status(400).json({ error: "Invalid project ID" });
      }
      
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      const documents = await storage.getDocumentsByProject(projectId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  // Create document for project
  app.post("/api/projects/:id/documents", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      if (isNaN(projectId)) {
        return res.status(400).json({ error: "Invalid project ID" });
      }
      
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      const validatedData = insertDocumentSchema.parse({
        ...req.body,
        projectId
      });
      
      const document = await storage.createDocument(validatedData);
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(handleZodError(error));
      }
      res.status(500).json({ error: "Failed to create document" });
    }
  });

  // Get document by ID
  app.get("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid document ID" });
      }
      
      const document = await storage.getDocument(id);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch document" });
    }
  });

  // Export document (PDF or DOCX)
  app.get("/api/documents/:id/export", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid document ID" });
      }
      
      const format = req.query.format as string || 'pdf';
      if (!['pdf', 'docx'].includes(format)) {
        return res.status(400).json({ error: "Invalid format. Must be 'pdf' or 'docx'" });
      }
      
      const document = await storage.getDocument(id);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      
      // In a real implementation, we would convert the document content to the requested format
      // For this prototype, we'll just return the raw HTML content
      res.setHeader('Content-Type', format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${document.name}.${format}"`);
      
      // Return plain text for simplicity
      res.send(document.content);
    } catch (error) {
      res.status(500).json({ error: "Failed to export document" });
    }
  });
  
  // Check if OpenAI API key is available
  app.get("/api/check-openai-key", async (req, res) => {
    try {
      const hasKey = !!process.env.OPENAI_API_KEY;
      res.json({ hasKey });
    } catch (error) {
      res.status(500).json({ error: "Failed to check OpenAI API key" });
    }
  });

  // Regenerate document using AI
  app.post("/api/documents/:id/regenerate-with-ai", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid document ID" });
      }
      
      // Get the existing document
      const document = await storage.getDocument(id);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      
      // Get the project for this document
      const project = await storage.getProject(document.projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY) {
        return res.status(400).json({ 
          error: "OpenAI API key is required",
          message: "Please set the OPENAI_API_KEY environment variable to use AI-powered generation."
        });
      }
      
      // Generate new content based on document type
      let newContent = "";
      
      switch (document.type) {
        case "roadmap":
          newContent = await aiGenerator.generateRoadmap(project);
          break;
        case "mvp":
          newContent = await aiGenerator.generateMvp(project);
          break;
        case "architecture":
          newContent = await aiGenerator.generateArchitecture(project);
          break;
        case "plan":
          newContent = await aiGenerator.generateProjectPlan(project);
          break;
        default:
          return res.status(400).json({ error: "Unsupported document type" });
      }
      
      // Update the document with new AI-generated content
      const updatedDocument = await storage.updateDocument(id, { content: newContent });
      
      res.json(updatedDocument);
    } catch (error) {
      console.error("Error regenerating document with AI:", error);
      res.status(500).json({ error: "Failed to regenerate document using AI" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
