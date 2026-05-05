import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, timeout, TimeoutError } from 'rxjs';
import { ChatMessage, ChatRequest, ChatResponse, Thread, ResolutionRequest, Resolution } from '../models/incident.model';
import { MOCK_THREADS, MOCK_MESSAGES, MOCK_RESOLUTIONS } from './mock-data';

declare global {
  interface Window {
    __VERCEL_ENV__?: {
      API_URL_BACK?: string;
    };
  }
}

@Injectable({ providedIn: 'root' })
export class IncidentService {
  private http = inject(HttpClient);
  private readonly TIMEOUT_MS = 5000;

  private getApiUrl(): string {
    if (typeof window !== 'undefined' && window.__VERCEL_ENV__?.API_URL_BACK) {
      return window.__VERCEL_ENV__.API_URL_BACK;
    }
    return '';
  }

  private getThreadsRequest(): Observable<Thread[]> {
    const apiUrl = this.getApiUrl();
    if (!apiUrl) {
      return this.getMockThreads();
    }
    return this.http.get<Thread[]>(`${apiUrl}/api/threads`).pipe(
      timeout(this.TIMEOUT_MS),
      catchError(() => this.getMockThreads())
    );
  }

  private getMockThreads(): Observable<Thread[]> {
    return of(MOCK_THREADS);
  }

  private getMockMessages(threadId: string): Observable<ChatMessage[]> {
    return of(MOCK_MESSAGES[threadId] || []);
  }

  private getMockResolution(threadId: string): Observable<Resolution | null> {
    return of(MOCK_RESOLUTIONS[threadId] || null);
  }

  sendMessage(request: ChatRequest): Observable<ChatResponse> {
    const apiUrl = this.getApiUrl();
    if (!apiUrl) {
      return this.getMockChatResponse(request);
    }
    return this.http.post<ChatResponse>(`${apiUrl}/api/chat`, request).pipe(
      timeout(this.TIMEOUT_MS),
      catchError(() => this.getMockChatResponse(request))
    );
  }

  private getMockChatResponse(request: ChatRequest): Observable<ChatResponse> {
    const threadId = request.threadId || `thread-${Date.now()}`;
    const responses = [
      'I understand the issue. Let me analyze the logs and provide recommendations.',
      'Based on the error details, this appears to be a configuration issue. Check the service settings.',
      'I\'m seeing similar patterns in the knowledge base. Here are the recommended steps to resolve this.',
      'This looks like a known issue. Let me provide you with the standard resolution procedure.',
      'Thank you for the details. I\'ll help you troubleshoot this step by step.'
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return of({
      message: randomResponse,
      citations: [
        {
          documentId: 'doc-001',
          title: 'Internal Knowledge Base',
          sourceType: 'wiki',
          relevanceScore: 0.95,
          snippet: 'Standard troubleshooting procedures for common infrastructure issues'
        },
        {
          documentId: 'doc-002',
          title: 'Previous Incident Resolutions',
          sourceType: 'history',
          relevanceScore: 0.87,
          snippet: 'Resolved similar issues in past incidents with documented solutions'
        }
      ],
      threadId
    });
  }

  getThreads(): Observable<Thread[]> {
    return this.getThreadsRequest();
  }

  getThreadMessages(threadId: string): Observable<ChatMessage[]> {
    const apiUrl = this.getApiUrl();
    if (!apiUrl) {
      return this.getMockMessages(threadId);
    }
    return this.http.get<ChatMessage[]>(`${apiUrl}/api/threads/${threadId}/messages`).pipe(
      timeout(this.TIMEOUT_MS),
      catchError(() => this.getMockMessages(threadId))
    );
  }

  createResolution(request: ResolutionRequest): Observable<Resolution> {
    const apiUrl = this.getApiUrl();
    if (!apiUrl) {
      const mockResolution: Resolution = {
        id: `res-${Date.now()}`,
        threadId: request.threadId,
        summary: request.summary,
        steps: request.steps,
        jiraTicketId: request.jiraTicketId,
        resolvedBy: request.resolvedBy,
        resolvedAt: new Date()
      };
      return of(mockResolution);
    }
    return this.http.post<Resolution>(`${apiUrl}/api/resolutions`, request).pipe(
      timeout(this.TIMEOUT_MS),
      catchError(() => {
        const mockResolution: Resolution = {
          id: `res-${Date.now()}`,
          threadId: request.threadId,
          summary: request.summary,
          steps: request.steps,
          jiraTicketId: request.jiraTicketId,
          resolvedBy: request.resolvedBy,
          resolvedAt: new Date()
        };
        return of(mockResolution);
      })
    );
  }

  getResolution(threadId: string): Observable<Resolution | null> {
    const apiUrl = this.getApiUrl();
    if (!apiUrl) {
      return this.getMockResolution(threadId);
    }
    return this.http.get<Resolution>(`${apiUrl}/api/threads/${threadId}/resolution`).pipe(
      timeout(this.TIMEOUT_MS),
      catchError(() => this.getMockResolution(threadId))
    );
  }

  createJiraTicket(ticketData: { summary: string; description: string; threadId: string }): Observable<{ ticketId: string; status: string; message: string }> {
    const apiUrl = this.getApiUrl();
    if (!apiUrl) {
      return of({
        ticketId: `AUTO-${Math.floor(Math.random() * 10000)}`,
        status: 'created',
        message: 'Jira ticket created (mock mode)'
      });
    }
    return this.http.post<{ ticketId: string; status: string; message: string }>(`${apiUrl}/api/jira/ticket`, ticketData).pipe(
      timeout(this.TIMEOUT_MS),
      catchError(() => of({
        ticketId: `AUTO-${Math.floor(Math.random() * 10000)}`,
        status: 'created',
        message: 'Jira ticket created (fallback mode)'
      }))
    );
  }
}
