import { Component, ChangeDetectionStrategy, inject, HostListener } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';
import { QelomaLogoComponent } from '../qeloma-logo';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, QelomaLogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html'
})
export class HeaderComponent {
  store = inject(ExtensionStoreService);

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.store.openSearch();
    }
    if (event.key === 'Escape' && this.store.isSearchOpen()) {
      this.store.closeSearch();
    }
  }

  openSearch() {
    this.store.openSearch();
  }

  toggleTheme() {
    this.store.toggleThemeMode();
  }

  setView(view: 'simulator' | 'admin' | 'showcase' | 'releases' | 'community' | 'guide' | 'checklist' | 'monorepo' | 'linter' | 'economics' | 'onboarding') {
    this.store.activeView.set(view);
  }
}

