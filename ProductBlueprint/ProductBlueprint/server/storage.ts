import { 
  Project, InsertProject, 
  Document, InsertDocument,
  User, InsertUser,
  Collaborator, InsertCollaborator
} from "@shared/schema";

// Storage interface definition
export interface IStorage {
  // Project operations
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;
  
  // Document operations
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentsByProject(projectId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document>;
  deleteDocument(id: number): Promise<void>;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Collaborator operations
  getProjectCollaborators(projectId: number): Promise<Collaborator[]>;
  addCollaborator(collaborator: InsertCollaborator): Promise<Collaborator>;
  removeCollaborator(projectId: number, userId: number): Promise<void>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private documents: Map<number, Document>;
  private collaborators: Map<number, Collaborator>;
  
  private userId: number;
  private projectId: number;
  private documentId: number;
  private collaboratorId: number;
  
  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.documents = new Map();
    this.collaborators = new Map();
    
    this.userId = 1;
    this.projectId = 1;
    this.documentId = 1;
    this.collaboratorId = 1;
    
    // Add some sample data to have something to display
    this.initializeSampleData();
  }
  
  private initializeSampleData() {
    // Sample project
    const project1: Project = {
      id: this.projectId++,
      name: "E-Commerce Platform",
      description: "Mobile marketplace for handcrafted goods",
      type: "web-application",
      industry: "retail",
      status: "Active",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      needs: {
        roadmap: true,
        mvp: true,
        architecture: true,
        projectPlan: false
      }
    };
    this.projects.set(project1.id, project1);
    
    // Sample documents for the project
    const doc1: Document = {
      id: this.documentId++,
      projectId: project1.id,
      name: "E-Commerce Platform Roadmap",
      type: "roadmap",
      content: `
        <h1>Product Roadmap: E-Commerce Platform</h1>
        <h2>Phase 1: Foundation (Q1)</h2>
        <ul>
          <li>User authentication and profiles</li>
          <li>Product catalog and search</li>
          <li>Basic shopping cart functionality</li>
          <li>Checkout process with payment integration</li>
        </ul>
        <h2>Phase 2: Growth (Q2)</h2>
        <ul>
          <li>Seller dashboard and inventory management</li>
          <li>Reviews and ratings system</li>
          <li>Order tracking and history</li>
          <li>Basic analytics for sellers</li>
        </ul>
        <h2>Phase 3: Expansion (Q3-Q4)</h2>
        <ul>
          <li>Mobile app development</li>
          <li>Social sharing features</li>
          <li>Loyalty program implementation</li>
          <li>Advanced recommendation engine</li>
        </ul>
      `,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    };
    this.documents.set(doc1.id, doc1);
    
    const doc2: Document = {
      id: this.documentId++,
      projectId: project1.id,
      name: "E-Commerce Platform MVP Blueprint",
      type: "mvp",
      content: `
        <h1>MVP Blueprint: E-Commerce Platform</h1>
        <h2>Core Features</h2>
        <ul>
          <li>User registration and login</li>
          <li>Product browsing and search</li>
          <li>Shopping cart</li>
          <li>Secure checkout with credit card processing</li>
          <li>Order confirmation</li>
        </ul>
        <h2>User Personas</h2>
        <ul>
          <li>Buyer: Looking for unique handcrafted products</li>
          <li>Seller: Artisan wanting to sell their handmade goods</li>
        </ul>
        <h2>Success Metrics</h2>
        <ul>
          <li>User registration rate</li>
          <li>Conversion rate</li>
          <li>Average order value</li>
        </ul>
      `,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    };
    this.documents.set(doc2.id, doc2);
    
    const doc3: Document = {
      id: this.documentId++,
      projectId: project1.id,
      name: "E-Commerce Platform Architecture Design",
      type: "architecture",
      content: `
        <h1>Architecture Design: E-Commerce Platform</h1>
        <h2>Frontend</h2>
        <ul>
          <li>React.js for web client</li>
          <li>React Native for mobile apps</li>
          <li>Redux for state management</li>
          <li>Material UI component library</li>
        </ul>
        <h2>Backend</h2>
        <ul>
          <li>Node.js with Express</li>
          <li>PostgreSQL database</li>
          <li>Redis for caching</li>
          <li>REST API with JSON Web Tokens</li>
        </ul>
        <h2>Infrastructure</h2>
        <ul>
          <li>AWS hosting (EC2, RDS, S3)</li>
          <li>Docker containers</li>
          <li>CI/CD with GitHub Actions</li>
          <li>Monitoring with CloudWatch</li>
        </ul>
      `,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    };
    this.documents.set(doc3.id, doc3);
  }
  
  // Project operations
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
  
  async createProject(project: InsertProject): Promise<Project> {
    const id = this.projectId++;
    const now = new Date();
    const newProject: Project = {
      ...project,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.projects.set(id, newProject);
    return newProject;
  }
  
  async updateProject(id: number, projectUpdate: Partial<InsertProject>): Promise<Project> {
    const project = this.projects.get(id);
    if (!project) {
      throw new Error(`Project with ID ${id} not found`);
    }
    
    const updatedProject: Project = {
      ...project,
      ...projectUpdate,
      id,
      updatedAt: new Date()
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
  
  async deleteProject(id: number): Promise<void> {
    // Delete project
    this.projects.delete(id);
    
    // Delete associated documents
    for (const [docId, doc] of this.documents.entries()) {
      if (doc.projectId === id) {
        this.documents.delete(docId);
      }
    }
    
    // Delete associated collaborators
    for (const [collabId, collab] of this.collaborators.entries()) {
      if (collab.projectId === id) {
        this.collaborators.delete(collabId);
      }
    }
  }
  
  // Document operations
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }
  
  async getDocumentsByProject(projectId: number): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter(doc => doc.projectId === projectId);
  }
  
  async createDocument(document: InsertDocument): Promise<Document> {
    const id = this.documentId++;
    const now = new Date();
    const newDocument: Document = {
      ...document,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.documents.set(id, newDocument);
    return newDocument;
  }
  
  async updateDocument(id: number, documentUpdate: Partial<InsertDocument>): Promise<Document> {
    const document = this.documents.get(id);
    if (!document) {
      throw new Error(`Document with ID ${id} not found`);
    }
    
    const updatedDocument: Document = {
      ...document,
      ...documentUpdate,
      id,
      updatedAt: new Date()
    };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }
  
  async deleteDocument(id: number): Promise<void> {
    this.documents.delete(id);
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Collaborator operations
  async getProjectCollaborators(projectId: number): Promise<Collaborator[]> {
    return Array.from(this.collaborators.values())
      .filter(collab => collab.projectId === projectId);
  }
  
  async addCollaborator(collaborator: InsertCollaborator): Promise<Collaborator> {
    const id = this.collaboratorId++;
    const newCollaborator: Collaborator = {
      ...collaborator,
      id
    };
    this.collaborators.set(id, newCollaborator);
    return newCollaborator;
  }
  
  async removeCollaborator(projectId: number, userId: number): Promise<void> {
    for (const [id, collab] of this.collaborators.entries()) {
      if (collab.projectId === projectId && collab.userId === userId) {
        this.collaborators.delete(id);
        break;
      }
    }
  }
}

export const storage = new MemStorage();
