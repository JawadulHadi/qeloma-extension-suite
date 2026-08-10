import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-popup-focus',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#11161C] text-slate-100 p-4 w-80 rounded-2xl shadow-2xl border border-white/10 font-sans">
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-[#C0532E]/20 text-[#C0532E] flex items-center justify-center">
            <mat-icon>security</mat-icon>
          </div>
          <div>
            <h3 class="font-bold text-sm text-white leading-tight">Qeloma Focus</h3>
            <span class="text-[10px] text-slate-400">v1.0.0 · Declarative Blocker</span>
          </div>
        </div>
        <button 
          (click)="toggleFocusSession()"
          [class.bg-emerald-600]="store.focusState().isFocusSessionActive"
          [class.bg-slate-700]="!store.focusState().isFocusSessionActive"
          class="px-2.5 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1 cursor-pointer transition-all">
          <mat-icon class="text-sm">timer</mat-icon>
          <span>{{ store.focusState().isFocusSessionActive ? 'Active' : 'Paused' }}</span>
        </button>
      </div>

      <!-- Active Timer Widget -->
      <div class="bg-gradient-to-br from-[#161D26] to-[#1E2733] p-3 rounded-xl border border-white/10 mb-4 text-center">
        <div class="text-[10px] uppercase text-slate-400 tracking-wider font-semibold mb-1">Pomodoro Focus Timer</div>
        <div class="text-2xl font-mono font-bold text-white tracking-widest text-[#C0532E] mb-1">
          {{ formatTimer(store.focusState().timeRemainingSeconds) }}
        </div>
        <p class="text-[10px] text-slate-400">
          {{ store.focusState().blockedDomains.length }} domains blocked with declarativeNetRequest
        </p>
      </div>

      <!-- Domain Add Input -->
      <div class="mb-4">
        <label for="blocked-domain-input" class="text-xs text-slate-300 font-medium block mb-1">Add Blocked Domain</label>
        <div class="flex gap-2">
          <input 
            id="blocked-domain-input"
            [formControl]="domainInput"
            (keyup.enter)="addDomain()"
            placeholder="e.g. reddit.com"
            class="flex-1 bg-[#161D26] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#C0532E]" />
          <button 
            (click)="addDomain()"
            class="bg-[#C0532E] hover:bg-[#a04223] text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer">
            Block
          </button>
        </div>
      </div>

      <!-- Blocklist Tags -->
      <div class="mb-3">
        <span class="text-[10px] text-slate-400 block mb-1.5 font-medium">Active Blocked Domains:</span>
        <div class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
          @for (domain of store.focusState().blockedDomains; track domain) {
            <span class="inline-flex items-center gap-1 bg-red-950/40 text-red-300 border border-red-500/20 px-2 py-0.5 rounded-md text-[11px]">
              <span>{{ domain }}</span>
              <button (click)="store.removeBlockedDomain(domain)" class="hover:text-white cursor-pointer">
                <mat-icon class="text-xs">close</mat-icon>
              </button>
            </span>
          }
        </div>
      </div>
    </div>
  `
})
export class PopupFocusComponent {
  store = inject(ExtensionStoreService);
  domainInput = new FormControl('');

  toggleFocusSession() {
    this.store.focusState.update(s => ({
      ...s,
      isFocusSessionActive: !s.isFocusSessionActive
    }));
  }

  addDomain() {
    if (this.domainInput.value) {
      this.store.addBlockedDomain(this.domainInput.value);
      this.domainInput.reset();
    }
  }

  formatTimer(totalSeconds: number): string {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
