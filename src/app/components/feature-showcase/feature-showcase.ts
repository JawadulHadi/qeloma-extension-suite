import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-feature-showcase',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './feature-showcase.html'
})
export class FeatureShowcaseComponent {
  store = inject(ExtensionStoreService);

  // Active category filter
  activeCategory = signal<string>('All');
  categories = ['All', 'Page Tools', 'Privacy & Blocking', 'Appearance', 'AI Integration', 'Media', 'Productivity'];

  // Video playback simulation state
  isPlaying = signal<boolean>(true);
  playbackSpeed = signal<number>(1);
  currentStep = signal<number>(1);

  constructor() {
    // Step animation ticker for video simulation
    setInterval(() => {
      if (this.isPlaying()) {
        this.currentStep.update(s => (s % 3) + 1);
      }
    }, 3500);
  }

  setCategory(cat: string) {
    this.activeCategory.set(cat);
  }

  filteredExtensions() {
    const cat = this.activeCategory();
    if (cat === 'All') return this.store.extensions();
    return this.store.extensions().filter(e => e.category === cat);
  }

  selectExtension(id: string) {
    this.store.selectExtension(id);
    this.currentStep.set(1);
    this.isPlaying.set(true);
  }

  togglePlay() {
    this.isPlaying.update(v => !v);
  }

  restartVideo() {
    this.currentStep.set(1);
    this.isPlaying.set(true);
  }

  setSpeed(speed: number) {
    this.playbackSpeed.set(speed);
  }

  launchSimulator(id: string) {
    this.store.selectExtension(id);
    this.store.activeView.set('simulator');
  }

  auditManifest(id: string) {
    this.store.lintExtensionById(id);
    this.store.activeView.set('linter');
  }

  viewSource() {
    this.store.activeView.set('monorepo');
  }
}
