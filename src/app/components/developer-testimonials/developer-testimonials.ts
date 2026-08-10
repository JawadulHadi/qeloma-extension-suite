import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-developer-testimonials',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './developer-testimonials.html'
})
export class DeveloperTestimonialsComponent {
  store = inject(ExtensionStoreService);

  toggleStar() {
    this.store.starRepo();
  }

  exploreMonorepo() {
    this.store.activeView.set('monorepo');
  }

  viewReleases() {
    this.store.activeView.set('releases');
  }
}
