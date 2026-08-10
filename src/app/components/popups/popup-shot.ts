import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-popup-shot',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#11161C] text-slate-100 p-4 w-80 rounded-2xl shadow-2xl border border-white/10 font-sans">
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-[#C0532E]/20 text-[#C0532E] flex items-center justify-center">
            <mat-icon>photo_camera</mat-icon>
          </div>
          <div>
            <h3 class="font-bold text-sm text-white leading-tight">Qeloma Shot</h3>
            <span class="text-[10px] text-slate-400">v1.0.0 · Screen Capture</span>
          </div>
        </div>
        <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">Green Tier</span>
      </div>

      <!-- Mode Selector -->
      <div class="space-y-2 mb-4">
        <button 
          (click)="triggerCapture('visible')"
          class="w-full p-2.5 rounded-xl border border-white/10 bg-[#161D26] hover:bg-[#C0532E] hover:border-[#C0532E] text-left cursor-pointer transition-all flex items-center gap-3 group">
          <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 group-hover:text-white">
            <mat-icon>crop_free</mat-icon>
          </div>
          <div>
            <div class="font-bold text-xs text-white">Visible Screen</div>
            <div class="text-[10px] text-slate-400 group-hover:text-white/80">Capture current viewport instantly</div>
          </div>
        </button>

        <button 
          (click)="triggerCapture('region')"
          class="w-full p-2.5 rounded-xl border border-white/10 bg-[#161D26] hover:bg-[#C0532E] hover:border-[#C0532E] text-left cursor-pointer transition-all flex items-center gap-3 group">
          <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 group-hover:text-white">
            <mat-icon>fit_screen</mat-icon>
          </div>
          <div>
            <div class="font-bold text-xs text-white">Select Region</div>
            <div class="text-[10px] text-slate-400 group-hover:text-white/80">Drag rectangular cropping handles</div>
          </div>
        </button>

        <button 
          (click)="triggerCapture('fullpage')"
          class="w-full p-2.5 rounded-xl border border-white/10 bg-[#161D26] hover:bg-[#C0532E] hover:border-[#C0532E] text-left cursor-pointer transition-all flex items-center gap-3 group">
          <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 group-hover:text-white">
            <mat-icon>vertical_align_bottom</mat-icon>
          </div>
          <div>
            <div class="font-bold text-xs text-white">Full Page Scroll</div>
            <div class="text-[10px] text-slate-400 group-hover:text-white/80">Auto-scroll & stitch entire document</div>
          </div>
        </button>
      </div>

      <!-- Captured Status Preview -->
      @if (store.shotState().capturedImage) {
        <div class="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl mb-3">
          <div class="flex items-center justify-between text-xs text-emerald-300 mb-2">
            <span class="flex items-center gap-1 font-semibold">
              <mat-icon class="text-sm">check_circle</mat-icon> Captured!
            </span>
            <span class="text-[10px] font-mono text-emerald-400">1920x1080</span>
          </div>
          <div class="flex gap-2">
            <button 
              (click)="downloadImage()"
              class="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 cursor-pointer">
              <mat-icon class="text-sm">download</mat-icon> Save PNG
            </button>
            <button 
              (click)="copyImage()"
              class="py-1.5 px-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 cursor-pointer">
              <mat-icon class="text-sm">content_copy</mat-icon> Copy
            </button>
          </div>
        </div>
      }

      <div class="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
        <mat-icon class="text-sm">lock</mat-icon>
        <span>Zero server upload · 100% local canvas</span>
      </div>
    </div>
  `
})
export class PopupShotComponent {
  store = inject(ExtensionStoreService);

  triggerCapture(mode: 'visible' | 'region' | 'fullpage') {
    this.store.shotState.update(s => ({
      ...s,
      mode,
      capturedImage: `captured-mock-${mode}-${Date.now()}.png`
    }));
  }

  downloadImage() {
    alert('Bro, screenshot saved to your local downloads folder!');
  }

  copyImage() {
    alert('Bro, screenshot copied to clipboard!');
  }
}
