import OpenAI from "openai";
import { Project } from "@shared/schema";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * AI-powered document generation service
 */
export class AIGenerator {
  /**
   * Generate a product roadmap using AI
   * @param project The project to generate a roadmap for
   * @returns The generated roadmap content
   */
  async generateRoadmap(project: Project): Promise<string> {
    const prompt = this.createRoadmapPrompt(project);
    const content = await this.generateContent(prompt);
    return content;
  }

  /**
   * Generate an MVP blueprint using AI
   * @param project The project to generate an MVP blueprint for
   * @returns The generated MVP blueprint content
   */
  async generateMvp(project: Project): Promise<string> {
    const prompt = this.createMvpPrompt(project);
    const content = await this.generateContent(prompt);
    return content;
  }

  /**
   * Generate an architecture design using AI
   * @param project The project to generate an architecture design for
   * @returns The generated architecture design content
   */
  async generateArchitecture(project: Project): Promise<string> {
    const prompt = this.createArchitecturePrompt(project);
    const content = await this.generateContent(prompt);
    return content;
  }

  /**
   * Generate a project plan using AI
   * @param project The project to generate a project plan for
   * @returns The generated project plan content
   */
  async generateProjectPlan(project: Project): Promise<string> {
    const prompt = this.createProjectPlanPrompt(project);
    const content = await this.generateContent(prompt);
    return content;
  }

  /**
   * Generate AI content based on a prompt
   * @param prompt The prompt to send to the OpenAI API
   * @returns The generated content
   */
  private async generateContent(prompt: string): Promise<string> {
    try {
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert product manager and technical architect with extensive experience in software development. Your task is to create detailed, well-structured product documentation in HTML format using the color palette of #e5e3d4 (cream/beige), #9abf80 (mint green), #6a669d (lavender), and #1c325b (navy blue) when possible. Add CSS classes to make the content visually appealing."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2500,
      });

      return response.choices[0].message.content || "";
    } catch (error) {
      console.error("Error generating AI content:", error);
      return this.getFallbackContent("Failed to generate content using AI. Please try again later.");
    }
  }

  /**
   * Create a roadmap prompt based on project details
   */
  private createRoadmapPrompt(project: Project): string {
    return `
    Generate a detailed product roadmap for a ${project.type} in the ${project.industry || "general"} industry.
    The product name is "${project.name}" and it is described as: "${project.description || "No description provided"}".
    
    The roadmap should include:
    1. A high-level product vision
    2. Phased development timeline (MVP, v1, v2, future)
    3. Key milestones for each phase
    4. Features and capabilities for each phase
    5. Market and user value for each phase
    6. Success metrics for each phase
    
    Format the response as HTML that can be directly inserted into a web page. Use h1, h2, h3 tags for titles, p tags for paragraphs, 
    ul and li for lists, and other appropriate HTML elements. Use the color palette: #e5e3d4 (cream/beige), #9abf80 (mint green), 
    #6a669d (lavender), and #1c325b (navy blue) throughout the document with CSS classes or inline styles.
    Make it visually structured and professional.
    `;
  }

  /**
   * Create an MVP prompt based on project details
   */
  private createMvpPrompt(project: Project): string {
    return `
    Generate a detailed MVP blueprint for a ${project.type} in the ${project.industry || "general"} industry.
    The product name is "${project.name}" and it is described as: "${project.description || "No description provided"}".
    
    The MVP blueprint should include:
    1. Core problem and solution definition
    2. Target user personas (with detailed descriptions)
    3. Essential features for the MVP (with clear justification)
    4. Features excluded from MVP (with rationale)
    5. User journey through the MVP
    6. Success criteria and KPIs
    7. Timeline estimation
    
    Format the response as HTML that can be directly inserted into a web page. Use h1, h2, h3 tags for titles, p tags for paragraphs, 
    ul and li for lists, and other appropriate HTML elements. Use the color palette: #e5e3d4 (cream/beige), #9abf80 (mint green), 
    #6a669d (lavender), and #1c325b (navy blue) throughout the document with CSS classes or inline styles.
    Make it visually structured and professional.
    `;
  }

  /**
   * Create an architecture prompt based on project details
   */
  private createArchitecturePrompt(project: Project): string {
    return `
    Generate a detailed technical architecture design for a ${project.type} in the ${project.industry || "general"} industry.
    The product name is "${project.name}" and it is described as: "${project.description || "No description provided"}".
    
    The architecture design should include:
    1. High-level architecture overview (with recommended patterns)
    2. Frontend architecture (technologies, frameworks, state management)
    3. Backend architecture (API design, business logic, services)
    4. Data model and database recommendations
    5. Security considerations
    6. Scalability and performance considerations
    7. Third-party integrations
    8. Deployment and infrastructure recommendations
    
    Format the response as HTML that can be directly inserted into a web page. Use h1, h2, h3 tags for titles, p tags for paragraphs, 
    ul and li for lists, and other appropriate HTML elements. Use the color palette: #e5e3d4 (cream/beige), #9abf80 (mint green), 
    #6a669d (lavender), and #1c325b (navy blue) throughout the document with CSS classes or inline styles.
    Make it visually structured and professional.
    `;
  }

  /**
   * Create a project plan prompt based on project details
   */
  private createProjectPlanPrompt(project: Project): string {
    return `
    Generate a detailed project plan for developing a ${project.type} in the ${project.industry || "general"} industry.
    The product name is "${project.name}" and it is described as: "${project.description || "No description provided"}".
    
    The project plan should include:
    1. Project scope and objectives
    2. Team composition and roles
    3. Detailed project phases (discovery, design, development, testing, deployment)
    4. Timeline with milestones
    5. Risk assessment and mitigation strategies
    6. Resource planning
    7. Quality assurance approach
    8. Communication and reporting plan
    
    Format the response as HTML that can be directly inserted into a web page. Use h1, h2, h3 tags for titles, p tags for paragraphs, 
    ul and li for lists, and other appropriate HTML elements. Use the color palette: #e5e3d4 (cream/beige), #9abf80 (mint green), 
    #6a669d (lavender), and #1c325b (navy blue) throughout the document with CSS classes or inline styles.
    Make it visually structured and professional.
    `;
  }

  /**
   * Get fallback content if AI generation fails
   */
  private getFallbackContent(message: string): string {
    return `
    <div class="ai-error-message">
      <h2>AI Generation Error</h2>
      <p>${message}</p>
      <p>Please try again later or contact support if the problem persists.</p>
    </div>
    `;
  }
}

export const aiGenerator = new AIGenerator();