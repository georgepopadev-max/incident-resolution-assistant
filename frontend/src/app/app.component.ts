import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './components/chat/chat.component';
import { ThreadSidebarComponent } from './components/thread-sidebar/thread-sidebar.component';
import { CitationCardComponent } from './components/citation-card/citation-card.component';
import { ResolutionFormComponent } from './components/resolution-form/resolution-form.component';
import { QuickActionsComponent } from './components/quick-actions/quick-actions.component';
import { ToastComponent } from './components/toast/toast.component';
import { Thread, ChatMessage, Citation } from './models/incident.model';
import { IncidentService } from './services/incident.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ChatComponent,
    ThreadSidebarComponent,
    CitationCardComponent,
    ResolutionFormComponent,
    QuickActionsComponent,
    ToastComponent
  ],
  template: `
    <app-toast></app-toast>
    <div class="app-container">
      <app-thread-sidebar
        (threadSelected)="onThreadSelected($event)">
      </app-thread-sidebar>
      
      <main class="main-content">
        <app-chat
          [messages]="messages()"
          [isLoading]="isLoading()"
          (messageSent)="onMessageSent($event)">
        </app-chat>
        
        <app-quick-actions
          [threadId]="selectedThreadId()"
          [hasActiveThread]="hasActiveThread()"
          (markResolved)="showResolutionForm.set(true)"
          (createJira)="onCreateJira()">
        </app-quick-actions>
        
        @if (currentCitations().length > 0) {
          <div class="citations-area">
            <h3>Sources</h3>
            <div class="citations-grid">
              @for (citation of currentCitations(); track citation.documentId) {
                <app-citation-card [citation]="citation"></app-citation-card>
              }
            </div>
          </div>
        }
      </main>
      
      @if (showResolutionForm()) {
        <app-resolution-form
          [threadId]="selectedThreadId()"
          (closed)="showResolutionForm.set(false)"
          (submitted)="onResolutionSubmitted()">
        </app-resolution-form>
      }
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
      background: #0d1117;
      color: #e6edf3;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 20px;
      overflow: hidden;
    }
    
    .citations-area {
      margin-top: 20px;
      padding: 16px;
      background: #161b22;
      border-radius: 8px;
      border: 1px solid #30363d;
    }
    
    .citations-area h3 {
      margin: 0 0 16px 0;
      font-size: 14px;
      font-weight: 600;
      color: #8b949e;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .citations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
    }
  `]
})
export class AppComponent {
  private incidentService = inject(IncidentService);
  
  // Signals for state
  threads = signal<Thread[]>([]);
  messages = signal<ChatMessage[]>([]);
  selectedThreadId = signal<string | null>(null);
  currentCitations = signal<Citation[]>([]);
  isLoading = signal(false);
  showResolutionForm = signal(false);
  hasActiveThread = computed(() => !!this.selectedThreadId());

  constructor() {
    this.loadThreads();
  }

  loadThreads(): void {
    this.incidentService.getThreads().subscribe({
      next: (threads) => this.threads.set(threads),
      error: (err) => console.error('Failed to load threads:', err)
    });
  }

  onThreadSelected(threadId: string): void {
    this.selectedThreadId.set(threadId);
    this.loadMessages(threadId);
  }

  loadMessages(threadId: string): void {
    this.incidentService.getThreadMessages(threadId).subscribe({
      next: (messages) => this.messages.set(messages),
      error: (err) => console.error('Failed to load messages:', err)
    });
  }

  onMessageSent(result: { message: string; citations: Citation[] }): void {
    this.currentCitations.set(result.citations);
  }

  onCreateJira(): void {
    console.log('Create Jira clicked');
  }

  onResolutionSubmitted(): void {
    this.showResolutionForm.set(false);
    this.loadThreads();
  }
}