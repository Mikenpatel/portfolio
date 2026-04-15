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
      }
    ],
    metrics: [
      { label: "RITMs this quarter", count: 47, trend: "up" }
    ],
    lastUpdated: "April 15, 2026"
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
        title: "Clone repo",
        content: "Basic command to clone a repository.",
        codeSnippet: `git clone ssh://git@bitbucket.company.com:7999/project/repo.git`,
        language: "bash"
      },
      {
        title: "Setup SSH key",
        content: "Generate an SSH key for Bitbucket authentication.",
        codeSnippet: `ssh-keygen -t ed25519 -C "your_email@company.com"
cat ~/.ssh/id_ed25519.pub`,
        language: "bash"
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
        title: "Jenkinsfile syntax",
        content: "Basic declarative pipeline structure.",
        codeSnippet: `pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Building..'
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
        title: "Run Fortify scan",
        content: "Execute a local scan before pushing code.",
        codeSnippet: `sourceanalyzer -b MyProject -clean
sourceanalyzer -b MyProject src/
sourceanalyzer -b MyProject -scan -f results.fpr`,
        language: "bash"
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
    iconName: "SiJfrog",
    description: "Software composition analysis for open source license compliance and vulnerability detection.",
    instances: [
      { name: "Enterprise", url: "nexusiq.company.com", status: "Operational" }
    ],
    guides: [
      {
        title: "Add to Maven build",
        content: "Integrate Nexus IQ policy evaluation in Maven.",
        codeSnippet: `mvn com.sonatype.clm:clm-maven-plugin:evaluate -Dclm.applicationId=my-app`,
        language: "bash"
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
        content: "Create an Application manifest for ArgoCD.",
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
    namespace: my-app`,
        language: "yaml"
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
        title: "Create a workflow",
        content: "A simple hello world workflow.",
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
    description: "Powerful Continuous Integration and Continuous Deployment server.",
    instances: [
      { name: "Production", url: "teamcity.company.com", status: "Operational" }
    ],
    guides: [
      {
        title: "Artifact dependencies",
        content: "How to configure artifact rules.",
        codeSnippet: `+:target/**/*.jar => lib/`,
        language: "text"
      }
    ],
    metrics: [
      { label: "RITMs this quarter", count: 15, trend: "neutral" }
    ],
    lastUpdated: "April 15, 2026"
  }
];

export const CATEGORIES = Array.from(new Set(TOOLS.map(t => t.category)));
