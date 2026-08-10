import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-release-notes',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './release-notes.html'
})
export class ReleaseNotesComponent {
  store = inject(ExtensionStoreService);

  selectedTagFilter = signal<string>('All');

  setTagFilter(tag: string) {
    this.selectedTagFilter.set(tag);
  }

  filteredReleases() {
    const filter = this.selectedTagFilter();
    if (filter === 'All') return this.store.releaseNotes();
    return this.store.releaseNotes().filter(r => r.extensionId === filter || r.extensionId === 'all');
  }

  downloadReleaseZip(extId: string) {
    if (extId === 'all') {
      this.store.downloadSuiteZip();
    } else {
      this.store.downloadExtensionZip(extId);
    }
  }

  testInSimulator(extId: string) {
    if (extId !== 'all') {
      this.store.selectExtension(extId);
      this.store.activeView.set('simulator');
    } else {
      this.store.activeView.set('simulator');
    }
  }
}
