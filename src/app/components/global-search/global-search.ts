import { Component, ChangeDetectionStrategy, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';
import { MonorepoFile } from '../../models/extension.model';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './global-search.html'
})
export class GlobalSearchComponent implements AfterViewInit {
  store = inject(ExtensionStoreService);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    setTimeout(() => {
      this.searchInput?.nativeElement?.focus();
    }, 100);
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.store.setSearchQuery(value);
  }

  selectExtension(extId: string) {
    this.store.selectExtension(extId);
    this.store.activeView.set('simulator');
    this.store.closeSearch();
  }

  selectRelease() {
    this.store.activeView.set('releases');
    this.store.closeSearch();
  }

  selectFile(file: MonorepoFile) {
    this.store.selectMonorepoFile(file);
    this.store.activeView.set('monorepo');
    this.store.closeSearch();
  }

  selectLinter() {
    this.store.activeView.set('linter');
    this.store.closeSearch();
  }
}
