import { IStorage } from "../storage";
import { Project, InsertDocument } from "@shared/schema";
import {
  generateRoadmapTemplate,
  generateMvpTemplate,
  generateArchitectureTemplate,
  generateProjectPlanTemplate
} from "./templates";
import { aiGenerator } from "./ai";

/**
 * Generates a document based on the project and document type
 * @param project The project to generate the document for
 * @param type The type of document to generate (roadmap, mvp, architecture, plan)
 * @param storage Storage implementation to save the generated document
 * @param useAI Whether to use AI for generation (defaults to true)
 * @returns The generated document
 */
export async function generateDocument(
  project: Project,
  type: string,
  storage: IStorage,
  useAI: boolean = true
) {
  let content = "";
  let name = "";
  
  // Set document name based on type
  switch (type) {
    case "roadmap":
      name = `${project.name} - Product Roadmap`;
      break;
    case "mvp":
      name = `${project.name} - MVP Blueprint`;
      break;
    case "architecture":
      name = `${project.name} - Architecture Design`;
      break;
    case "plan":
      name = `${project.name} - Project Plan`;
      break;
    default:
      throw new Error(`Unknown document type: ${type}`);
  }
  
  try {
    // Try to generate content using AI if enabled
    if (useAI && process.env.OPENAI_API_KEY) {
      console.log(`Generating ${type} using AI for project: ${project.name}`);
      
      switch (type) {
        case "roadmap":
          content = await aiGenerator.generateRoadmap(project);
          break;
        case "mvp":
          content = await aiGenerator.generateMvp(project);
          break;
        case "architecture":
          content = await aiGenerator.generateArchitecture(project);
          break;
        case "plan":
          content = await aiGenerator.generateProjectPlan(project);
          break;
      }
    } else {
      // Fallback to template-based generation if AI is disabled or API key is missing
      console.log(`Generating ${type} using templates for project: ${project.name}`);
      
      switch (type) {
        case "roadmap":
          content = generateRoadmapTemplate(project);
          break;
        case "mvp":
          content = generateMvpTemplate(project);
          break;
        case "architecture":
          content = generateArchitectureTemplate(project);
          break;
        case "plan":
          content = generateProjectPlanTemplate(project);
          break;
      }
    }
  } catch (error) {
    console.error(`Error generating ${type} content:`, error);
    
    // Fallback to template-based generation on error
    switch (type) {
      case "roadmap":
        content = generateRoadmapTemplate(project);
        break;
      case "mvp":
        content = generateMvpTemplate(project);
        break;
      case "architecture":
        content = generateArchitectureTemplate(project);
        break;
      case "plan":
        content = generateProjectPlanTemplate(project);
        break;
    }
  }
  
  // Create the document in storage
  const documentData: InsertDocument = {
    projectId: project.id,
    name,
    type,
    content
  };
  
  return await storage.createDocument(documentData);
}
