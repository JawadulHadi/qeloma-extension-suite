import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';
import { QelomaLogoComponent } from '../qeloma-logo';

@Component({
  selector: 'app-deployment-guide',
  standalone: true,
  imports: [MatIconModule, QelomaLogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './deployment-guide.html'
})
export class DeploymentGuideComponent {
  store = inject(ExtensionStoreService);

  activeTab = signal<'listings' | 'assets' | 'policies' | 'monorepo'>('listings');
}
