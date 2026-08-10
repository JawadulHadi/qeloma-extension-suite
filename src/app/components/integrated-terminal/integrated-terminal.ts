import { Component, ChangeDetectionStrategy, inject, signal, ElementRef, ViewChild } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';

export interface LogLine {
  id: string;
  timestamp: string;
  prefix: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'vite' | 'cws';
  text: string;
}

@Component({
  selector: 'app-integrated-terminal',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './integrated-terminal.html'
})
export class IntegratedTerminalComponent {
  store = inject(ExtensionStoreService);

  @ViewChild('terminalConsole') terminalConsole!: ElementRef<HTMLDivElement>;

  selectedTarget = signal<string>('all');
  buildMode = signal<'build' | 'dev'>('build');
  isBuilding = signal<boolean>(false);
  terminalTheme = signal<'matrix' | 'monokai' | 'light'>('monokai');
  autoScroll = signal<boolean>(true);

  logs = signal<LogLine[]>([
    { id: '1', timestamp: '07:45:01', prefix: '[pnpm]', type: 'info', text: 'Scope: 10 extension workspace packages + 5 shared libraries' },
    { id: '2', timestamp: '07:45:02', prefix: '[wxt]', type: 'vite', text: 'Initialized WXT v0.19.4 target: chrome-mv3' },
    { id: '3', timestamp: '07:45:02', prefix: '[cws]', type: 'cws', text: 'Pre-flight Manifest V3 CSP audit: ZERO eval() detected' },
    { id: '4', timestamp: '07:45:03', prefix: '[build]', type: 'success', text: '✔ Ready for build commands. Select an extension package above.' }
  ]);

  selectTarget(target: string) {
    this.selectedTarget.set(target);
  }

  setTerminalTheme(theme: 'matrix' | 'monokai' | 'light') {
    this.terminalTheme.set(theme);
  }

  clearLogs() {
    this.logs.set([
      { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), prefix: '[terminal]', type: 'info', text: 'Terminal output cleared.' }
    ]);
  }

  copyLogs() {
    const text = this.logs().map(l => `${l.timestamp} ${l.prefix} ${l.text}`).join('\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      this.store.submitFeedback('Copied terminal build logs to clipboard');
    }
  }

  downloadLogs() {
    const text = this.logs().map(l => `${l.timestamp} ${l.prefix} ${l.text}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qeloma-wxt-build-${this.selectedTarget()}-${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
  }

  runBuild() {
    if (this.isBuilding()) return;
    this.isBuilding.set(true);

    const targetName = this.selectedTarget() === 'all' 
      ? 'All 10 Suite Extensions' 
      : (this.store.extensions().find(e => e.id === this.selectedTarget())?.name || this.selectedTarget());

    const isDev = this.buildMode() === 'dev';
    const now = () => new Date().toLocaleTimeString();

    const sequence: LogLine[] = [
      { id: 'b1', timestamp: now(), prefix: '[pnpm]', type: 'info', text: `$ pnpm ${isDev ? 'dev' : 'build'}:${this.selectedTarget()}` },
      { id: 'b2', timestamp: now(), prefix: '[wxt]', type: 'vite', text: `[wxt] Building ${targetName} for chrome-mv3...` },
      { id: 'b3', timestamp: now(), prefix: '[vite]', type: 'vite', text: `[vite] Transforming TypeScript entry points & Tailwind CSS styles...` },
      { id: 'b4', timestamp: now(), prefix: '[cws-linter]', type: 'cws', text: `[cws] Verifying Manifest V3 service worker registration & CSP strictness...` },
      { id: 'b5', timestamp: now(), prefix: '[cws-linter]', type: 'cws', text: `[cws] Fast-track eligibility confirmed (<24h review velocity).` },
      { id: 'b6', timestamp: now(), prefix: '[wxt]', type: 'success', text: `✔ Extension bundle created: .output/chrome-mv3/${this.selectedTarget()}` },
      { id: 'b7', timestamp: now(), prefix: '[wxt]', type: 'success', text: `✔ Total bundle size: 38.4 KB (zipped). Pass rate: 100% (18/18 tests).` }
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        const item = { ...sequence[i], id: `log-${Date.now()}-${i}`, timestamp: new Date().toLocaleTimeString() };
        this.logs.update(list => [...list, item]);
        i++;
        this.scrollToBottom();
      } else {
        clearInterval(interval);
        this.isBuilding.set(false);
      }
    }, 400);
  }

  private scrollToBottom() {
    if (this.autoScroll() && this.terminalConsole) {
      setTimeout(() => {
        try {
          this.terminalConsole.nativeElement.scrollTop = this.terminalConsole.nativeElement.scrollHeight;
        } catch (err) {
          console.debug('Scroll exception:', err);
        }
      }, 50);
    }
  }
}
