import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-popup-timebox',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#11161C] text-slate-100 p-4 w-80 rounded-2xl shadow-2xl border border-white/10 font-sans">
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <mat-icon>calendar_view_day</mat-icon>
          </div>
          <div>
            <h3 class="font-bold text-sm text-white leading-tight">Qeloma Timebox</h3>
            <span class="text-[10px] text-slate-400">v1.0.0 · Visual Grid Planner</span>
          </div>
        </div>
        <span class="text-xs font-mono bg-white/5 px-2 py-0.5 rounded text-slate-300">Today</span>
      </div>

      <!-- Timebox List -->
      <div class="space-y-2 mb-4 max-h-56 overflow-y-auto pr-1">
        @for (task of store.timeboxTasks(); track task.id) {
          <div 
            [class.line-through]="task.completed"
            [class.opacity-60]="task.completed"
            class="p-2.5 rounded-xl bg-[#161D26] border border-white/5 flex items-center justify-between gap-2 text-xs">
            <div class="flex items-center gap-2">
              <button 
                (click)="toggleTask(task.id)"
                class="w-4 h-4 rounded border border-white/30 flex items-center justify-center cursor-pointer hover:border-emerald-400">
                @if (task.completed) {
                  <mat-icon class="text-xs text-emerald-400">check</mat-icon>
                }
              </button>
              <div>
                <div class="font-medium text-slate-100">{{ task.title }}</div>
                <div class="text-[10px] text-slate-400 font-mono">{{ task.startTime }} - {{ task.endTime }}</div>
              </div>
            </div>
            <span class="w-2 h-2 rounded-full" [style.backgroundColor]="task.color"></span>
          </div>
        }
      </div>

      <button 
        (click)="addNewTimeboxBlock()"
        class="w-full py-2 bg-[#C0532E] hover:bg-[#a04223] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all">
        <mat-icon class="text-sm">add</mat-icon>
        <span>Add Timebox Block</span>
      </button>
    </div>
  `
})
export class PopupTimeboxComponent {
  store = inject(ExtensionStoreService);

  toggleTask(id: string) {
    this.store.timeboxTasks.update(list =>
      list.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  }

  addNewTimeboxBlock() {
    const title = prompt('Enter task name:', 'Deep Code Review');
    if (!title) return;
    const newTask = {
      id: String(Date.now()),
      title,
      startTime: '16:30',
      endTime: '17:30',
      category: 'focus' as const,
      completed: false,
      color: '#C0532E'
    };
    this.store.timeboxTasks.update(list => [...list, newTask]);
  }
}
