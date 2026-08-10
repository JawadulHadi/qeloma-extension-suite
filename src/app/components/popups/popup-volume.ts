import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-popup-volume',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#11161C] text-slate-100 p-4 w-80 rounded-2xl shadow-2xl border border-white/10 font-sans">
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <mat-icon>volume_up</mat-icon>
          </div>
          <div>
            <h3 class="font-bold text-sm text-white leading-tight">Qeloma Volume</h3>
            <span class="text-[10px] text-slate-400">v1.0.0 · Tab Audio Booster</span>
          </div>
        </div>
        <span class="text-xs font-mono font-bold text-[#C0532E] px-2 py-0.5 rounded bg-white/5">
          {{ store.volumeState().volumeLevel }}%
        </span>
      </div>

      <!-- Large Volume Gain Slider -->
      <div class="mb-5 bg-[#161D26] p-3 rounded-xl border border-white/5">
        <div class="flex justify-between text-xs text-slate-300 mb-2 font-medium">
          <span>Audio Boost Level</span>
          <span [class.text-amber-400]="store.volumeState().volumeLevel > 100" class="font-mono font-bold">
            {{ store.volumeState().volumeLevel > 100 ? '+' + (store.volumeState().volumeLevel - 100) + '% Boost' : 'Standard' }}
          </span>
        </div>

        <input 
          type="range" min="0" max="600" step="10"
          [value]="store.volumeState().volumeLevel"
          (input)="updateVolume($event)"
          class="w-full accent-[#C0532E] bg-slate-800 rounded-lg h-2 cursor-pointer mb-2" />

        <div class="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>0%</span>
          <span>100%</span>
          <span class="text-amber-400 font-bold">300%</span>
          <span class="text-red-400 font-bold">600% Max</span>
        </div>
      </div>

      <!-- Quick Toggles -->
      <div class="space-y-2 mb-4">
        <div class="flex items-center justify-between p-2.5 rounded-xl bg-[#161D26] border border-white/5 text-xs">
          <div class="flex items-center gap-2">
            <mat-icon class="text-amber-400 text-sm">graphic_eq</mat-icon>
            <span class="text-slate-200">Bass Booster</span>
          </div>
          <button 
            (click)="toggleBassBoost()"
            [class.bg-emerald-600]="store.volumeState().bassBoost"
            [class.bg-slate-700]="!store.volumeState().bassBoost"
            class="w-8 h-4 rounded-full transition-colors relative cursor-pointer flex items-center px-0.5">
            <div 
              [class.translate-x-4]="store.volumeState().bassBoost"
              class="w-3.5 h-3.5 bg-white rounded-full transition-transform shadow"></div>
          </button>
        </div>

        <div class="flex items-center justify-between p-2.5 rounded-xl bg-[#161D26] border border-white/5 text-xs">
          <div class="flex items-center gap-2">
            <mat-icon class="text-indigo-400 text-sm">hearing</mat-icon>
            <span class="text-slate-200">Mono Audio Downmix</span>
          </div>
          <button 
            (click)="toggleMono()"
            [class.bg-emerald-600]="store.volumeState().monoAudio"
            [class.bg-slate-700]="!store.volumeState().monoAudio"
            class="w-8 h-4 rounded-full transition-colors relative cursor-pointer flex items-center px-0.5">
            <div 
              [class.translate-x-4]="store.volumeState().monoAudio"
              class="w-3.5 h-3.5 bg-white rounded-full transition-transform shadow"></div>
          </button>
        </div>
      </div>

      <!-- Active Visualizer Bar -->
      <div class="flex items-center justify-center gap-1 h-6 bg-[#161D26] rounded-xl px-3 border border-white/5">
        <span class="text-[10px] text-slate-400 mr-2">Audio Meter:</span>
        <div class="w-1.5 h-4 bg-emerald-500 rounded animate-pulse"></div>
        <div class="w-1.5 h-5 bg-emerald-400 rounded animate-pulse delay-75"></div>
        <div class="w-1.5 h-3 bg-emerald-500 rounded animate-pulse delay-100"></div>
        <div class="w-1.5 h-6 bg-amber-400 rounded animate-pulse delay-150"></div>
        <div class="w-1.5 h-2 bg-emerald-500 rounded animate-pulse"></div>
      </div>
    </div>
  `
})
export class PopupVolumeComponent {
  store = inject(ExtensionStoreService);

  updateVolume(event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    this.store.setVolumeLevel(val);
  }

  toggleBassBoost() {
    this.store.volumeState.update(s => ({ ...s, bassBoost: !s.bassBoost }));
  }

  toggleMono() {
    this.store.volumeState.update(s => ({ ...s, monoAudio: !s.monoAudio }));
  }
}
