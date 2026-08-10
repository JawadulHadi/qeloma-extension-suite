import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-popup-night',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#0f172a] text-slate-100 p-4 w-80 rounded-2xl shadow-xl border border-slate-800 font-sans">
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <mat-icon>dark_mode</mat-icon>
          </div>
          <div>
            <h3 class="font-bold text-sm text-white leading-tight">Qeloma Night</h3>
            <span class="text-[10px] text-slate-400">v1.0.0 · ActiveTab CSS</span>
          </div>
        </div>
        <!-- Master Toggle -->
        <button 
          (click)="toggleNight()"
          [class.bg-indigo-600]="store.nightSettings().enabled"
          [class.bg-slate-700]="!store.nightSettings().enabled"
          class="w-11 h-6 rounded-full transition-colors relative cursor-pointer flex items-center px-0.5">
          <div 
            [class.translate-x-5]="store.nightSettings().enabled"
            class="w-5 h-5 bg-white rounded-full transition-transform shadow-md"></div>
        </button>
      </div>

      <!-- Presets -->
      <div class="mb-4">
        <span class="text-xs text-slate-400 block mb-2 font-medium">Dark Mode Preset</span>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <button 
            (click)="setPreset('obsidian')"
            [class.border-indigo-500]="store.nightSettings().mode === 'obsidian'"
            [class.bg-indigo-600/20]="store.nightSettings().mode === 'obsidian'"
            class="p-2 rounded-xl border border-slate-700/50 bg-slate-800/60 hover:bg-slate-800 text-left cursor-pointer transition-all">
            <div class="font-bold text-white">Obsidian</div>
            <div class="text-[10px] text-slate-400">Deep OLED Black</div>
          </button>

          <button 
            (click)="setPreset('slate')"
            [class.border-indigo-500]="store.nightSettings().mode === 'slate'"
            [class.bg-indigo-600/20]="store.nightSettings().mode === 'slate'"
            class="p-2 rounded-xl border border-slate-700/50 bg-slate-800/60 hover:bg-slate-800 text-left cursor-pointer transition-all">
            <div class="font-bold text-white">Midnight Slate</div>
            <div class="text-[10px] text-slate-400">Calm Blue Dark</div>
          </button>

          <button 
            (click)="setPreset('amber')"
            [class.border-indigo-500]="store.nightSettings().mode === 'amber'"
            [class.bg-indigo-600/20]="store.nightSettings().mode === 'amber'"
            class="p-2 rounded-xl border border-slate-700/50 bg-slate-800/60 hover:bg-slate-800 text-left cursor-pointer transition-all">
            <div class="font-bold text-amber-300">Warm Amber</div>
            <div class="text-[10px] text-slate-400">Night Blue Light Cut</div>
          </button>

          <button 
            (click)="setPreset('oled')"
            [class.border-indigo-500]="store.nightSettings().mode === 'oled'"
            [class.bg-indigo-600/20]="store.nightSettings().mode === 'oled'"
            class="p-2 rounded-xl border border-slate-700/50 bg-slate-800/60 hover:bg-slate-800 text-left cursor-pointer transition-all">
            <div class="font-bold text-white">High Contrast</div>
            <div class="text-[10px] text-slate-400">Ultra Dark</div>
          </button>
        </div>
      </div>

      <!-- Fine-Tuning Sliders -->
      <div class="space-y-3 mb-4 text-xs">
        <div>
          <div class="flex justify-between text-slate-300 mb-1">
            <span>Inversion Intensity</span>
            <span class="font-mono text-indigo-400 font-semibold">{{ store.nightSettings().invert }}%</span>
          </div>
          <input 
            type="range" min="0" max="100" 
            [value]="store.nightSettings().invert"
            (input)="updateSlider('invert', $event)"
            class="w-full accent-indigo-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer" />
        </div>

        <div>
          <div class="flex justify-between text-slate-300 mb-1">
            <span>Contrast</span>
            <span class="font-mono text-indigo-400 font-semibold">{{ store.nightSettings().contrast }}%</span>
          </div>
          <input 
            type="range" min="50" max="150" 
            [value]="store.nightSettings().contrast"
            (input)="updateSlider('contrast', $event)"
            class="w-full accent-indigo-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer" />
        </div>

        <div>
          <div class="flex justify-between text-slate-300 mb-1">
            <span>Warm Sepia Tint</span>
            <span class="font-mono text-indigo-400 font-semibold">{{ store.nightSettings().sepia }}%</span>
          </div>
          <input 
            type="range" min="0" max="50" 
            [value]="store.nightSettings().sepia"
            (input)="updateSlider('sepia', $event)"
            class="w-full accent-indigo-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer" />
        </div>
      </div>

      <!-- Whitelist Site Button -->
      <button 
        (click)="toggleWhitelist()"
        class="w-full py-2 px-3 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800 text-xs font-medium text-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-all">
        <mat-icon class="text-sm text-slate-400">check_circle_outline</mat-icon>
        <span>{{ store.nightSettings().whitelisted ? 'Enable Night on this site' : 'Disable on this site (Whitelist)' }}</span>
      </button>
    </div>
  `
})
export class PopupNightComponent {
  store = inject(ExtensionStoreService);

  toggleNight() {
    this.store.updateNightSettings({ enabled: !this.store.nightSettings().enabled });
  }

  setPreset(mode: 'slate' | 'obsidian' | 'amber' | 'oled') {
    if (mode === 'obsidian') this.store.updateNightSettings({ mode, invert: 85, contrast: 110, sepia: 15 });
    if (mode === 'slate') this.store.updateNightSettings({ mode, invert: 70, contrast: 100, sepia: 5 });
    if (mode === 'amber') this.store.updateNightSettings({ mode, invert: 80, contrast: 100, sepia: 40 });
    if (mode === 'oled') this.store.updateNightSettings({ mode, invert: 95, contrast: 125, sepia: 0 });
  }

  updateSlider(key: 'invert' | 'contrast' | 'sepia', event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    this.store.updateNightSettings({ [key]: val });
  }

  toggleWhitelist() {
    this.store.updateNightSettings({ whitelisted: !this.store.nightSettings().whitelisted });
  }
}
