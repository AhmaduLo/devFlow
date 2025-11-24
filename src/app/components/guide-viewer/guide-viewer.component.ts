import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GuideService } from '../../services/guide.service';
import { Guide } from '../../models/guide.model';

@Component({
  selector: 'app-guide-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './guide-viewer.component.html',
  styleUrls: ['./guide-viewer.component.scss']
})
export class GuideViewerComponent implements OnInit, AfterViewInit {
  guide: Guide | undefined;
  renderedContent: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private guideService: GuideService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadGuide(id);
      }
    });
  }

  ngAfterViewInit(): void {
    // Attendre que le contenu soit rendu
    setTimeout(() => {
      this.setupCodeBlockScrollIndicators();
    }, 100);
  }

  loadGuide(id: string): void {
    this.guide = this.guideService.getGuideById(id);
    if (this.guide) {
      this.guideService.markAsViewed(id);
      this.renderedContent = this.renderMarkdown(this.guide.content);
      // Réinitialiser les indicateurs de scroll après le chargement du contenu
      setTimeout(() => {
        this.setupCodeBlockScrollIndicators();
      }, 100);
    } else {
      // Si le guide n'est pas trouvé, rediriger immédiatement vers le dashboard
      this.router.navigate(['/dashboard']);
    }
  }

  setupCodeBlockScrollIndicators(): void {
    const codeWrappers = document.querySelectorAll('.code-wrapper');
    console.log('Code wrappers found:', codeWrappers.length);

    codeWrappers.forEach((wrapper, index) => {
      const element = wrapper as HTMLElement;

      // Vérifier si le contenu est scrollable
      const isScrollable = element.scrollHeight > element.clientHeight;
      console.log(`Wrapper ${index}: scrollHeight=${element.scrollHeight}, clientHeight=${element.clientHeight}, scrollable=${isScrollable}`);

      if (isScrollable) {
        // Ajouter une classe pour afficher la flèche
        element.classList.add('has-scroll');
        console.log(`Added 'has-scroll' class to wrapper ${index}`);

        // Écouter l'événement de scroll
        element.addEventListener('scroll', () => {
          const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 5;

          if (isAtBottom) {
            element.classList.add('scrolled-bottom');
          } else {
            element.classList.remove('scrolled-bottom');
          }
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  // Simple markdown renderer (for basic markdown support)
  // In production, consider using a library like marked.js or ngx-markdown
  renderMarkdown(markdown: string): string {
    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/gim, (match, lang, code) => {
      const highlightedCode = this.highlightCode(code.trim(), lang);
      return `<div class="code-wrapper"><pre><code class="language-${lang || 'text'}">${highlightedCode}</code></pre></div>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>');

    // Lists (unordered)
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Lists (ordered)
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

    // Horizontal rule
    html = html.replace(/^---$/gim, '<hr>');

    // Paragraphs
    html = html.replace(/\n\n/gim, '</p><p>');
    html = '<p>' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/gim, '');
    html = html.replace(/<p>(<h[1-6]>)/gim, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/gim, '$1');
    html = html.replace(/<p>(<ul>)/gim, '$1');
    html = html.replace(/(<\/ul>)<\/p>/gim, '$1');
    html = html.replace(/<p>(<div class="code-wrapper">)/gim, '$1');
    html = html.replace(/(<\/div>)<\/p>/gim, '$1');
    html = html.replace(/<p>(<hr>)<\/p>/gim, '$1');

    return html;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private highlightCode(code: string, lang?: string): string {
    // Échapper le HTML d'abord
    let highlighted = this.escapeHtml(code);

    // Appliquer la coloration selon le langage
    if (lang === 'java' || lang === 'javascript' || lang === 'typescript' || lang === 'js' || lang === 'ts') {
      // Mots-clés
      const keywords = ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements',
                        'import', 'package', 'return', 'if', 'else', 'for', 'while', 'do', 'switch',
                        'case', 'break', 'continue', 'new', 'this', 'super', 'static', 'final',
                        'abstract', 'void', 'int', 'long', 'double', 'float', 'boolean', 'String',
                        'const', 'let', 'var', 'function', 'async', 'await', 'try', 'catch', 'throw'];

      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
        highlighted = highlighted.replace(regex, '<span class="keyword">$1</span>');
      });

      // Annotations Java
      highlighted = highlighted.replace(/@(\w+)/g, '<span class="keyword">@$1</span>');

      // Chaînes de caractères
      highlighted = highlighted.replace(/"([^"]*)"/g, '<span class="string">"$1"</span>');
      highlighted = highlighted.replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>');

      // Nombres
      highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>');

      // Commentaires
      highlighted = highlighted.replace(/\/\/(.*?)$/gm, '<span class="comment">//$1</span>');
      highlighted = highlighted.replace(/\/\*([\s\S]*?)\*\//g, '<span class="comment">/*$1*/</span>');

      // Noms de classes (commence par une majuscule)
      highlighted = highlighted.replace(/\b([A-Z]\w+)\b/g, '<span class="class">$1</span>');
    } else if (lang === 'css' || lang === 'scss') {
      // Propriétés CSS
      highlighted = highlighted.replace(/([a-z-]+):/g, '<span class="property">$1</span>:');

      // Valeurs
      highlighted = highlighted.replace(/:([^;{]+)/g, ': <span class="string">$1</span>');

      // Sélecteurs
      highlighted = highlighted.replace(/^([.#]?[\w-]+)(\s*{)?/gm, '<span class="class">$1</span>$2');

      // Nombres et unités
      highlighted = highlighted.replace(/(\d+)(px|em|rem|%|vh|vw)?/g, '<span class="number">$1$2</span>');

      // Commentaires
      highlighted = highlighted.replace(/\/\*([\s\S]*?)\*\//g, '<span class="comment">/*$1*/</span>');
    } else if (lang === 'html' || lang === 'xml') {
      // Balises
      highlighted = highlighted.replace(/&lt;(\/?[\w-]+)/g, '&lt;<span class="keyword">$1</span>');
      highlighted = highlighted.replace(/(\w+)=/g, '<span class="property">$1</span>=');

      // Attributs
      highlighted = highlighted.replace(/="([^"]*)"/g, '=<span class="string">"$1"</span>');
    }

    return highlighted;
  }

  copyCode(event: Event): void {
    const button = event.target as HTMLElement;
    const codeBlock = button.closest('pre')?.querySelector('code');
    if (codeBlock) {
      navigator.clipboard.writeText(codeBlock.textContent || '');
      button.textContent = 'Copié !';
      setTimeout(() => {
        button.textContent = 'Copier';
      }, 2000);
    }
  }
}
