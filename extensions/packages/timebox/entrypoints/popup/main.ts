import { onStorageChange, storageGet, storageSet } from '@qeloma/shared';

interface TimeboxTask {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: 'work' | 'focus' | 'break' | 'review';
  completed: boolean;
}

const STORAGE_KEY = 'timebox_tasks';
const CATEGORY_COLORS: Record<TimeboxTask['category'], string> = {
  work: '#38bdf8',
  focus: '#a78bfa',
  break: '#34d399',
  review: '#fbbf24',
};

const app = document.getElementById('app')!;

let tasks: TimeboxTask[] = [];

function minutesSinceMidnight(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function nowMinutes(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function formatCountdown(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

async function loadTasks(): Promise<void> {
  tasks = await storageGet<TimeboxTask[]>(STORAGE_KEY, []);
}

async function persistTasks(): Promise<void> {
  await storageSet(STORAGE_KEY, tasks);
}

function activeTask(): TimeboxTask | null {
  const nowM = nowMinutes();
  return (
    tasks.find((t) => !t.completed && minutesSinceMidnight(t.startTime) <= nowM && nowM < minutesSinceMidnight(t.endTime)) ??
    null
  );
}

function render(): void {
  const sorted = [...tasks].sort((a, b) => minutesSinceMidnight(a.startTime) - minutesSinceMidnight(b.startTime));
  const active = activeTask();
  const now = new Date();
  const clock = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  app.innerHTML = `
    <header>
      <h1>Qeloma Timebox</h1>
      <div class="clock">${clock}</div>
    </header>
    ${active ? `<div class="countdown" id="countdown"></div>` : ''}
    <div class="task-list">
      ${
        sorted.length === 0
          ? `<div class="empty">No blocks planned yet.<br/>Add your first time block below.</div>`
          : sorted
              .map(
                (t) => `
        <div class="task-card ${t.completed ? 'completed' : ''} ${active?.id === t.id ? 'active' : ''}" style="--cat-color:${CATEGORY_COLORS[t.category]}" data-id="${t.id}">
          <input type="checkbox" class="toggle" ${t.completed ? 'checked' : ''} />
          <div>
            <div class="task-time">${t.startTime}–${t.endTime}</div>
            <div class="task-title">${escapeHtml(t.title)}</div>
          </div>
          <div class="task-actions"><button class="delete">✕</button></div>
        </div>`,
              )
              .join('')
      }
    </div>
    <form class="add-form" id="add-form">
      <input class="title-field" name="title" placeholder="Block title" required />
      <input type="time" name="startTime" required />
      <input type="time" name="endTime" required />
      <select name="category">
        <option value="work">Work</option>
        <option value="focus">Focus</option>
        <option value="break">Break</option>
        <option value="review">Review</option>
      </select>
      <button type="submit">Add block</button>
    </form>
  `;

  app.querySelectorAll<HTMLInputElement>('.toggle').forEach((el) => {
    el.addEventListener('change', async () => {
      const id = el.closest<HTMLElement>('.task-card')!.dataset.id!;
      const task = tasks.find((t) => t.id === id);
      if (task) {
        task.completed = el.checked;
        await persistTasks();
        render();
      }
    });
  });

  app.querySelectorAll<HTMLButtonElement>('.delete').forEach((el) => {
    el.addEventListener('click', async () => {
      const id = el.closest<HTMLElement>('.task-card')!.dataset.id!;
      tasks = tasks.filter((t) => t.id !== id);
      await persistTasks();
      render();
    });
  });

  document.getElementById('add-form')!.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const task: TimeboxTask = {
      id: crypto.randomUUID(),
      title: String(data.get('title')),
      startTime: String(data.get('startTime')),
      endTime: String(data.get('endTime')),
      category: data.get('category') as TimeboxTask['category'],
      completed: false,
    };
    tasks.push(task);
    await persistTasks();
    form.reset();
    render();
  });

  if (active) startCountdown(active);
}

function escapeHtml(value: string): string {
  const div = document.createElement('div');
  div.textContent = value;
  return div.innerHTML;
}

let countdownInterval: ReturnType<typeof setInterval> | undefined;

function startCountdown(task: TimeboxTask): void {
  const el = document.getElementById('countdown');
  if (!el) return;
  clearInterval(countdownInterval);
  const update = () => {
    const endMs = new Date();
    const [h, m] = task.endTime.split(':').map(Number);
    endMs.setHours(h, m, 0, 0);
    const remaining = Math.max(0, Math.floor((endMs.getTime() - Date.now()) / 1000));
    el.textContent = `“${task.title}” ends in ${formatCountdown(remaining)}`;
    if (remaining <= 0) clearInterval(countdownInterval);
  };
  update();
  countdownInterval = setInterval(update, 1000);
}

onStorageChange(STORAGE_KEY, async () => {
  await loadTasks();
  render();
});

loadTasks().then(render);
