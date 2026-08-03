import { Lead, TaskItem, ActivityLog, CampaignStat } from '../types';

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Sarah Miller',
    business: 'Miller Creative Agency',
    email: 'sarah@millercr.com',
    socialOrWeb: '/sarahm_biz',
    source: 'Facebook Ads',
    status: 'NEW',
    assignedDate: 'Oct 12, 2023',
    nextAction: {
      label: 'Tomorrow, 10 AM',
      type: 'event'
    },
    dealValue: 8500,
    priority: 'high',
    initials: 'SM',
    notes: 'Interested in website overhaul and brand strategy package.',
    touchpoints: [
      {
        id: 'tp-1',
        type: 'note',
        date: 'Oct 12, 2023',
        notes: 'Submitted contact form via Facebook Lead Form.',
        author: 'System'
      }
    ]
  },
  {
    id: 'lead-2',
    name: 'James Russo',
    business: 'Russo Fitness & Health',
    email: 'james@russofitness.com',
    phone: '+1 (555) 0123',
    socialOrWeb: 'Website Inquiry',
    source: 'Website',
    status: 'INTERESTED',
    assignedDate: 'Oct 10, 2023',
    contactedDate: 'Oct 11, 2023',
    nextAction: {
      label: 'Follow-up done',
      type: 'done'
    },
    dealValue: 4200,
    priority: 'medium',
    initials: 'JR',
    notes: 'Looking for local SEO and lead capture landing page.',
    touchpoints: [
      {
        id: 'tp-2',
        type: 'call',
        date: 'Oct 11, 2023',
        notes: 'Discovery call held. Wants proposal sent by Friday.',
        author: 'Ed Harrison'
      }
    ]
  },
  {
    id: 'lead-3',
    name: 'Karen Lee',
    business: 'Aesthetic Homes Inc.',
    email: 'karen.l@aesthetichomes.com',
    socialOrWeb: 'Messenger',
    source: 'Messenger',
    status: 'PROPOSAL SENT',
    assignedDate: 'Oct 08, 2023',
    contactedDate: 'Oct 09, 2023',
    nextAction: {
      label: 'Overdue (2d)',
      type: 'warning'
    },
    dealValue: 12000,
    priority: 'high',
    initials: 'KL',
    notes: 'Proposal sent on Oct 9 for $12k design audit & full revamp.',
    touchpoints: [
      {
        id: 'tp-3',
        type: 'email',
        date: 'Oct 09, 2023',
        notes: 'Sent formal PDF proposal and scope of work.',
        author: 'Ed Harrison'
      }
    ]
  },
  {
    id: 'lead-4',
    name: 'Tom Chen',
    business: 'Vertex Dynamics',
    email: 't.chen@vertex.io',
    socialOrWeb: 'Referral',
    source: 'Referral',
    status: 'WON',
    assignedDate: 'Oct 05, 2023',
    closedDate: 'Oct 12, 2023',
    nextAction: {
      label: 'Project Started',
      type: 'verified'
    },
    dealValue: 15500,
    priority: 'high',
    initials: 'TC',
    notes: 'Referred by Dave at Acme Corp. Contract signed Oct 12.',
    touchpoints: [
      {
        id: 'tp-4',
        type: 'meeting',
        date: 'Oct 12, 2023',
        notes: 'Kickoff meeting complete. Initial deposit received.',
        author: 'Ed Harrison'
      }
    ]
  },
  {
    id: 'lead-5',
    name: 'Anna Brooks',
    business: 'Brooks Boutique',
    email: 'anna@brooks.shop',
    socialOrWeb: 'Organic',
    source: 'Organic',
    status: 'CONTACTED',
    assignedDate: 'Oct 11, 2023',
    contactedDate: 'Oct 12, 2023',
    nextAction: {
      label: 'Waiting for reply',
      type: 'history'
    },
    dealValue: 3800,
    priority: 'low',
    initials: 'AB',
    notes: 'Inquired about Shopify custom store optimization.',
    touchpoints: [
      {
        id: 'tp-5',
        type: 'email',
        date: 'Oct 12, 2023',
        notes: 'Sent introduction email with portfolio samples.',
        author: 'Ed Harrison'
      }
    ]
  },
  {
    id: 'lead-6',
    name: 'Marcus Vance',
    business: 'Vance Capital Partners',
    email: 'marcus@vancecap.com',
    phone: '+1 (555) 0188',
    socialOrWeb: 'LinkedIn Direct',
    source: 'LinkedIn',
    status: 'NEW',
    assignedDate: 'Oct 12, 2023',
    nextAction: {
      label: 'Today, 2 PM',
      type: 'event'
    },
    dealValue: 18000,
    priority: 'high',
    initials: 'MV',
    notes: 'Wants full corporate web app build and ongoing maintenance.'
  },
  {
    id: 'lead-7',
    name: 'Elena Rostova',
    business: 'Rostova Legal Group',
    email: 'elena@rostovalaw.org',
    socialOrWeb: 'Google Search',
    source: 'Google Search',
    status: 'INTERESTED',
    assignedDate: 'Oct 07, 2023',
    contactedDate: 'Oct 08, 2023',
    nextAction: {
      label: 'Schedule Demo',
      type: 'event'
    },
    dealValue: 9200,
    priority: 'medium',
    initials: 'ER',
    notes: 'Needs client portal integration for document signing.'
  },
  {
    id: 'lead-8',
    name: 'David Patel',
    business: 'Nexus AI Tech',
    email: 'david@nexusai.io',
    socialOrWeb: 'Twitter / X',
    source: 'Facebook Ads',
    status: 'PROPOSAL SENT',
    assignedDate: 'Oct 06, 2023',
    contactedDate: 'Oct 07, 2023',
    nextAction: {
      label: 'Follow-up tomorrow',
      type: 'event'
    },
    dealValue: 14000,
    priority: 'high',
    initials: 'DP',
    notes: 'Requested AI assistant integration for customer support.'
  },
  {
    id: 'lead-9',
    name: 'Chloe Bennett',
    business: 'Lumina Glow Cosmetics',
    email: 'chloe@luminaglow.com',
    socialOrWeb: 'Instagram DM',
    source: 'Organic',
    status: 'WON',
    assignedDate: 'Sep 28, 2023',
    closedDate: 'Oct 04, 2023',
    nextAction: {
      label: 'Onboarding done',
      type: 'verified'
    },
    dealValue: 6500,
    priority: 'medium',
    initials: 'CB',
    notes: 'E-commerce growth package.'
  },
  {
    id: 'lead-10',
    name: 'Robert Sterling',
    business: 'Sterling Real Estate',
    email: 'robert@sterlingre.com',
    socialOrWeb: 'Cold Email Reply',
    source: 'Cold Email',
    status: 'LOST',
    assignedDate: 'Sep 20, 2023',
    closedDate: 'Oct 01, 2023',
    nextAction: {
      label: 'Budget mismatch',
      type: 'history'
    },
    dealValue: 5000,
    priority: 'low',
    initials: 'RS',
    notes: 'Chose an in-house hire instead.'
  }
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Call Sarah Miller regarding brand package details',
    leadId: 'lead-1',
    leadName: 'Sarah Miller',
    dueDate: 'Today',
    completed: false,
    priority: 'high',
    category: 'Call'
  },
  {
    id: 'task-2',
    title: 'Follow up on Karen Lee proposal ($12,000)',
    leadId: 'lead-3',
    leadName: 'Karen Lee',
    dueDate: 'Overdue (2d)',
    completed: false,
    priority: 'high',
    category: 'Proposal'
  },
  {
    id: 'task-3',
    title: 'Send welcome packet to Tom Chen',
    leadId: 'lead-4',
    leadName: 'Tom Chen',
    dueDate: 'Tomorrow',
    completed: true,
    priority: 'medium',
    category: 'Email'
  },
  {
    id: 'task-4',
    title: 'Review Facebook Ads campaign budget allocation',
    dueDate: 'Oct 15, 2023',
    completed: false,
    priority: 'medium',
    category: 'Review'
  },
  {
    id: 'task-5',
    title: 'Schedule discovery call with Marcus Vance',
    leadId: 'lead-6',
    leadName: 'Marcus Vance',
    dueDate: 'Today',
    completed: false,
    priority: 'high',
    category: 'Meeting'
  }
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-1',
    timestamp: '10 minutes ago',
    user: 'Ed Harrison',
    action: 'updated status of Tom Chen to',
    target: 'WON',
    type: 'status_change'
  },
  {
    id: 'act-2',
    timestamp: '1 hour ago',
    user: 'Facebook Ads',
    action: 'captured new lead',
    target: 'Sarah Miller (Miller Creative Agency)',
    type: 'new_lead'
  },
  {
    id: 'act-3',
    timestamp: '3 hours ago',
    user: 'Ed Harrison',
    action: 'sent email proposal to',
    target: 'Karen Lee (Aesthetic Homes Inc.)',
    type: 'email_sent'
  },
  {
    id: 'act-4',
    timestamp: 'Yesterday',
    user: 'Ed Harrison',
    action: 'logged call with',
    target: 'James Russo',
    type: 'note_added'
  }
];

export const CAMPAIGN_STATS: CampaignStat[] = [
  {
    channel: 'Facebook Ads',
    leadsThisMonth: 54,
    conversionRate: 28.2,
    totalRevenue: 22400,
    qualityScore: 9.2,
    costPerLead: 24.5,
    trend: '+40% higher lead quality this week'
  },
  {
    channel: 'Website',
    leadsThisMonth: 32,
    conversionRate: 22.0,
    totalRevenue: 12600,
    qualityScore: 8.5,
    costPerLead: 0.0,
    trend: '+12% organic form completions'
  },
  {
    channel: 'Referral',
    leadsThisMonth: 18,
    conversionRate: 45.0,
    totalRevenue: 24800,
    qualityScore: 9.8,
    costPerLead: 0.0,
    trend: 'Highest closing rate channel'
  },
  {
    channel: 'Messenger',
    leadsThisMonth: 14,
    conversionRate: 18.5,
    totalRevenue: 7800,
    qualityScore: 7.1,
    costPerLead: 12.0,
    trend: 'Fastest first-contact response time'
  },
  {
    channel: 'Organic',
    leadsThisMonth: 10,
    conversionRate: 15.0,
    totalRevenue: 3800,
    qualityScore: 6.9,
    costPerLead: 0.0,
    trend: 'Steady trickle from blog articles'
  }
];
