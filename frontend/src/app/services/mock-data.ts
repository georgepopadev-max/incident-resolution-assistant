import { Thread, ChatMessage, Resolution } from '../models/incident.model';

export const MOCK_THREADS: Thread[] = [
  {
    id: 'thread-001',
    title: 'Database connection timeout in production',
    status: 'RESOLVED',
    category: 'Database',
    createdAt: new Date('2026-05-01T10:30:00Z'),
    resolvedAt: new Date('2026-05-01T14:45:00Z')
  },
  {
    id: 'thread-002',
    title: 'API gateway returning 502 Bad Gateway',
    status: 'ACTIVE',
    category: 'Infrastructure',
    createdAt: new Date('2026-05-03T09:15:00Z'),
    resolvedAt: null
  },
  {
    id: 'thread-003',
    title: 'Memory leak in user authentication service',
    status: 'ESCALATED',
    category: 'Performance',
    createdAt: new Date('2026-05-04T16:20:00Z'),
    resolvedAt: null
  },
  {
    id: 'thread-004',
    title: 'SSL certificate expiration warning',
    status: 'RESOLVED',
    category: 'Security',
    createdAt: new Date('2026-05-02T08:00:00Z'),
    resolvedAt: new Date('2026-05-02T08:30:00Z')
  }
];

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  'thread-001': [
    {
      id: 'msg-001-1',
      role: 'USER',
      content: 'Getting frequent connection timeouts on the main PostgreSQL database. Error: "connection timeout exceeded 30s"',
      citations: '',
      createdAt: new Date('2026-05-01T10:30:00Z')
    },
    {
      id: 'msg-001-2',
      role: 'ASSISTANT',
      content: 'Based on the error, this appears to be a connection pool exhaustion issue. Let me check the current pool configuration and active connections.',
      citations: 'DB Config Docs: Connection Pool Settings',
      createdAt: new Date('2026-05-01T10:31:00Z')
    },
    {
      id: 'msg-001-3',
      role: 'USER',
      content: 'The pool is set to max 100 connections. We have about 95 active. Monitoring shows spikes to 200+ during peak hours.',
      citations: '',
      createdAt: new Date('2026-05-01T10:35:00Z')
    },
    {
      id: 'msg-001-4',
      role: 'ASSISTANT',
      content: 'The pool size is insufficient for peak load. Recommended actions: 1) Increase max connections to 200, 2) Add connection timeout of 10s, 3) Implement query timeout of 30s, 4) Add PgBouncer for connection pooling.',
      citations: 'PostgreSQL Performance Guide; AWS RDS Best Practices',
      createdAt: new Date('2026-05-01T10:40:00Z')
    },
    {
      id: 'msg-001-5',
      role: 'USER',
      content: 'Applied the changes. Connection pool now set to 200, timeouts configured. Monitoring for 30 minutes.',
      citations: '',
      createdAt: new Date('2026-05-01T11:15:00Z')
    },
    {
      id: 'msg-001-6',
      role: 'ASSISTANT',
      content: 'Metrics look good. Active connections now stable at 120-150 during peak. No timeouts in the last 30 minutes. Consider adding read replicas to further distribute load.',
      citations: 'CloudWatch Metrics; RDS Performance Insights',
      createdAt: new Date('2026-05-01T11:50:00Z')
    }
  ],
  'thread-002': [
    {
      id: 'msg-002-1',
      role: 'USER',
      content: 'API gateway is returning 502 errors intermittently. About 10% of requests fail.',
      citations: '',
      createdAt: new Date('2026-05-03T09:15:00Z')
    },
    {
      id: 'msg-002-2',
      role: 'ASSISTANT',
      content: '502 Bad Gateway typically indicates backend service issues. Let me check which upstream services are failing health checks.',
      citations: 'API Gateway Troubleshooting Guide',
      createdAt: new Date('2026-05-03T09:16:00Z')
    },
    {
      id: 'msg-002-3',
      role: 'USER',
      content: 'User service health check failing. Container crashed due to OOM.',
      citations: '',
      createdAt: new Date('2026-05-03T09:20:00Z')
    }
  ],
  'thread-003': [
    {
      id: 'msg-003-1',
      role: 'USER',
      content: 'User authentication service memory usage growing unbounded. Started at 512MB, now at 4GB after 48 hours. Service requires restart.',
      citations: '',
      createdAt: new Date('2026-05-04T16:20:00Z')
    },
    {
      id: 'msg-003-2',
      role: 'ASSISTANT',
      content: 'This is a classic memory leak pattern. Common causes in Node.js: 1) Event listener accumulation, 2) Closure references, 3) Cached data without eviction, 4) Timer leakage.',
      citations: 'Node.js Memory Leak Debugging; Heap Snapshot Analysis Guide',
      createdAt: new Date('2026-05-04T16:22:00Z')
    },
    {
      id: 'msg-003-3',
      role: 'USER',
      content: 'Heap dump shows大量Closure objects and some Timer objects. Not sure which endpoint is causing it.',
      citations: '',
      createdAt: new Date('2026-05-04T16:30:00Z')
    },
    {
      id: 'msg-003-4',
      role: 'ASSISTANT',
      content: 'The timer references combined with closures often point to retry logic or polling endpoints not properly clearing timers. Check for setInterval without clearInterval in error paths. This needs escalation to the core team for detailed heap analysis.',
      citations: 'Node.js Memory Profiling; Timer Best Practices',
      createdAt: new Date('2026-05-04T16:35:00Z')
    }
  ],
  'thread-004': [
    {
      id: 'msg-004-1',
      role: 'USER',
      content: 'SSL certificate for api.example.com expires in 7 days. Need to renew.',
      citations: '',
      createdAt: new Date('2026-05-02T08:00:00Z')
    },
    {
      id: 'msg-004-2',
      role: 'ASSISTANT',
      content: 'SSL certificate renewal is straightforward. Using Let\'s Encrypt with auto-renewal enabled. Run: certbot renew',
      citations: 'Certbot Documentation; SSL Renewal Process',
      createdAt: new Date('2026-05-02T08:05:00Z')
    },
    {
      id: 'msg-004-3',
      role: 'USER',
      content: 'Renewal successful. Certificate now valid for 90 more days. Auto-renewal cron job confirmed.',
      citations: '',
      createdAt: new Date('2026-05-02T08:25:00Z')
    }
  ]
};

export const MOCK_RESOLUTIONS: Record<string, Resolution> = {
  'thread-001': {
    id: 'res-001',
    threadId: 'thread-001',
    summary: 'Database connection pool exhaustion resolved by increasing max connections and adding connection timeouts',
    steps: '1. Increased PostgreSQL max_connections from 100 to 200\n2. Added connection timeout of 10 seconds\n3. Implemented query timeout of 30 seconds\n4. Configured PgBouncer for connection pooling\n5. Deployed and monitored for 24 hours',
    jiraTicketId: 'DB-1234',
    resolvedBy: 'DevOps Team',
    resolvedAt: new Date('2026-05-01T14:45:00Z')
  },
  'thread-004': {
    id: 'res-004',
    threadId: 'thread-004',
    summary: 'SSL certificate renewed successfully with auto-renewal enabled',
    steps: '1. Verified certificate expiration date\n2. Ran certbot renew command\n3. Verified new certificate installation\n4. Confirmed auto-renewal cron job is active\n5. Set up monitoring alert for future renewals',
    jiraTicketId: 'SEC-567',
    resolvedBy: 'Security Team',
    resolvedAt: new Date('2026-05-02T08:30:00Z')
  }
};
