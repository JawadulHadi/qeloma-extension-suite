import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { QelomaExtension } from '../../models/extension.model';
import { MatIconModule } from '@angular/material/icon';
import { QelomaLogoComponent } from '../qeloma-logo';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MatIconModule, QelomaLogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-dashboard.html'
})
export class AdminDashboardComponent {
  store = inject(ExtensionStoreService);

  categoryFilter = signal<string>('all');

  filteredExtensions = computed(() => {
    const filter = this.categoryFilter();
    if (filter === 'all') return this.store.extensions();
    if (filter === 'wedge') return this.store.extensions().filter(e => e.isWedge);
    if (filter === 'green') return this.store.extensions().filter(e => e.permissionTier === 'Green');
    if (filter === 'amber') return this.store.extensions().filter(e => e.permissionTier === 'Amber');
    return this.store.extensions();
  });

  triggerCiBuild(extId: string) {
    this.store.triggerCiBuild(extId);
  }

  triggerAllBuilds() {
    this.store.triggerAllCiBuilds();
  }

  testInSimulator(extId: string) {
    this.store.selectExtension(extId);
    this.store.activeView.set('simulator');
  }

  auditManifest(ext: QelomaExtension) {
    this.store.linterInputJson.set(ext.manifestSnippet);
    this.store.runManifestLinter(ext.manifestSnippet);
    this.store.activeView.set('linter');
  }

  downloadZip(extId: string) {
    this.store.downloadExtensionZip(extId);
  }

  changeStatus(extId: string, event: Event) {
    const val = (event.target as HTMLSelectElement).value as 'Draft' | 'Packaging' | 'Submitted' | 'In Review' | 'Published';
    this.store.updateCwsStatus(extId, val);
  }
}
