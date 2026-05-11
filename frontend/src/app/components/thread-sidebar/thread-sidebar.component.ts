import { Component, Input, Output, EventEmitter, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentService } from '../../services/incident.service';
import { Thread } from '../../models/incident.model';

@Component({
  selector: 'app-thread-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>Incidents</h2>
        <span class="badge">{{ threads().length }}</span>
      </div>
      
      <div class="thread-list">
        @for (thread of threads(); track thread.id) {
          <div class="thread-item"
               [class.active]="thread.id === selectedThreadId()"
               [class.resolved]="thread.status === 'RESOLVED'"
               (click)="selectThread(thread)">
            <div class="thread-status">
              <span class="status-dot" [class]="thread.status.toLowerCase()"></span>
              <span class="status-label">{{ thread.status }}</span>
            </div>
            <div class="thread-title">{{ thread.title }}</div>
            <div class="thread-meta">
              <span class="thread-time">{{ formatTime(thread.createdAt) }}</span>
              @if (thread.category) {
                <span class="thread-category">{{ thread.category }}</span>
              }
            </div>
          </div>
        }
        
        @if (threads().length === 0) {
          <div class="empty-state">
            <p>No incidents yet</p>
            <p class="hint">Start a conversation to create your first incident thread</p>
          </div>
        }
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      background: #161b22;
      border-right: 1px solid #30363d;
      display: flex;
      flex-direction: column;
    }
    
    .sidebar-header {
      padding: 16px;
      border-bottom: 1px solid #30363d;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .sidebar-header h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
    
    .badge {
      background: #238636;
      color: white;
      font-size: 12px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 12px;
    }
    
    .thread-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }
    
    .thread-item {
      padding: 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.15s;
      margin-bottom: 4px;
    }
    
    .thread-item:hover {
      background: #21262d;
    }
    
    .thread-item.active {
      background: #388bfd20;
      border: 1px solid #388bfd40;
    }
    
    .thread-status {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 6px;
    }
    
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    
    .status-dot.active { background: #f85149; }
    .status-dot.resolved { background: #238636; }
    .status-dot.escalated { background: #f0883e; }
    
    .status-label {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #8b949e;
    }
    
    .thread-title {
      font-size: 14px;
      font-weight: 500;
      color: #e6edf3;
      margin-bottom: 4px;
      line-height: 1.4;
    }
    
    .thread-meta {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #8b949e;
    }
    
    .thread-category {
      background: #30363d;
      padding: 2px 6px;
      border-radius: 4px;
    }
    
    .empty-state {
      text-align: center;
      padding: 32px 16px;
      color: #8b949e;
    }
    
    .empty-state .hint {
      font-size: 12px;
      margin-top: 8px;
    }
    
    /* Responsive styles */
    @media (max-width: 768px) {
      .sidebar {
        width: 60px;
      }
      .sidebar-header h2,
      .thread-item .thread-title,
      .thread-item .thread-meta,
      .empty-state p {
        display: none;
      }
      .sidebar-header {
        justify-content: center;
        padding: 12px 8px;
      }
      .badge {
        font-size: 10px;
        padding: 2px 6px;
      }
      .thread-item {
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .thread-status {
        margin-bottom: 0;
      }
    }
  `]
})
export class ThreadSidebarComponent implements OnInit {
  threads = signal<Thread[]>([]);
  selectedThreadId = signal<string | null>(null);
  @Output() threadSelected = new EventEmitter<string>();

  private incidentService = inject(IncidentService);

  ngOnInit() {
    this.loadThreads();
  }

  loadThreads() {
    this.incidentService.getThreads().subscribe({
      next: (threads) => this.threads.set(threads),
      error: (err) => console.error('Failed to load threads:', err)
    });
  }

  selectThread(thread: Thread) {
    this.selectedThreadId.set(thread.id);
    this.threadSelected.emit(thread.id);
  }

  formatTime(date: Date | string): string {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  }
}
