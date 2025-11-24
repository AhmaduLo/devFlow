/**
 * Modèles pour le système de guides de développement
 */

export enum GuideCategory {
  ARCHITECTURE = 'Architecture & Conception',
  ENVIRONMENT = 'Environnement de développement',
  BACKEND = 'Backend Java/Spring',
  FRONTEND = 'Frontend Angular',
  TESTS = 'Tests',
  SONARQUBE = 'SonarQube',
  DOCKER = 'Docker',
  CICD = 'CI/CD',
  DEPLOYMENT = 'Déploiement',
  MONITORING = 'Monitoring & Maintenance'
}

export interface Guide {
  id: string;
  title: string;
  category: GuideCategory;
  content: string; // Contenu en markdown
  tags: string[];
  order: number;
  icon: string; // Material icon name
  color: string; // Couleur pour la catégorie
  lastUpdated: Date;
  isViewed?: boolean;
}

export interface GuideSection {
  id: string;
  guideId: string;
  title: string;
  content: string;
  order: number;
  type: 'definition' | 'example' | 'warning' | 'tip' | 'checklist';
}

export interface Checklist {
  id: string;
  title: string;
  description: string;
  category: GuideCategory;
  items: ChecklistItem[];
  icon: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  order: number;
  tip?: string;
}

export interface Command {
  id: string;
  title: string;
  command: string;
  description: string;
  category: 'git' | 'docker' | 'angular' | 'maven' | 'npm' | 'linux';
  tags: string[];
}
