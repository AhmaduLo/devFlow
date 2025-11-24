import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GuideService } from '../../services/guide.service';
import { Guide, GuideCategory } from '../../models/guide.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  guides$: Observable<Guide[]>;
  categories = Object.values(GuideCategory);
  selectedCategory: GuideCategory | null = null;
  isSidebarOpen = true;
  searchQuery = '';

  constructor(private guideService: GuideService) {
    this.guides$ = this.guideService.getGuides();
  }

  ngOnInit(): void {
    // Select first category by default
    if (this.categories.length > 0) {
      this.selectedCategory = GuideCategory.BACKEND;
    }

    // Close sidebar on mobile by default
    if (window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    }
  }

  selectCategory(category: GuideCategory): void {
    this.selectedCategory = category;
    // Close sidebar on mobile after selecting category
    if (window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  getGuidesByCategory(guides: Guide[]): Guide[] {
    if (!this.selectedCategory) return guides;
    return guides
      .filter(g => g.category === this.selectedCategory)
      .sort((a, b) => a.order - b.order);
  }

  getCategoryIcon(category: GuideCategory): string {
    const iconMap: { [key in GuideCategory]: string } = {
      [GuideCategory.ARCHITECTURE]: 'account_tree',
      [GuideCategory.ENVIRONMENT]: 'settings',
      [GuideCategory.BACKEND]: 'storage',
      [GuideCategory.FRONTEND]: 'web',
      [GuideCategory.TESTS]: 'bug_report',
      [GuideCategory.SONARQUBE]: 'analytics',
      [GuideCategory.DOCKER]: 'view_in_ar',
      [GuideCategory.CICD]: 'sync',
      [GuideCategory.DEPLOYMENT]: 'cloud_upload',
      [GuideCategory.MONITORING]: 'monitor_heart'
    };
    return iconMap[category];
  }

  getCategoryColor(category: GuideCategory): string {
    const colorMap: { [key in GuideCategory]: string } = {
      [GuideCategory.ARCHITECTURE]: '#667eea',
      [GuideCategory.ENVIRONMENT]: '#f59e0b',
      [GuideCategory.BACKEND]: '#10b981',
      [GuideCategory.FRONTEND]: '#3b82f6',
      [GuideCategory.TESTS]: '#ef4444',
      [GuideCategory.SONARQUBE]: '#8b5cf6',
      [GuideCategory.DOCKER]: '#06b6d4',
      [GuideCategory.CICD]: '#f97316',
      [GuideCategory.DEPLOYMENT]: '#14b8a6',
      [GuideCategory.MONITORING]: '#ec4899'
    };
    return colorMap[category];
  }
}
