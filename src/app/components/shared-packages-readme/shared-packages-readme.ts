import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-shared-packages-readme',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shared-packages-readme.html'
})
export class SharedPackagesReadmeComponent {
  store = inject(ExtensionStoreService);

  selectedPkg = signal<string>('@qeloma/types');

  selectPkg(name: string) {
    this.selectedPkg.set(name);
  }

  get currentPkg() {
    return this.store.sharedPackages().find(p => p.name === this.selectedPkg()) || this.store.sharedPackages()[0];
  }
}
