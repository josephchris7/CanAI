import { Project } from "@shared/schema";

// Template generation functions for each document type

export function generateRoadmapTemplate(project: Project): string {
  return `
    <h1>Product Roadmap: ${project.name}</h1>
    
    <h2>Phase 1: MVP Development (Months 1-3)</h2>
    <p>Focus on building and launching the core functionality needed to validate the product idea.</p>
    <ul>
      <li>Define user personas and journeys</li>
      <li>Implement core user authentication</li>
      <li>Develop minimal feature set</li>
      <li>Setup basic analytics</li>
      <li>Perform usability testing</li>
      <li>Launch MVP to early adopters</li>
    </ul>
    
    <h2>Phase 2: Iteration and Refinement (Months 4-6)</h2>
    <p>Collect feedback and refine the product based on real user data.</p>
    <ul>
      <li>Analyze user behavior patterns</li>
      <li>Implement high-priority feature requests</li>
      <li>Optimize performance metrics</li>
      <li>Improve UI/UX based on feedback</li>
      <li>Add secondary features</li>
      <li>Scale infrastructure as needed</li>
    </ul>
    
    <h2>Phase 3: Growth (Months 7-12)</h2>
    <p>Focus on user acquisition and retention.</p>
    <ul>
      <li>Implement advanced features</li>
      <li>Enhance integration capabilities</li>
      <li>Optimize onboarding process</li>
      <li>Develop marketing and growth strategies</li>
      <li>Implement premium features/pricing tiers</li>
      <li>Expand platform reach</li>
    </ul>
    
    <h2>Future Considerations</h2>
    <p>Long-term vision for the product.</p>
    <ul>
      <li>Mobile application development</li>
      <li>Expanded API access for developers</li>
      <li>International market adaptation</li>
      <li>AI and machine learning integration</li>
      <li>Advanced analytics and reporting</li>
    </ul>
    
    <h2>Success Metrics</h2>
    <p>Key performance indicators to track progress.</p>
    <ul>
      <li>User acquisition rate</li>
      <li>User retention rate</li>
      <li>Feature adoption metrics</li>
      <li>User satisfaction scores</li>
      <li>Revenue or conversion metrics (if applicable)</li>
    </ul>
  `;
}

export function generateMvpTemplate(project: Project): string {
  const industryFeatures = getIndustrySpecificFeatures(project.industry || 'other', project.type);
  
  return `
    <h1>MVP Blueprint: ${project.name}</h1>
    
    <h2>Project Overview</h2>
    <p>${project.description || 'A minimum viable product to validate core assumptions and provide value to early users.'}</p>
    
    <h2>Target Audience</h2>
    <p>Define the primary users who will benefit from your ${project.type}:</p>
    <ul>
      <li>Primary user persona (age, demographics, needs)</li>
      <li>Secondary user segments</li>
      <li>Key user pain points addressed</li>
    </ul>
    
    <h2>Core Features</h2>
    <p>Essential functionality that must be included in the MVP:</p>
    <ul>
      <li>User authentication and profiles</li>
      <li>Core functionality addressing main user need</li>
      <li>Basic feedback mechanism</li>
      ${industryFeatures.map(feature => `<li>${feature}</li>`).join('\n')}
    </ul>
    
    <h2>Non-Essential Features (Future Releases)</h2>
    <p>Features that can be deferred to post-MVP releases:</p>
    <ul>
      <li>Advanced reporting</li>
      <li>Social sharing capabilities</li>
      <li>Third-party integrations</li>
      <li>Extended customization options</li>
    </ul>
    
    <h2>Success Criteria</h2>
    <p>How will you determine if the MVP is successful?</p>
    <ul>
      <li>Minimum user acquisition target</li>
      <li>Retention rate threshold</li>
      <li>Engagement metrics</li>
      <li>Qualitative feedback goals</li>
    </ul>
    
    <h2>Timeline</h2>
    <p>Estimated development schedule:</p>
    <ul>
      <li>Week 1-2: Design and planning</li>
      <li>Week 3-6: Core functionality development</li>
      <li>Week 7-8: Testing and refinement</li>
      <li>Week 9: Launch preparation</li>
      <li>Week 10: MVP release</li>
    </ul>
  `;
}

export function generateArchitectureTemplate(project: Project): string {
  const techStack = getRecommendedTechStack(project.type);
  
  return `
    <h1>Architecture Design: ${project.name}</h1>
    
    <h2>System Overview</h2>
    <p>High-level architecture for the ${project.type} platform.</p>
    
    <h2>Frontend Architecture</h2>
    <ul>
      <li><strong>Framework:</strong> ${techStack.frontend.framework}</li>
      <li><strong>State Management:</strong> ${techStack.frontend.stateManagement}</li>
      <li><strong>UI Components:</strong> ${techStack.frontend.ui}</li>
      <li><strong>Responsive Design:</strong> Supports desktop, tablet, and mobile views</li>
    </ul>
    
    <h2>Backend Architecture</h2>
    <ul>
      <li><strong>Server:</strong> ${techStack.backend.server}</li>
      <li><strong>API Design:</strong> ${techStack.backend.api}</li>
      <li><strong>Authentication:</strong> ${techStack.backend.auth}</li>
      <li><strong>Database:</strong> ${techStack.backend.database}</li>
    </ul>
    
    <h2>Infrastructure</h2>
    <ul>
      <li><strong>Hosting:</strong> ${techStack.infrastructure.hosting}</li>
      <li><strong>CI/CD:</strong> ${techStack.infrastructure.cicd}</li>
      <li><strong>Monitoring:</strong> ${techStack.infrastructure.monitoring}</li>
      <li><strong>Security:</strong> ${techStack.infrastructure.security}</li>
    </ul>
    
    <h2>Data Flow</h2>
    <p>Description of how data flows through the system:</p>
    <ol>
      <li>User interacts with frontend interface</li>
      <li>Frontend sends requests to backend API</li>
      <li>API processes request, performs validation</li>
      <li>Database operations are performed</li>
      <li>Response is returned to frontend</li>
      <li>UI updates based on response</li>
    </ol>
    
    <h2>Scalability Considerations</h2>
    <ul>
      <li>Horizontal scaling for increased load</li>
      <li>Caching strategy for performance optimization</li>
      <li>Database indexing and optimization</li>
      <li>Potential microservices breakdown for future scaling</li>
    </ul>
    
    <h2>Third-party Services</h2>
    <ul>
      <li><strong>Analytics:</strong> Google Analytics / Mixpanel</li>
      <li><strong>Email:</strong> SendGrid / Mailchimp</li>
      <li><strong>Payment Processing:</strong> Stripe / PayPal</li>
      <li><strong>Storage:</strong> AWS S3 / Google Cloud Storage</li>
    </ul>
  `;
}

export function generateProjectPlanTemplate(project: Project): string {
  return `
    <h1>Project Plan: ${project.name}</h1>
    
    <h2>Project Overview</h2>
    <p>${project.description || 'A comprehensive plan for developing and launching the product.'}</p>
    
    <h2>Project Timeline</h2>
    <h3>Phase 1: Discovery and Planning (2 weeks)</h3>
    <ul>
      <li>Stakeholder interviews</li>
      <li>Requirements gathering</li>
      <li>User research</li>
      <li>Technical specification</li>
      <li>Project plan finalization</li>
    </ul>
    
    <h3>Phase 2: Design (3 weeks)</h3>
    <ul>
      <li>Wireframing</li>
      <li>UI/UX design</li>
      <li>Design review</li>
      <li>Final design approval</li>
    </ul>
    
    <h3>Phase 3: Development (8 weeks)</h3>
    <ul>
      <li>Frontend development</li>
      <li>Backend development</li>
      <li>API integration</li>
      <li>Database implementation</li>
      <li>Third-party service integration</li>
    </ul>
    
    <h3>Phase 4: Testing (3 weeks)</h3>
    <ul>
      <li>Unit testing</li>
      <li>Integration testing</li>
      <li>User acceptance testing</li>
      <li>Performance testing</li>
      <li>Security testing</li>
    </ul>
    
    <h3>Phase 5: Deployment and Launch (2 weeks)</h3>
    <ul>
      <li>Environment setup</li>
      <li>Deployment procedures</li>
      <li>Monitoring setup</li>
      <li>Launch checklist</li>
      <li>Marketing coordination</li>
    </ul>
    
    <h2>Team Structure</h2>
    <ul>
      <li>Project Manager</li>
      <li>UI/UX Designer</li>
      <li>Frontend Developer(s)</li>
      <li>Backend Developer(s)</li>
      <li>QA Engineer</li>
      <li>DevOps Engineer</li>
    </ul>
    
    <h2>Budget Considerations</h2>
    <ul>
      <li>Development costs</li>
      <li>Infrastructure costs</li>
      <li>Third-party service costs</li>
      <li>Marketing budget</li>
      <li>Contingency (15-20%)</li>
    </ul>
    
    <h2>Risk Management</h2>
    <ul>
      <li>Potential delays in development</li>
      <li>Technical challenges</li>
      <li>Resource constraints</li>
      <li>Market changes</li>
      <li>Mitigation strategies</li>
    </ul>
  `;
}

// Helper functions
function getIndustrySpecificFeatures(industry: string, type: string): string[] {
  const features: { [key: string]: string[] } = {
    healthcare: [
      'HIPAA compliance measures',
      'Patient data management',
      'Appointment scheduling',
      'Secure messaging'
    ],
    finance: [
      'Secure transaction processing',
      'Account management',
      'Financial reporting',
      'Regulatory compliance features'
    ],
    education: [
      'Learning management features',
      'Progress tracking',
      'Content delivery system',
      'Assessment tools'
    ],
    retail: [
      'Product catalog',
      'Shopping cart functionality',
      'Payment processing',
      'Order management'
    ],
    entertainment: [
      'Content discovery',
      'User preferences',
      'Media playback',
      'Personalized recommendations'
    ],
    other: [
      'Core functionality specific to problem domain',
      'Basic user management',
      'Simple reporting/analytics',
      'Feedback collection mechanism'
    ]
  };
  
  return features[industry] || features.other;
}

function getRecommendedTechStack(type: string): any {
  const stacks: { [key: string]: any } = {
    'mobile-app': {
      frontend: {
        framework: 'React Native / Flutter',
        stateManagement: 'Redux / Context API',
        ui: 'Native components with custom styling'
      },
      backend: {
        server: 'Node.js with Express',
        api: 'RESTful API with JSON responses',
        auth: 'JWT with secure storage',
        database: 'MongoDB / PostgreSQL'
      },
      infrastructure: {
        hosting: 'AWS Amplify / Google Firebase',
        cicd: 'Fastlane / App Center',
        monitoring: 'Crashlytics / Sentry',
        security: 'SSL, App code obfuscation, Secure storage'
      }
    },
    'web-application': {
      frontend: {
        framework: 'React.js / Vue.js',
        stateManagement: 'Redux / Vuex',
        ui: 'Material UI / Tailwind CSS'
      },
      backend: {
        server: 'Node.js with Express',
        api: 'RESTful API / GraphQL',
        auth: 'JWT with OAuth integration',
        database: 'PostgreSQL / MongoDB'
      },
      infrastructure: {
        hosting: 'AWS (EC2, S3) / Vercel / Netlify',
        cicd: 'GitHub Actions / CircleCI',
        monitoring: 'Datadog / New Relic',
        security: 'SSL, CSRF protection, Input sanitization'
      }
    },
    'saas': {
      frontend: {
        framework: 'React.js / Angular',
        stateManagement: 'Redux / NgRx',
        ui: 'Material UI / Bootstrap'
      },
      backend: {
        server: 'Node.js / Python (Django/Flask)',
        api: 'RESTful API / GraphQL',
        auth: 'JWT with RBAC',
        database: 'PostgreSQL / MySQL'
      },
      infrastructure: {
        hosting: 'AWS (ECS, RDS) / Azure',
        cicd: 'Jenkins / GitHub Actions',
        monitoring: 'ELK Stack / Prometheus + Grafana',
        security: 'SSL, WAF, Regular security audits'
      }
    },
    'e-commerce': {
      frontend: {
        framework: 'React.js / Next.js',
        stateManagement: 'Redux / Context API',
        ui: 'Styled-components / Tailwind CSS'
      },
      backend: {
        server: 'Node.js / PHP (Laravel)',
        api: 'RESTful API',
        auth: 'JWT with social login options',
        database: 'PostgreSQL / MySQL'
      },
      infrastructure: {
        hosting: 'AWS (EC2, RDS, CloudFront)',
        cicd: 'GitHub Actions / GitLab CI',
        monitoring: 'Datadog / CloudWatch',
        security: 'SSL, PCI compliance, Fraud detection'
      }
    },
    'other': {
      frontend: {
        framework: 'React.js',
        stateManagement: 'Redux / Context API',
        ui: 'Tailwind CSS / Material UI'
      },
      backend: {
        server: 'Node.js with Express',
        api: 'RESTful API',
        auth: 'JWT authentication',
        database: 'PostgreSQL'
      },
      infrastructure: {
        hosting: 'AWS / Heroku',
        cicd: 'GitHub Actions',
        monitoring: 'Sentry / LogRocket',
        security: 'SSL, Security best practices'
      }
    }
  };
  
  return stacks[type] || stacks.other;
}
