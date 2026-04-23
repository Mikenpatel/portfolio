export type ToolCategory = "Repository Management" | "CI/CD" | "Security" | "GitOps" | "Infrastructure";
export type ToolStatus = "Operational" | "Degraded" | "Outage";

export interface HowToGuide {
  title: string;
  content: string;
  codeSnippet?: string;
  language?: string;
}

export interface Instance {
  name: string;
  url: string;
  status: ToolStatus;
}

export interface Availability {
  uptime: string;
  last30Days: string;
  lastIncident: string;
  sla: string;
}

export interface RepositoryStats {
  local: number;
  remote: number;
  virtual: number;
  byType: { type: string; count: number }[];
}

export interface Performance {
  avgResponseTime: string;
  p99ResponseTime: string;
  throughput: string;
  cacheHitRatio: string;
}

export interface UsageStats {
  storageUsed: string;
  storageTotal: string;
  storagePercent: number;
  activeUsers: number;
  downloadsThisMonth: number;
  uploadsThisMonth: number;
}

export interface ServiceCatalogItem {
  name: string;
  description: string;
  url: string;
}

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  iconName: string;
  description: string;
  instances: Instance[];
  features?: string[];
  techTypes?: string[];
  guides: HowToGuide[];
  metrics: {
    label: string;
    count: number;
    trend?: "up" | "down" | "neutral";
  }[];
  lastUpdated: string;
  availability?: Availability;
  repositories?: RepositoryStats;
  performance?: Performance;
  usage?: UsageStats;
  serviceCatalog?: ServiceCatalogItem[];
}

export const TOOLS: Tool[] = [
  {
    id: "artifactory",
    name: "Artifactory",
    category: "Repository Management",
    iconName: "SiJfrog",
    description: "Enterprise universal binary repository manager for all your artifacts.",
    instances: [
      { name: "EMEA", url: "artifactory-emea.company.com", status: "Operational" },
      { name: "APAC", url: "artifactory-apac.company.com", status: "Operational" },
      { name: "AMER", url: "artifactory-amer.company.com", status: "Operational" }
    ],
    techTypes: ["Maven", "npm", "PyPI", "Docker", "Helm", "Go", "NuGet", "CocoaPods", "Generic"],
    guides: [
      {
        title: "pip install config",
        content: "Configure pip to use our internal PyPI repository.",
        codeSnippet: `[global]
index-url = https://artifactory-amer.company.com/artifactory/api/pypi/pypi-virtual/simple`,
        language: "ini"
      },
      {
        title: "npm config",
        content: "Set the npm registry to our internal Artifactory.",
        codeSnippet: `npm config set registry https://artifactory-amer.company.com/artifactory/api/npm/npm-virtual/`,
        language: "bash"
      },
      {
        title: "Docker login",
        content: "Authenticate with our internal Docker registry.",
        codeSnippet: `docker login artifactory-amer.company.com`,
        language: "bash"
      },
      {
        title: "Maven settings.xml",
        content: "Configure Maven to resolve dependencies from Artifactory.",
        codeSnippet: `<settings>
  <mirrors>
    <mirror>
      <id>artifactory</id>
      <mirrorOf>*</mirrorOf>
      <url>https://artifactory-amer.company.com/artifactory/maven-virtual</url>
    </mirror>
  </mirrors>
</settings>`,
        language: "xml"
      },
      {
        title: "Helm repo add",
        content: "Add the internal Helm chart repository.",
        codeSnippet: `helm repo add company https://artifactory-amer.company.com/artifactory/helm-virtual
helm repo update`,
        language: "bash"
      }
    ],
    metrics: [
      { label: "RITMs this quarter", count: 47, trend: "up" }
    ],
    lastUpdated: "April 15, 2026",
    availability: {
      uptime: "99.97%",
      last30Days: "99.98%",
      lastIncident: "March 12, 2026",
      sla: "99.9%"
    },
    repositories: {
      local: 45,
      remote: 28,
      virtual: 12,
      byType: [
        { type: "Maven", count: 22 },
        { type: "npm", count: 18 },
        { type: "Docker", count: 15 },
        { type: "PyPI", count: 10 },
        { type: "Helm", count: 8 },
        { type: "Other", count: 12 }
      ]
    },
    performance: {
      avgResponseTime: "142ms",
      p99ResponseTime: "380ms",
      throughput: "1.2k req/min",
      cacheHitRatio: "94%"
    },
    usage: {
      storageUsed: "4.2 TB",
      storageTotal: "10 TB",
      storagePercent: 42,
      activeUsers: 847,
      downloadsThisMonth: 142000,
      uploadsThisMonth: 8900
    },
    serviceCatalog: [
      {
        name: "Request Repository Access",
        description: "Get read/write access to an existing Artifactory repository.",
        url: "https://servicenow.company.com/catalog?item=artifactory-access"
      },
      {
        name: "Create New Repository",
        description: "Request creation of a new local, remote, or virtual repository.",
        url: "https://servicenow.company.com/catalog?item=artifactory-new-repo"
      },
      {
        name: "Request Cleanup Policy",
        description: "Set up an automated cleanup policy for old or unused artifacts.",
        url: "https://servicenow.company.com/catalog?item=artifactory-cleanup"
      },
      {
        name: "Onboard a New Package Type",
        description: "Request support for a new package type in Artifactory.",
        url: "https://servicenow.company.com/catalog?item=artifactory-package"
      }
    ]
  },
  {
    id: "bitbucket",
    name: "Bitbucket",
    category: "Repository Management",
    iconName: "SiBitbucket",
    description: "Git repository hosting and collaboration platform.",
    instances: [
      { name: "Global", url: "bitbucket.company.com", status: "Operational" }
    ],
    features: ["Pull Requests", "Pipelines", "Branch permissions"],
    guides: [
      {
        title: "Clone a repository",
        content: "Basic command to clone a repository over SSH.",
        codeSnippet: `git clone ssh://git@bitbucket.company.com:7999/project/repo.git`,
        language: "bash"
      },
      {
        title: "Setup SSH key",
        content: "Generate an SSH key and add it to your Bitbucket account.",
        codeSnippet: `ssh-keygen -t ed25519 -C "your_email@company.com"
cat ~/.ssh/id_ed25519.pub
# Copy the output and paste it into Bitbucket > Profile > SSH Keys`,
        language: "bash"
      },
      {
        title: "Configure pipelines YAML",
        content: "Basic bitbucket-pipelines.yml to get started.",
        codeSnippet: `image: atlassian/default-image:4

pipelines:
  default:
    - step:
        name: Build and Test
        caches:
          - maven
        script:
          - mvn clean install`,
        language: "yaml"
      }
    ],
    metrics: [
      { label: "RITMs this quarter", count: 23, trend: "down" }
    ],
    lastUpdated: "April 15, 2026"
  },
  {
    id: "jenkins",
    name: "Jenkins",
    category: "CI/CD",
    iconName: "SiJenkins",
    description: "Open source automation server for building, deploying, and automating projects.",
    instances: [
      { name: "Production", url: "jenkins.company.com", status: "Operational" },
      { name: "Staging", url: "jenkins-stg.company.com", status: "Operational" }
    ],
    guides: [
      {
        title: "Declarative Jenkinsfile",
        content: "Basic declarative pipeline structure to get started.",
        codeSnippet: `pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                sh 'mvn clean package'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
                sh 'mvn test'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}`,
        language: "groovy"
      },
      {
        title: "Agent configuration",
        content: "Run a pipeline stage on a specific labeled agent.",
        codeSnippet: `pipeline {
    agent { label 'linux-build-agent' }
    stages {
        stage('Build') {
            steps {
                sh 'echo running on labeled agent'
            }
        }
    }
}`,
        language: "groovy"
      }
    ],
    metrics: [
      { label: "Incidents this quarter", count: 8, trend: "neutral" }
    ],
    lastUpdated: "April 15, 2026"
  },
  {
    id: "fortify",
    name: "Fortify",
    category: "Security",
    iconName: "SiShield",
    description: "Static application security testing (SAST) platform.",
    instances: [
      { name: "Enterprise", url: "fortify.company.com", status: "Operational" }
    ],
    guides: [
      {
        title: "Run a Fortify scan",
        content: "Execute a local static analysis scan before pushing code.",
        codeSnippet: `sourceanalyzer -b MyProject -clean
sourceanalyzer -b MyProject src/
sourceanalyzer -b MyProject -scan -f results.fpr`,
        language: "bash"
      },
      {
        title: "Integrate with Jenkins",
        content: "Add the Fortify step to your Jenkinsfile.",
        codeSnippet: `stage('Fortify Scan') {
    steps {
        fortifyTranslate buildID: 'MyApp', src: 'src/'
        fortifyScan buildID: 'MyApp', resultsFile: 'results.fpr'
        fortifyUpload appName: 'MyApp', appVersion: '1.0'
    }
}`,
        language: "groovy"
      }
    ],
    metrics: [
      { label: "RITMs this quarter", count: 31, trend: "up" }
    ],
    lastUpdated: "April 15, 2026"
  },
  {
    id: "nexusiq",
    name: "NexusIQ",
    category: "Security",
    iconName: "SiNexus",
    description: "Software composition analysis for open source license compliance and vulnerability detection.",
    instances: [
      { name: "Enterprise", url: "nexusiq.company.com", status: "Operational" }
    ],
    guides: [
      {
        title: "Add to Maven build",
        content: "Integrate Nexus IQ policy evaluation in your Maven build.",
        codeSnippet: `mvn com.sonatype.clm:clm-maven-plugin:evaluate \\
  -Dclm.applicationId=my-app \\
  -Dclm.serverUrl=https://nexusiq.company.com`,
        language: "bash"
      },
      {
        title: "Add to Gradle build",
        content: "Apply the Nexus IQ Gradle plugin.",
        codeSnippet: `plugins {
    id 'com.sonatype.gradle.clm' version '1.5.0'
}

nexusIQScan {
    applicationId = 'my-app'
    serverUrl = 'https://nexusiq.company.com'
}`,
        language: "groovy"
      }
    ],
    metrics: [
      { label: "RITMs this quarter", count: 19, trend: "down" }
    ],
    lastUpdated: "April 15, 2026"
  },
  {
    id: "devops-gateway",
    name: "DevOps Gateway",
    category: "Infrastructure",
    iconName: "SiServerless",
    description: "Internal API gateway and developer portal for standardized access to DevOps services.",
    instances: [
      { name: "Production", url: "api.devops.company.com", status: "Operational" }
    ],
    guides: [
      {
        title: "Register an application",
        content: "Register your app to get access to DevOps Gateway APIs.",
        codeSnippet: `curl -X POST https://api.devops.company.com/v1/apps \\
  -H "Authorization: Bearer $USER_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "my-service", "team": "platform"}'`,
        language: "bash"
      },
      {
        title: "Generate API keys",
        content: "Create a short-lived token for automation scripts.",
        codeSnippet: `curl -X POST https://api.devops.company.com/v1/auth/token \\
  -H "Authorization: Bearer $USER_TOKEN"`,
        language: "bash"
      }
    ],
    metrics: [
      { label: "RITMs this quarter", count: 12, trend: "neutral" }
    ],
    lastUpdated: "April 15, 2026"
  },
  {
    id: "argocd",
    name: "Argo CD",
    category: "GitOps",
    iconName: "SiArgo",
    description: "Declarative, GitOps continuous delivery tool for Kubernetes.",
    instances: [
      { name: "Production Cluster", url: "argocd.company.com", status: "Operational" }
    ],
    guides: [
      {
        title: "Deploy an application",
        content: "Create an Application manifest to deploy via ArgoCD.",
        codeSnippet: `apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://bitbucket.company.com/scm/proj/my-app.git
    targetRevision: HEAD
    path: k8s
  destination:
    server: https://kubernetes.default.svc
    namespace: my-app
  syncPolicy:
    automated:
      prune: true
      selfHeal: true`,
        language: "yaml"
      },
      {
        title: "Rollback a deployment",
        content: "Roll back to a previous revision using the ArgoCD CLI.",
        codeSnippet: `# List revision history
argocd app history my-app

# Rollback to a specific revision
argocd app rollback my-app 3`,
        language: "bash"
      }
    ],
    metrics: [
      { label: "Incidents this quarter", count: 5, trend: "down" }
    ],
    lastUpdated: "April 15, 2026"
  },
  {
    id: "argo-workflows",
    name: "Argo Workflows",
    category: "GitOps",
    iconName: "SiArgo",
    description: "Container-native workflow engine for orchestrating parallel jobs on Kubernetes.",
    instances: [
      { name: "Shared Cluster", url: "workflows.company.com", status: "Operational" }
    ],
    guides: [
      {
        title: "Create a simple workflow",
        content: "A basic hello-world Argo Workflow definition.",
        codeSnippet: `apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: hello-world-
spec:
  entrypoint: whalesay
  templates:
  - name: whalesay
    container:
      image: docker/whalesay:latest
      command: [cowsay]
      args: ["hello world"]`,
        language: "yaml"
      },
      {
        title: "Monitor workflow status",
        content: "Check workflow status using the Argo CLI.",
        codeSnippet: `# List all workflows
argo list -n argo

# Get details of a specific workflow
argo get my-workflow-abc12 -n argo

# Stream logs
argo logs my-workflow-abc12 -n argo`,
        language: "bash"
      }
    ],
    metrics: [
      { label: "RITMs this quarter", count: 9, trend: "up" }
    ],
    lastUpdated: "April 15, 2026"
  },
  {
    id: "teamcity",
    name: "TeamCity",
    category: "CI/CD",
    iconName: "SiJetbrains",
    description: "Powerful Continuous Integration and Continuous Deployment server by JetBrains.",
    instances: [
      { name: "Production", url: "teamcity.company.com", status: "Operational" }
    ],
    guides: [
      {
        title: "Artifact dependencies",
        content: "Configure artifact dependency rules in TeamCity.",
        codeSnippet: `+:target/**/*.jar => lib/
+:dist/** => dist/`,
        language: "text"
      },
      {
        title: "Kotlin DSL build config",
        content: "Define a build configuration using TeamCity Kotlin DSL.",
        codeSnippet: `object Build : BuildType({
    name = "Build"
    vcs { root(DslContext.settingsRoot) }
    steps {
        maven {
            goals = "clean install"
            runnerArgs = "-DskipTests"
        }
    }
    triggers {
        vcs { }
    }
})`,
        language: "kotlin"
      }
    ],
    metrics: [
      { label: "RITMs this quarter", count: 15, trend: "neutral" }
    ],
    lastUpdated: "April 15, 2026"
  }
];

export const CATEGORIES = Array.from(new Set(TOOLS.map(t => t.category)));
