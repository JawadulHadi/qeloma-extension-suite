import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ExtensionStoreService } from './services/extension-store.service';
import { HeaderComponent } from './components/header/header';
import { BrowserSimulatorComponent } from './components/browser-simulator/browser-simulator';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { DeploymentGuideComponent } from './components/deployment-guide/deployment-guide';
import { DeploymentChecklistComponent } from './components/deployment-checklist/deployment-checklist';
import { MonorepoExplorerComponent } from './components/monorepo-explorer/monorepo-explorer';
import { CwsLinterComponent } from './components/cws-linter/cws-linter';
import { BuildEconomicsComponent } from './components/build-economics/build-economics';
import { FeatureShowcaseComponent } from './components/feature-showcase/feature-showcase';
import { ReleaseNotesComponent } from './components/release-notes/release-notes';
import { DeveloperTestimonialsComponent } from './components/developer-testimonials/developer-testimonials';
import { GlobalSearchComponent } from './components/global-search/global-search';
import { OnboardingWizardComponent } from './components/onboarding-wizard/onboarding-wizard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    BrowserSimulatorComponent,
    AdminDashboardComponent,
    DeploymentGuideComponent,
    DeploymentChecklistComponent,
    MonorepoExplorerComponent,
    CwsLinterComponent,
    BuildEconomicsComponent,
    FeatureShowcaseComponent,
    ReleaseNotesComponent,
    DeveloperTestimonialsComponent,
    GlobalSearchComponent,
    OnboardingWizardComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  store = inject(ExtensionStoreService);
}
