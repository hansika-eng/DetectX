import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const API_BASE = "http://localhost:5000";

const DetectXLogo = () => (
  <span className="logo-mark" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 3L18 5.6V11.1C18 15.2 15.5 18.9 12 20.4C8.5 18.9 6 15.2 6 11.1V5.6L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M9.3 11.8L11.1 13.6L14.8 9.9" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  </span>
);

const navItems = [
  "Overview",
  "Detection",
  "Behavioral Analysis",
  "Network Graph",
  "Analytics",
  "Reports",
];

const featureCards = [
  {
    title: "Behavioral AI Detection",
    description:
      "Analyze user behavior patterns with deep learning to identify anomalous activity.",
    icon: "◐",
  },
  {
    title: "Graph-Based Fraud Detection",
    description:
      "Map social connections to uncover fake clusters and coordinated fraud networks.",
    icon: "⌘",
  },
  {
    title: "Real-time Risk Scoring",
    description:
      "Instant risk assessment with dynamic scoring that adapts to evolving fraud techniques.",
    icon: "∿",
  },
  {
    title: "Explainable Machine Learning",
    description:
      "Transparent AI decisions with clear feature attribution for every detection.",
    icon: "◫",
  },
  {
    title: "Fraud Analytics",
    description:
      "Comprehensive analytics dashboard to track fraud trends and detection accuracy over time.",
    icon: "◍",
  },
];

const fallbackRealtime = {
  overview: {
    total_scans: 24831,
    fake_detected: 3492,
    active_alerts: 47,
    accuracy: 97.3,
    distribution: { genuine: 76, suspicious: 14, fake: 10 },
    recent_alerts: [
      { user: "@ghost_net_42", type: "Bot Network", risk: 94 },
      { user: "@fake_influencer", type: "Fake Engagement", risk: 87 },
      { user: "@spam_cluster_7", type: "Coordinated Spam", risk: 91 },
      { user: "@clone_account_x", type: "Clone Account", risk: 78 },
    ],
  },
  detection_trend: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    real: [2400, 2200, 2600, 2800, 2500, 2900, 3100],
    fake: [500, 580, 690, 540, 820, 760, 910],
  },
  behavioral: {
    activity_24h: [45, 52, 120, 128, 98, 82, 26, 18, 54, 69, 20, 41, 17, 20, 22, 74, 19, 62, 14, 28, 16, 43, 12],
    weekly_engagement: [420, 380, 450, 520, 390, 260, 310],
    weekly_suspicious: [38, 41, 36, 45, 48, 51, 47],
    signals: [
      { label: "Posting during non-human hours", score: 92, level: "critical" },
      { label: "Identical message patterns", score: 88, level: "critical" },
      { label: "Abnormal follower growth spike", score: 74, level: "medium" },
      { label: "Low engagement despite high activity", score: 68, level: "medium" },
      { label: "Repetitive link sharing", score: 45, level: "low" },
    ],
  },
  network: {
    nodes: [
      { x: 8, y: 56, size: 3, type: "genuine" },
      { x: 12, y: 24, size: 4, type: "genuine" },
      { x: 22, y: 28, size: 6, type: "genuine" },
      { x: 29, y: 47, size: 5, type: "genuine" },
      { x: 48, y: 39, size: 5, type: "genuine" },
      { x: 86, y: 49, size: 6, type: "genuine" },
      { x: 44, y: 29, size: 4, type: "suspicious" },
      { x: 58, y: 52, size: 5, type: "suspicious" },
      { x: 71, y: 56, size: 5, type: "suspicious" },
    ],
    clusters: [
      { title: "Bot Network Alpha", meta: "47 nodes · Bot Farm", risk: 94 },
      { title: "Fake Influencer Ring", meta: "23 nodes · Coordinated", risk: 87 },
      { title: "Spam Cluster C", meta: "156 nodes · Spam Network", risk: 91 },
      { title: "Clone Group X", meta: "12 nodes · Clone Accounts", risk: 72 },
    ],
    connections: [
      { from: "user_a1", to: "user_b3", strength: 90 },
      { from: "user_b3", to: "user_c7", strength: 85 },
      { from: "user_c7", to: "user_a1", strength: 92 },
      { from: "user_d2", to: "user_e5", strength: 70 },
      { from: "user_e5", to: "user_f8", strength: 65 },
    ],
  },
  analytics: {
    total_analyzed: 142567,
    detection_rate: 96.8,
    regions: 47,
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    detected: [410, 560, 390, 640, 360, 720, 580, 470, 790, 740, 530, 660],
    growth: [490, 430, 360, 440, 460, 570, 490, 560, 540, 780, 760, 520],
    risk_distribution: { low: 45, medium: 30, high: 25 },
    fraud_categories: {
      Bots: 340,
      Clones: 220,
      Spam: 180,
      "Fake Influencer": 150,
      Scam: 120,
    },
  },
};

const fallbackReports = [
  {
    title: "MUST: Daily Fraud Risk Snapshot",
    meta: "Required summary · Auto generated",
    status: "Ready",
  },
  {
    title: "Monthly Fraud Summary - Jan 2026",
    meta: "Jan 31, 2026 · 1,240 accounts",
    status: "Ready",
  },
  {
    title: "Bot Network Analysis Report",
    meta: "Feb 10, 2026 · 347 accounts",
    status: "Ready",
  },
  {
    title: "High-Risk Account Audit",
    meta: "Feb 18, 2026 · 89 accounts",
    status: "Processing",
  },
  {
    title: "Q4 2025 Fraud Trends",
    meta: "Dec 31, 2025 · 5,420 accounts",
    status: "Ready",
  },
];

const reportTypeOptions = [
  {
    title: "Daily Fraud Risk Snapshot",
    description: "Daily cross-platform risk profile with top anomalies and urgent signals.",
  },
  {
    title: "Bot Network Analysis",
    description: "Graph analysis of coordinated automated behavior and bot communities.",
  },
  {
    title: "Fake Influencer Detection",
    description: "Engagement authenticity review for influencer-like suspicious accounts.",
  },
  {
    title: "Custom Fraud Investigation",
    description: "Analyst-led investigation template for targeted fraud scenarios.",
  },
];

const reportProcessingStages = [
  "Collecting data",
  "Behaviour analysis",
  "Graph-based fraud detection",
  "Generating insights",
];

const insightTemplates = {
  abnormalTiming: [
    "Abnormal activity timing detected: posting concentration peaked at {value}% between 01:00–04:00.",
    "Session timing pattern is non-human: {value}% of actions occurred during low-activity hours.",
    "Temporal anomaly identified: repeated bursts across midnight windows with {value}% irregular timing score.",
  ],
  followerClusters: [
    "Suspicious follower clusters found: {value} tightly connected accounts with near-identical follow paths.",
    "Cluster analysis detected {value} followers in high-similarity communities linked to inorganic growth.",
    "Follower graph indicates {value} coordinated nodes with elevated mutual-link density.",
  ],
  lowEngagement: [
    "Low engagement anomaly observed: engagement rate is {value}% below expected baseline.",
    "Interaction-to-reach mismatch detected with a {value}% engagement deficit versus peer cohorts.",
    "Audience quality signal is weak: authentic engagement falls short by {value}% for this profile class.",
  ],
  coordinatedBot: [
    "Coordinated bot behaviour likely: {value} synchronized posting sequences match automation signatures.",
    "Automation fingerprint detected across {value} linked accounts with repeated content timing overlap.",
    "Graph-based fraud model flagged {value} coordinated behaviours consistent with bot orchestration.",
  ],
};

const reportCategoryDefinitions = [
  { emoji: "🚨", label: "High Risk Alerts" },
  { emoji: "🤖", label: "Bot Network Reports" },
  { emoji: "📊", label: "Engagement Fraud" },
  { emoji: "📉", label: "Trend Analysis" },
  { emoji: "🧠", label: "Behavioral Insights" },
  { emoji: "🌍", label: "Regional Risk Reports" },
];

const reportExportOptions = ["PDF", "Excel", "CSV", "Share link", "Email to stakeholders"];

const getRiskBand = (score) => {
  if (score >= 85) return "High";
  if (score >= 65) return "Medium";
  return "Low";
};

const parseReportDate = (meta, fallback = new Date()) => {
  if (!meta) return fallback;
  const dateMatch = meta.match(/([A-Za-z]{3,9}\s\d{1,2},\s\d{4})/);
  if (!dateMatch) return fallback;
  const parsed = new Date(dateMatch[1]);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
};

const inferReportCategory = (title, riskScore) => {
  const lower = title.toLowerCase();
  if (riskScore >= 90 || lower.includes("high-risk") || lower.includes("alert")) return "High Risk Alerts";
  if (lower.includes("bot") || lower.includes("network")) return "Bot Network Reports";
  if (lower.includes("engagement") || lower.includes("influencer")) return "Engagement Fraud";
  if (lower.includes("trend") || lower.includes("monthly") || lower.includes("q")) return "Trend Analysis";
  if (lower.includes("behavior") || lower.includes("custom") || lower.includes("snapshot")) {
    return "Behavioral Insights";
  }
  if (lower.includes("region") || lower.includes("geo")) return "Regional Risk Reports";
  return "Behavioral Insights";
};

const inferReportType = (title) => {
  const lower = title.toLowerCase();
  if (lower.includes("daily") || lower.includes("snapshot")) return "Daily Fraud Risk Snapshot";
  if (lower.includes("bot") || lower.includes("network")) return "Bot Network Analysis";
  if (lower.includes("influencer") || lower.includes("engagement")) return "Fake Influencer Detection";
  return "Custom Fraud Investigation";
};

const inferFraudCategory = (title) => {
  const lower = title.toLowerCase();
  if (lower.includes("bot")) return "Bot Network";
  if (lower.includes("influencer") || lower.includes("engagement")) return "Engagement Fraud";
  if (lower.includes("trend") || lower.includes("summary")) return "Trend Fraud";
  if (lower.includes("behavior")) return "Behavioral Fraud";
  return "General Fraud";
};

const buildReportEnrichment = (report) => {
  const seed = Math.abs(hashString(`${report.title}|${report.meta || ""}|${report.id || ""}`));
  const createdAt = parseReportDate(report.meta, new Date(Date.now() - (seed % 35) * 86400000));
  const riskScore = clamp(58 + (seed % 40), 50, 97);
  const riskLevel = getRiskBand(riskScore);
  const severity = getSeverityByRisk(riskScore);
  const confidence = Number((82 + (seed % 170) / 10).toFixed(1));
  const region = riskRegions[seed % riskRegions.length];
  const reportType = inferReportType(report.title);
  const fraudCategory = inferFraudCategory(report.title);
  const reportCategory = inferReportCategory(report.title, riskScore);

  const riskDistribution = {
    low: clamp(18 + (seed % 28), 10, 55),
    medium: clamp(24 + ((seed >> 2) % 30), 18, 52),
    high: 0,
  };
  riskDistribution.high = Math.max(8, 100 - riskDistribution.low - riskDistribution.medium);

  const topSuspiciousAccounts = Array.from({ length: 4 }, (_, index) => ({
    handle: `@risk_${(seed + index * 29).toString(36).slice(-4)}`,
    risk: clamp(riskScore + 3 + index * 2, 55, 99),
    reason: ["Bot overlap", "Engagement mismatch", "Timing anomaly", "Cluster linkage"][index],
  }));

  const featureImportance = [
    { label: "Posting cadence anomaly", score: clamp(62 + (seed % 24), 42, 95) },
    { label: "Follower graph density", score: clamp(56 + ((seed >> 2) % 28), 35, 95) },
    { label: "Engagement authenticity", score: clamp(48 + ((seed >> 3) % 36), 30, 94) },
    { label: "Content similarity score", score: clamp(53 + ((seed >> 4) % 30), 32, 93) },
  ];

  const behaviorPatterns = [
    "Spike in off-hours activity windows",
    "Repeated phrase templates across posts",
    "Synchronized interactions from linked accounts",
    "Follower quality deviation from benchmark",
  ];

  return {
    createdAt: createdAt.toISOString(),
    riskScore,
    riskLevel,
    severity,
    confidence,
    region,
    reportType,
    fraudCategory,
    reportCategory,
    riskDistribution,
    topSuspiciousAccounts,
    featureImportance,
    behaviorPatterns,
    fraudSummary:
      `${report.title} indicates elevated ${riskLevel.toLowerCase()}-to-high fraud signatures in ${region}. ` +
      `Primary drivers are graph anomalies, behavioral drift, and coordinated engagement clusters.`,
  };
};

const createReportId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const hashString = (text = "") =>
  Array.from(text).reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);

const selectTemplate = (templates, seed) => {
  const index = Math.abs(seed) % templates.length;
  return templates[index];
};

const generateInsightsForReport = (report, seedText = "") => {
  const seed = hashString(`${seedText}|${report.title}|${report.meta || ""}`);
  const timingScore = 62 + (Math.abs(seed) % 28);
  const clusterSize = 14 + (Math.abs(seed + 17) % 71);
  const engagementDrop = 24 + (Math.abs(seed + 31) % 40);
  const botSignals = 9 + (Math.abs(seed + 53) % 32);

  return [
    selectTemplate(insightTemplates.abnormalTiming, seed).replace("{value}", String(timingScore)),
    selectTemplate(insightTemplates.followerClusters, seed + 1).replace("{value}", String(clusterSize)),
    selectTemplate(insightTemplates.lowEngagement, seed + 2).replace("{value}", String(engagementDrop)),
    selectTemplate(insightTemplates.coordinatedBot, seed + 3).replace("{value}", String(botSignals)),
  ];
};

const normalizeReport = (report) => {
  const processing = report.status === "Processing";
  const enriched = buildReportEnrichment(report);
  return {
    ...report,
    id: report.id || createReportId(),
    createdAt: report.createdAt || enriched.createdAt,
    riskScore: report.riskScore ?? enriched.riskScore,
    riskLevel: report.riskLevel || enriched.riskLevel,
    severity: report.severity || enriched.severity,
    confidence: report.confidence ?? enriched.confidence,
    region: report.region || enriched.region,
    reportType: report.reportType || enriched.reportType,
    fraudCategory: report.fraudCategory || enriched.fraudCategory,
    reportCategory: report.reportCategory || enriched.reportCategory,
    riskDistribution: report.riskDistribution || enriched.riskDistribution,
    topSuspiciousAccounts: report.topSuspiciousAccounts || enriched.topSuspiciousAccounts,
    featureImportance: report.featureImportance || enriched.featureImportance,
    behaviorPatterns: report.behaviorPatterns || enriched.behaviorPatterns,
    fraudSummary: report.fraudSummary || enriched.fraudSummary,
    progress: processing ? Number(report.progress ?? 12) : 100,
    stage: processing ? report.stage || reportProcessingStages[0] : null,
    insights:
      report.status === "Ready"
        ? report.insights && report.insights.length > 0
          ? report.insights
          : generateInsightsForReport(report, report.id || report.title)
        : report.insights || [],
  };
};

const fallbackUser = {
  name: "Ananya Rao",
  role: "Fraud Analyst",
  email: "ananya.rao@detectx.ai",
  last_login: "Live session",
};

const formatDelta = (current, previous, suffix = "") => {
  if (previous === null || previous === undefined) return "+0" + suffix;
  const diff = current - previous;
  const sign = diff >= 0 ? "+" : "";
  return `${sign}${diff.toFixed(Math.abs(diff) < 1 ? 1 : 0)}${suffix}`;
};

const toPolylinePoints = (series, width = 600, height = 220, pad = 14) => {
  if (!series || series.length === 0) return "";
  const min = Math.min(...series);
  const max = Math.max(...series);
  const yRange = Math.max(1, max - min);
  const stepX = (width - pad * 2) / Math.max(1, series.length - 1);
  return series
    .map((value, index) => {
      const x = pad + index * stepX;
      const y = height - pad - ((value - min) / yRange) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");
};

const toChartPoints = (series, width = 600, height = 220, pad = 14) => {
  if (!series || series.length === 0) return [];
  const min = Math.min(...series);
  const max = Math.max(...series);
  const yRange = Math.max(1, max - min);
  const stepX = (width - pad * 2) / Math.max(1, series.length - 1);
  return series.map((value, index) => ({
    x: pad + index * stepX,
    y: height - pad - ((value - min) / yRange) * (height - pad * 2),
    value,
    index,
  }));
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const severityRank = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

const getSeverityByRisk = (risk) => {
  if (risk >= 90) return "Critical";
  if (risk >= 80) return "High";
  if (risk >= 65) return "Medium";
  return "Low";
};

const detectionTypes = [
  "Bot Network",
  "Fake Engagement",
  "Clone Account",
  "Coordinated Spam",
  "Automation Ring",
  "Credential Abuse",
];

const riskRegions = [
  "North America",
  "Western Europe",
  "South Asia",
  "Southeast Asia",
  "LATAM",
  "MENA",
];

const handlePrefix = ["ghost", "neo", "shadow", "viral", "echo", "spam", "bot", "flux", "drift"];
const handleSuffix = ["net", "grid", "pulse", "stack", "drive", "node", "loop", "ring"];

const createSyntheticHandle = () => {
  const prefix = handlePrefix[Math.floor(Math.random() * handlePrefix.length)];
  const suffix = handleSuffix[Math.floor(Math.random() * handleSuffix.length)];
  const num = Math.floor(Math.random() * 900 + 100);
  return `@${prefix}_${suffix}_${num}`;
};

const createDetectionEvent = () => {
  const risk = Math.floor(62 + Math.random() * 36);
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    user: createSyntheticHandle(),
    type: detectionTypes[Math.floor(Math.random() * detectionTypes.length)],
    region: riskRegions[Math.floor(Math.random() * riskRegions.length)],
    risk,
    severity: getSeverityByRisk(risk),
    timestamp: new Date().toISOString(),
  };
};

const createInitialDetections = () =>
  Array.from({ length: 5 }, (_, idx) => {
    const event = createDetectionEvent();
    const timestamp = new Date(Date.now() - idx * 46000).toISOString();
    return { ...event, timestamp, id: `${event.id}-${idx}` };
  });

const createHeatmapData = (tick = 0) => {
  const rows = 5;
  const cols = 8;
  const hotspots = [
    { row: 1, col: 5, boost: 42 },
    { row: 3, col: 2, boost: 35 },
  ];

  return Array.from({ length: rows * cols }, (_, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const base = 20 + ((row * 13 + col * 11 + tick * 5) % 28);
    const hotspotBoost = hotspots.reduce((acc, spot) => {
      const distance = Math.abs(row - spot.row) + Math.abs(col - spot.col);
      return acc + Math.max(0, spot.boost - distance * 12);
    }, 0);
    const density = clamp(Math.round(base + hotspotBoost), 8, 99);
    return {
      id: `cell-${row}-${col}`,
      row,
      col,
      zone: `Zone ${row + 1}-${col + 1}`,
      density,
      level: density >= 80 ? "critical" : density >= 65 ? "high" : density >= 45 ? "medium" : "low",
    };
  });
};

const createInitialModelPerformance = () => ({
  precision: 96.4,
  recall: 94.8,
  f1: 95.6,
  falsePositiveRate: 2.7,
  confidenceTrend: [92.6, 93.1, 93.8, 94.4, 94.9, 95.2, 95.6, 96.1],
  driftTrend: [0.08, 0.1, 0.12, 0.13, 0.14, 0.16, 0.18, 0.2],
});

const createInitialBehaviorSummary = () => [
  {
    key: "spikes",
    title: "Suspicious activity spikes",
    value: 19,
    suffix: "%",
    trend: "+3.2%",
    tone: "up",
    series: [42, 44, 47, 43, 50, 54, 56, 58],
  },
  {
    key: "bot_growth",
    title: "Coordinated bot growth",
    value: 31,
    suffix: " clusters",
    trend: "+2.1%",
    tone: "up",
    series: [18, 20, 22, 24, 25, 27, 29, 31],
  },
  {
    key: "anomaly",
    title: "Anomalous posting patterns",
    value: 73,
    suffix: " score",
    trend: "+1.8%",
    tone: "up",
    series: [58, 60, 62, 65, 67, 69, 71, 73],
  },
  {
    key: "mismatch",
    title: "Engagement mismatches",
    value: 26,
    suffix: "%",
    trend: "-0.7%",
    tone: "down",
    series: [31, 30, 30, 29, 28, 28, 27, 26],
  },
];

const createInsightEntry = (event) => {
  const confidence = clamp(88 + Math.random() * 11, 88, 99.4);
  return {
    id: `insight-${event.id}`,
    explanation: `${event.type} pattern detected in ${event.region}; account ${event.user} shows synchronized anomalies with elevated fraud score.`,
    riskLevel: event.severity,
    confidence: confidence.toFixed(1),
    timestamp: event.timestamp,
  };
};

const createInitialInsightsFeed = (detections) => detections.map((event) => createInsightEntry(event));

function App() {
  const [screen, setScreen] = useState("landing");
  const [activePage, setActivePage] = useState("Overview");
  const [isDark, setIsDark] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameResult, setUsernameResult] = useState(null);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [realtime, setRealtime] = useState(fallbackRealtime);
  const [previousOverview, setPreviousOverview] = useState(null);
  const [liveState, setLiveState] = useState({ isLive: false, at: null });
  const [reports, setReports] = useState(() => fallbackReports.map(normalizeReport));
  const [reportCreateOpen, setReportCreateOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState("");
  const [creatingReport, setCreatingReport] = useState(false);
  const [userProfile, setUserProfile] = useState(fallbackUser);
  const [reportPreview, setReportPreview] = useState(null);
  const processingTimersRef = useRef([]);
  const [liveDetections, setLiveDetections] = useState(() => createInitialDetections());
  const [heatmapData, setHeatmapData] = useState(() => createHeatmapData());
  const [modelPerformance, setModelPerformance] = useState(() => createInitialModelPerformance());
  const [behaviorSummary, setBehaviorSummary] = useState(() => createInitialBehaviorSummary());
  const [insightFeed, setInsightFeed] = useState(() => createInitialInsightsFeed(createInitialDetections()));
  const [analyticsWindow, setAnalyticsWindow] = useState("30d");
  const [analyticsTooltip, setAnalyticsTooltip] = useState(null);
  const [categorySortDescending, setCategorySortDescending] = useState(true);
  const [analyticsDrilldown, setAnalyticsDrilldown] = useState(null);
  const [activeReportCategory, setActiveReportCategory] = useState("All");
  const [reportExportOpenId, setReportExportOpenId] = useState(null);
  const [reportFilters, setReportFilters] = useState(() => {
    const endDate = new Date();
    const startDate = new Date(Date.now() - 30 * 86400000);
    return {
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
      riskLevel: "All",
      fraudCategory: "All",
      region: "All",
      reportType: "All",
    };
  });
  const [reportSchedule, setReportSchedule] = useState({
    daily: true,
    weekly: true,
    realtime: true,
    weeklyDay: "Monday",
    weeklyTime: "09:00",
  });

  const heroNodes = useMemo(
    () => [
      { x: 8, y: 56, size: 3, type: "genuine" },
      { x: 12, y: 24, size: 4, type: "genuine" },
      { x: 18, y: 70, size: 4, type: "genuine" },
      { x: 22, y: 28, size: 6, type: "genuine" },
      { x: 29, y: 47, size: 5, type: "genuine" },
      { x: 35, y: 18, size: 3, type: "genuine" },
      { x: 42, y: 61, size: 4, type: "genuine" },
      { x: 48, y: 39, size: 5, type: "genuine" },
      { x: 54, y: 71, size: 3, type: "genuine" },
      { x: 60, y: 31, size: 4, type: "genuine" },
      { x: 68, y: 57, size: 4, type: "genuine" },
      { x: 74, y: 19, size: 3, type: "genuine" },
      { x: 79, y: 76, size: 4, type: "genuine" },
      { x: 86, y: 49, size: 6, type: "genuine" },
      { x: 91, y: 27, size: 5, type: "genuine" },
      { x: 95, y: 66, size: 4, type: "genuine" },
      { x: 44, y: 29, size: 4, type: "suspicious" },
      { x: 58, y: 52, size: 5, type: "suspicious" },
      { x: 35, y: 43, size: 4, type: "suspicious" },
      { x: 71, y: 56, size: 5, type: "suspicious" },
    ],
    []
  );

  useEffect(() => {
    let mounted = true;

    const loadRealtime = async () => {
      try {
        const response = await fetch(`${API_BASE}/realtime_dashboard`);
        if (!response.ok) throw new Error("Failed realtime fetch");
        const data = await response.json();
        if (!mounted) return;
        setRealtime((prev) => {
          setPreviousOverview(prev?.overview || null);
          return data;
        });
        setLiveState({ isLive: true, at: new Date() });
      } catch (err) {
        if (mounted) setLiveState((prev) => ({ ...prev, isLive: false }));
      }
    };

    const loadReports = async () => {
      try {
        const response = await fetch(`${API_BASE}/reports`);
        if (!response.ok) throw new Error("Failed report fetch");
        const data = await response.json();
        if (mounted && Array.isArray(data.reports) && data.reports.length > 0) {
          setReports(data.reports.map(normalizeReport));
        }
      } catch {
        if (mounted) setReports(fallbackReports.map(normalizeReport));
      }
    };

    const loadUser = async () => {
      try {
        const response = await fetch(`${API_BASE}/user_profile`);
        if (!response.ok) throw new Error("Failed user fetch");
        const data = await response.json();
        if (mounted) setUserProfile(data);
      } catch {
        if (mounted) setUserProfile(fallbackUser);
      }
    };

    loadRealtime();
    loadReports();
    loadUser();

    const realtimeTimer = setInterval(loadRealtime, 3000);

    return () => {
      mounted = false;
      clearInterval(realtimeTimer);
      processingTimersRef.current.forEach((timer) => clearInterval(timer));
      processingTimersRef.current = [];
    };
  }, []);

  useEffect(() => {
    const simulator = setInterval(() => {
      const event = createDetectionEvent();

      setLiveDetections((prev) => [event, ...prev].slice(0, 8));
      setInsightFeed((prev) => [createInsightEntry(event), ...prev].slice(0, 12));
      setHeatmapData((prev) =>
        prev.map((cell) => {
          const drift = Math.round((Math.random() - 0.45) * 8);
          const nextDensity = clamp(cell.density + drift + (cell.level === "critical" ? 1 : 0), 8, 99);
          return {
            ...cell,
            density: nextDensity,
            level:
              nextDensity >= 80
                ? "critical"
                : nextDensity >= 65
                ? "high"
                : nextDensity >= 45
                ? "medium"
                : "low",
          };
        })
      );
      setModelPerformance((prev) => {
        const nextPrecision = clamp(prev.precision + (Math.random() - 0.45) * 0.28, 93.8, 98.7);
        const nextRecall = clamp(prev.recall + (Math.random() - 0.45) * 0.34, 92.2, 98.2);
        const nextF1 = clamp((2 * nextPrecision * nextRecall) / (nextPrecision + nextRecall), 92.5, 98.4);
        const nextFalsePositiveRate = clamp(
          prev.falsePositiveRate + (Math.random() - 0.52) * 0.2,
          1.6,
          4.2
        );
        const nextConfidence = clamp(93.5 + Math.random() * 3.4, 93.4, 97.6);
        const nextDrift = clamp(prev.driftTrend[prev.driftTrend.length - 1] + (Math.random() - 0.42) * 0.03, 0.06, 0.27);

        return {
          precision: Number(nextPrecision.toFixed(2)),
          recall: Number(nextRecall.toFixed(2)),
          f1: Number(nextF1.toFixed(2)),
          falsePositiveRate: Number(nextFalsePositiveRate.toFixed(2)),
          confidenceTrend: [...prev.confidenceTrend.slice(1), Number(nextConfidence.toFixed(2))],
          driftTrend: [...prev.driftTrend.slice(1), Number(nextDrift.toFixed(3))],
        };
      });
      setBehaviorSummary((prev) =>
        prev.map((metric) => {
          const direction = metric.tone === "down" ? -1 : 1;
          const nextSeriesValue = clamp(
            metric.series[metric.series.length - 1] + direction * (Math.random() * 2.2 - 0.4),
            10,
            98
          );
          const nextSeries = [...metric.series.slice(1), Number(nextSeriesValue.toFixed(1))];
          const nextValue = Number(nextSeries[nextSeries.length - 1].toFixed(1));
          const nextTrendRaw = Number((Math.random() * 2.8).toFixed(1));
          const nextTrend = metric.tone === "down" ? `-${nextTrendRaw}%` : `+${nextTrendRaw}%`;

          return {
            ...metric,
            value: Number(nextValue.toFixed(metric.suffix === " clusters" ? 0 : 1)),
            trend: nextTrend,
            series: nextSeries,
          };
        })
      );
    }, 3600);

    return () => clearInterval(simulator);
  }, []);

  const handleUsername = async () => {
    if (!username.trim()) return;

    setUsernameLoading(true);
    try {
      const response = await fetch(`${API_BASE}/predict_username`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      if (!response.ok) throw new Error("Prediction failed");

      const data = await response.json();
      const probability = Number(data.probability_fake || 0.82);
      const topEntries = Object.entries(data.top_features || {})
        .sort((a, b) => Number(b[1]) - Number(a[1]))
        .slice(0, 5);

      const maxVal = Math.max(0.001, ...topEntries.map(([, val]) => Number(val)));

      setUsernameResult({
        riskScore: Math.round(probability * 100),
        riskLevel: data.risk_level?.includes("High")
          ? "High"
          : data.risk_level?.includes("Medium")
          ? "Medium"
          : "Low",
        confidence: Number((92 + Math.random() * 6).toFixed(1)),
        features: topEntries.map(([label, value], idx) => ({
          label: label.replaceAll("_", " "),
          score: Math.max(35, Math.round((Number(value) / maxVal) * 100)),
          tone: idx === 2 ? "neutral" : "critical",
        })),
        extracted: data.extracted_features || {},
      });
    } catch {
      setUsernameResult({
        riskScore: 82,
        riskLevel: "High",
        confidence: 94.2,
        features: [
          { label: "account age", score: 85, tone: "critical" },
          { label: "follower following ratio", score: 72, tone: "critical" },
          { label: "post frequency", score: 65, tone: "neutral" },
          { label: "profile completeness", score: 90, tone: "critical" },
          { label: "engagement rate", score: 58, tone: "critical" },
        ],
        extracted: {
          statuses_count: 47,
          followers_count: 62,
          friends_count: 1430,
          favourites_count: 4,
          listed_count: 0,
          default_profile: 1,
        },
      });
    }
    setUsernameLoading(false);
  };

  const simulateReportProcessing = (reportId) => {
    const totalDuration = 3000 + Math.floor(Math.random() * 2000);
    const startedAt = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      const stageIndex = Math.min(
        reportProcessingStages.length - 1,
        Math.floor((progress / 100) * reportProcessingStages.length)
      );

      setReports((prev) =>
        prev.map((report) => {
          if (report.id !== reportId) return report;
          if (progress >= 100) {
            return {
              ...report,
              status: "Ready",
              progress: 100,
              stage: null,
              meta: `${new Date().toLocaleDateString()} · AI analysis complete`,
              insights: generateInsightsForReport(report, report.id),
            };
          }
          return {
            ...report,
            status: "Processing",
            progress,
            stage: reportProcessingStages[stageIndex],
          };
        })
      );

      if (progress >= 100) {
        clearInterval(timer);
        processingTimersRef.current = processingTimersRef.current.filter((entry) => entry !== timer);
      }
    }, 120);

    processingTimersRef.current.push(timer);
  };

  const openCreateReportModal = () => {
    setSelectedReportType("");
    setReportCreateOpen(true);
  };

  const generateSelectedReport = async () => {
    if (!selectedReportType || creatingReport) return;

    setCreatingReport(true);
    const reportId = createReportId();
    const createdAt = new Date();
    const newReport = normalizeReport({
      id: reportId,
      title: selectedReportType,
      meta: `${createdAt.toLocaleDateString()} · Requested by analyst`,
      status: "Processing",
      progress: 8,
      stage: reportProcessingStages[0],
    });

    setReports((prev) => [newReport, ...prev]);
    setReportCreateOpen(false);
    setSelectedReportType("");

    try {
      await fetch(`${API_BASE}/reports/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: selectedReportType }),
      });
    } catch {
      // noop
    }

    simulateReportProcessing(reportId);
    setCreatingReport(false);
  };

  const handleLogout = () => {
    setScreen("landing");
    setActivePage("Overview");
  };

  const downloadReport = (title) => {
    const content = `DetectX Fraud Report\n\nReport: ${title}\nGenerated: ${new Date().toLocaleString()}\n\nSummary Insights:\n- Elevated bot behavior in clustered networks.\n- Repetitive posting patterns observed.\n- High-risk accounts prioritized for review.`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.replace(/\s+/g, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportReport = async (report, exportType) => {
    const safeName = report.title.replace(/\s+/g, "_");

    if (exportType === "Share link") {
      const link = `https://detectx.ai/reports/${report.id}`;
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(link);
        }
      } catch {
        // noop
      }
      setReportExportOpenId(null);
      return;
    }

    if (exportType === "Email to stakeholders") {
      const subject = encodeURIComponent(`DetectX Report: ${report.title}`);
      const body = encodeURIComponent(
        `Please review report ${report.title}.\nRisk score: ${report.riskScore}% (${report.riskLevel}).\nRegion: ${report.region}.`
      );
      window.open(`mailto:?subject=${subject}&body=${body}`);
      setReportExportOpenId(null);
      return;
    }

    const fileExtension = exportType === "CSV" ? "csv" : exportType === "Excel" ? "xlsx" : "pdf";
    const content =
      exportType === "CSV"
        ? `title,riskScore,riskLevel,confidence,region\n"${report.title}",${report.riskScore},${report.riskLevel},${report.confidence},${report.region}`
        : `DetectX ${exportType} Export\n\nTitle: ${report.title}\nRisk Score: ${report.riskScore}%\nRisk Level: ${report.riskLevel}\nConfidence: ${report.confidence}%\nRegion: ${report.region}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeName}.${fileExtension}`;
    link.click();
    URL.revokeObjectURL(url);
    setReportExportOpenId(null);
  };

  const openReportPreview = (report) => {
    setReportPreview({
      ...report,
      insights:
        report.status === "Ready"
          ? report.insights && report.insights.length > 0
            ? report.insights
            : generateInsightsForReport(report, report.id)
          : [],
    });
  };

  const scheduleSummary = useMemo(() => {
    const parts = [];
    if (reportSchedule.daily) parts.push("Daily auto reports");
    if (reportSchedule.weekly) parts.push(`Weekly fraud summary · Every ${reportSchedule.weeklyDay} ${reportSchedule.weeklyTime}`);
    if (reportSchedule.realtime) parts.push("Real-time alerts");
    return parts.length > 0 ? parts.join(" · ") : "Scheduling disabled";
  }, [reportSchedule]);

  const score = usernameResult?.riskScore ?? 82;
  const circleFill = `conic-gradient(#dc2626 ${score * 3.6}deg, #e5e7eb 0deg)`;
  const detectionFeatures = useMemo(
    () =>
      usernameResult?.features || [
        { label: "account age", score: 85, tone: "critical" },
        { label: "follower following ratio", score: 72, tone: "critical" },
        { label: "post frequency", score: 65, tone: "neutral" },
        { label: "profile completeness", score: 90, tone: "critical" },
        { label: "engagement rate", score: 58, tone: "critical" },
      ],
    [usernameResult]
  );
  const normalizedHandle = useMemo(() => {
    const raw = (username || "").trim();
    if (!raw) return "@suspected_profile";
    return raw.startsWith("@") ? raw : `@${raw}`;
  }, [username]);

  const detectionProfile = useMemo(() => {
    const seed = Math.abs(hashString(normalizedHandle));
    const platforms = ["X (Twitter)", "Instagram", "TikTok", "YouTube"];
    const followers = Number(usernameResult?.extracted?.followers_count ?? 200 + (seed % 4800));
    const following = Number(usernameResult?.extracted?.friends_count ?? 90 + (seed % 1200));
    const accountAgeMonths = 6 + (seed % 86);
    const verified = score < 70 && followers > 900;
    const postsPerDay = Number(((usernameResult?.extracted?.statuses_count ?? 47) / 10).toFixed(1));
    const engagementRate = Number(
      Math.max(0.6, Math.min(12, (followers / Math.max(10, following)) * 2.4)).toFixed(1)
    );
    const followerGrowth = Number((10 + (seed % 47) + score * 0.12).toFixed(1));
    const activityTiming = Number((58 + (seed % 34)).toFixed(1));

    return {
      username: normalizedHandle,
      platform: platforms[seed % platforms.length],
      avatar: `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(normalizedHandle)}`,
      accountAgeMonths,
      verified,
      followers,
      following,
      postsPerDay,
      engagementRate,
      followerGrowth,
      activityTiming,
    };
  }, [normalizedHandle, score, usernameResult]);

  const activityIntel = useMemo(() => {
    const seed = Math.abs(hashString(`${detectionProfile.username}|${score}`));
    const daily = Array.from({ length: 14 }, (_, idx) => {
      const wave = Math.sin((idx + seed % 6) * 0.7) * 8;
      const base = 26 + (seed % 14) + wave + (idx % 5 === 0 ? 20 : 0);
      return Math.round(Math.max(12, base + (idx > 9 ? 8 : 0)));
    });
    const weekly = Array.from({ length: 7 }, (_, idx) => {
      const sample = daily.slice(idx, idx + 2);
      const avg = sample.reduce((total, value) => total + value, 0) / sample.length;
      return Math.round(avg + (idx === 2 || idx === 5 ? 12 : 0));
    });
    const threshold = Math.max(58, Math.round((Math.max(...daily) + Math.min(...daily)) / 2 + 10));
    const anomalyIndices = daily
      .map((value, idx) => ({ value, idx }))
      .filter((entry) => entry.value >= threshold)
      .map((entry) => entry.idx)
      .slice(0, 4);
    return { daily, weekly, anomalyIndices, threshold };
  }, [detectionProfile.username, score]);

  const dailyTimelinePoints = useMemo(
    () => toChartPoints(activityIntel.daily, 620, 220, 18),
    [activityIntel.daily]
  );

  const dailyTimelinePolyline = useMemo(
    () => dailyTimelinePoints.map((point) => `${point.x},${point.y}`).join(" "),
    [dailyTimelinePoints]
  );

  const detectionRiskLevel = usernameResult?.riskLevel || (score >= 85 ? "High" : score >= 65 ? "Medium" : "Low");

  const keySuspiciousBehaviors = useMemo(() => {
    const featureLabels = [...detectionFeatures]
      .sort((left, right) => right.score - left.score)
      .slice(0, 3)
      .map((feature) => feature.label.replaceAll("_", " "));
    const defaults = [
      "abnormal activity timing at non-human hours",
      "repetitive content similarity across multiple posts",
      "coordinated engagement from tightly linked accounts",
    ];
    return [...featureLabels, ...defaults].slice(0, 4);
  }, [detectionFeatures]);

  const aiExplanationText = useMemo(
    () =>
      `${detectionProfile.username} is flagged because activity patterns diverge from authentic user baselines. The model observed ${keySuspiciousBehaviors[0]}, ${keySuspiciousBehaviors[1]}, and ${keySuspiciousBehaviors[2]}. This profile is currently assessed as ${detectionRiskLevel} risk with ${(usernameResult?.confidence ?? 94.2).toFixed(1)}% confidence.`,
    [detectionProfile.username, keySuspiciousBehaviors, detectionRiskLevel, usernameResult]
  );

  const comparisonRows = useMemo(() => {
    const normal = {
      postsPerDay: 4.8,
      engagementRate: 4.1,
      followerGrowth: 9.6,
      activityTiming: 28.0,
    };

    const account = {
      postsPerDay: detectionProfile.postsPerDay,
      engagementRate: detectionProfile.engagementRate,
      followerGrowth: detectionProfile.followerGrowth,
      activityTiming: detectionProfile.activityTiming,
    };

    return [
      {
        key: "posts",
        label: "Posts per day",
        account: account.postsPerDay,
        normal: normal.postsPerDay,
        unit: "",
      },
      {
        key: "engagement",
        label: "Engagement rate",
        account: account.engagementRate,
        normal: normal.engagementRate,
        unit: "%",
      },
      {
        key: "growth",
        label: "Follower growth",
        account: account.followerGrowth,
        normal: normal.followerGrowth,
        unit: "%/wk",
      },
      {
        key: "timing",
        label: "Activity timing (night-time ratio)",
        account: account.activityTiming,
        normal: normal.activityTiming,
        unit: "%",
      },
    ].map((row) => {
      const delta = Number((row.account - row.normal).toFixed(1));
      return {
        ...row,
        delta,
        deltaText: `${delta >= 0 ? "+" : ""}${delta}${row.unit}`,
        tone: delta > 0 ? "up" : "down",
      };
    });
  }, [detectionProfile]);

  const networkPreview = useMemo(() => {
    const seed = Math.abs(hashString(detectionProfile.username));
    const suspiciousConnections = 18 + (seed % 95);
    const clusterAssociation = Math.min(99, Math.round(score + 7 + (seed % 8)));
    return {
      suspiciousConnections,
      clusterAssociation,
      clusterName: `Cluster-${String.fromCharCode(65 + (seed % 6))}${(seed % 24) + 12}`,
    };
  }, [detectionProfile.username, score]);

  const behavioralBadges = useMemo(
    () => [
      "Non-human activity detected",
      "Repetitive content",
      "Coordinated engagement",
      "Follower burst anomaly",
    ],
    []
  );

  const recommendationOrder = ["Monitor", "Flag", "Block", "Manual review"];
  const recommendedAction =
    score >= 90 ? "Block" : score >= 80 ? "Manual review" : score >= 65 ? "Flag" : "Monitor";

  const behavioralRiskSummary = useMemo(() => {
    const confidence = Number((usernameResult?.confidence ?? 94.2).toFixed(1));
    const botLikelihood = Math.min(99, Math.round(score + 7));
    const behavioralRiskScore = Math.min(99, Math.round(score * 0.82 + botLikelihood * 0.18));
    const severity =
      behavioralRiskScore >= 90
        ? "critical"
        : behavioralRiskScore >= 80
        ? "high"
        : behavioralRiskScore >= 65
        ? "medium"
        : "low";

    return {
      confidence,
      botLikelihood,
      behavioralRiskScore,
      severity,
      severityLabel: severity.charAt(0).toUpperCase() + severity.slice(1),
    };
  }, [score, usernameResult]);

  const behavioralTimeline = useMemo(() => {
    const seed = Math.abs(hashString(`${detectionProfile.username}|timeline|${score}`));
    const labels = ["W-8", "W-7", "W-6", "W-5", "W-4", "W-3", "W-2", "W-1"];
    const values = labels.map((_, idx) => {
      const progression = idx * 4.8;
      const noise = ((seed + idx * 13) % 11) - 5;
      const spike = idx === 5 || idx === 7 ? 14 : 0;
      return Math.round(clamp(38 + progression + noise + spike, 18, 98));
    });
    const spikeIndices = values
      .map((value, idx) => ({ value, idx }))
      .filter((entry) => entry.value >= 74)
      .map((entry) => entry.idx);

    return { labels, values, spikeIndices };
  }, [detectionProfile.username, score]);

  const nlpBehaviorAnalysis = useMemo(() => {
    const seed = Math.abs(hashString(`${detectionProfile.username}|nlp|${score}`));
    const repetitiveText = clamp(Math.round(58 + (seed % 24) + score * 0.1), 35, 99);
    const spamPhrases = clamp(Math.round(42 + ((seed >> 2) % 26) + score * 0.08), 22, 97);
    const botLikeLanguage = clamp(Math.round(50 + ((seed >> 3) % 29) + score * 0.09), 30, 98);

    return [
      {
        key: "repetitive",
        label: "Repetitive text",
        score: repetitiveText,
        sample: "Detected high reuse of near-identical sentence templates.",
      },
      {
        key: "spam",
        label: "Spam phrases",
        score: spamPhrases,
        sample: "Frequent promotional phrase patterns and bait-style keywords.",
      },
      {
        key: "bot_language",
        label: "Bot-like language",
        score: botLikeLanguage,
        sample: "Short cyclic language loops with low lexical diversity.",
      },
    ];
  }, [detectionProfile.username, score]);

  const behavioralClassification = useMemo(() => {
    const seed = Math.abs(hashString(`${detectionProfile.username}|class|${score}`));
    const base = [
      { label: "Spam bot", score: 28 + (seed % 24) },
      { label: "Engagement bot", score: 22 + ((seed >> 2) % 26) },
      { label: "Fake influencer", score: 19 + ((seed >> 3) % 28) },
      { label: "Coordinated fraud", score: 24 + ((seed >> 4) % 27) },
    ].map((item, idx) => ({
      ...item,
      score: Math.round(clamp(item.score + score * (0.16 + idx * 0.02), 8, 96)),
    }));

    const top = [...base].sort((left, right) => right.score - left.score)[0];
    return {
      classes: base.sort((left, right) => right.score - left.score),
      top,
    };
  }, [detectionProfile.username, score]);

  const distribution = realtime.overview.distribution;
  const overviewDonut = {
    background: `conic-gradient(#2f67da 0 ${distribution.genuine}%, #f59e0b ${distribution.genuine}% ${distribution.genuine + distribution.suspicious}%, #dc2626 ${distribution.genuine + distribution.suspicious}% 100%)`,
  };

  const analyticsDist = realtime.analytics.risk_distribution;
  const analyticsDonut = {
    background: `conic-gradient(#2f67da 0 ${analyticsDist.low}%, #f59e0b ${analyticsDist.low}% ${analyticsDist.low + analyticsDist.medium}%, #dc2626 ${analyticsDist.low + analyticsDist.medium}% 100%)`,
  };

  const overviewStats = [
    {
      label: "Total Scans",
      value: realtime.overview.total_scans.toLocaleString(),
      delta: formatDelta(realtime.overview.total_scans, previousOverview?.total_scans),
      tone: "positive",
    },
    {
      label: "Fake Detected",
      value: realtime.overview.fake_detected.toLocaleString(),
      delta: formatDelta(realtime.overview.fake_detected, previousOverview?.fake_detected),
      tone: "positive",
    },
    {
      label: "Active Alerts",
      value: String(realtime.overview.active_alerts),
      delta: formatDelta(realtime.overview.active_alerts, previousOverview?.active_alerts),
      tone: realtime.overview.active_alerts > (previousOverview?.active_alerts || 47) ? "negative" : "positive",
    },
    {
      label: "Accuracy",
      value: `${realtime.overview.accuracy}%`,
      delta: formatDelta(realtime.overview.accuracy, previousOverview?.accuracy, "%"),
      tone: "positive",
    },
  ];

  const confidenceTrendPoints = toPolylinePoints(modelPerformance.confidenceTrend, 360, 140, 12);
  const maxDrift = Math.max(...modelPerformance.driftTrend, 0.3);

  const sortedAlerts = useMemo(() => {
    const baseAlerts = (realtime.overview.recent_alerts || []).map((alert, idx) => {
      const severity = getSeverityByRisk(Number(alert.risk));
      return {
        id: `base-${alert.user}-${idx}`,
        user: alert.user,
        type: alert.type,
        risk: Number(alert.risk),
        severity,
        timestamp: new Date(Date.now() - (idx + 2) * 55000).toISOString(),
      };
    });

    const liveAlerts = liveDetections.map((event) => ({
      id: `live-${event.id}`,
      user: event.user,
      type: event.type,
      risk: event.risk,
      severity: event.severity,
      timestamp: event.timestamp,
    }));

    return [...liveAlerts, ...baseAlerts]
      .sort((left, right) => {
        const severityDiff = severityRank[right.severity] - severityRank[left.severity];
        if (severityDiff !== 0) return severityDiff;
        return right.risk - left.risk;
      })
      .slice(0, 8);
  }, [realtime.overview.recent_alerts, liveDetections]);

  const renderOverview = () => (
    <>
      <div className="section-head">
        <h2>Overview</h2>
        <p>Platform summary and recent activity.</p>
      </div>

      <div className="stats-grid">
        {overviewStats.map((item) => (
          <div key={item.label} className="stat-card">
            <div className="stat-top">
              <span>{item.label}</span>
              <span className={`delta ${item.tone}`}>{item.delta}</span>
            </div>
            <div className="stat-value">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="overview-mid">
        <div className="panel large">
          <h3>Detection Trends</h3>
          <svg viewBox="0 0 600 230" className="chart-svg">
            <polyline
              fill="none"
              stroke="#2f67da"
              strokeWidth="3"
              points={toPolylinePoints(realtime.detection_trend.real, 600, 230)}
            />
            <polyline
              fill="none"
              stroke="#dc2626"
              strokeWidth="3"
              points={toPolylinePoints(realtime.detection_trend.fake, 600, 230)}
            />
          </svg>
        </div>

        <div className="panel donut-wrap">
          <h3>Distribution</h3>
          <div className="donut small" style={overviewDonut}></div>
          <ul className="legend">
            <li>
              <span className="dot blue"></span> Genuine <b>{distribution.genuine}%</b>
            </li>
            <li>
              <span className="dot amber"></span> Suspicious <b>{distribution.suspicious}%</b>
            </li>
            <li>
              <span className="dot red"></span> Fake <b>{distribution.fake}%</b>
            </li>
          </ul>
        </div>
      </div>

      <div className="overview-insight-grid">
        <div className="panel live-monitor-panel">
          <div className="panel-head-row">
            <h3>Real-time Fraud Monitoring</h3>
            <span className="monitor-live-pill">
              <i></i>
              Live Monitoring
            </span>
          </div>
          <ul className="monitor-stream">
            {liveDetections.map((event) => (
              <li className="monitor-item" key={event.id}>
                <div>
                  <strong>{event.user}</strong>
                  <p>
                    {event.type} · {event.region}
                  </p>
                </div>
                <div className="monitor-risk-block">
                  <span className={`severity-chip ${event.severity.toLowerCase()}`}>{event.severity}</span>
                  <b>{event.risk}%</b>
                  <small>
                    {new Date(event.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel heatmap-panel">
          <h3>Fraud Risk Heatmap</h3>
          <div className="heatmap-grid">
            {heatmapData.map((cell) => (
              <div className={`heat-cell ${cell.level}`} key={cell.id}>
                <span>{cell.density}</span>
                <div className="heat-tooltip">
                  <b>{cell.zone}</b>
                  <small>Risk density: {cell.density}%</small>
                </div>
              </div>
            ))}
          </div>
          <div className="heatmap-legend">
            <span>
              <i className="heat low"></i> Low
            </span>
            <span>
              <i className="heat medium"></i> Medium
            </span>
            <span>
              <i className="heat high"></i> High
            </span>
            <span>
              <i className="heat critical"></i> Critical
            </span>
          </div>
        </div>
      </div>

      <div className="overview-model-grid">
        <div className="panel model-panel">
          <h3>AI Model Performance</h3>
          <div className="model-metrics-grid">
            <div>
              <span>Precision</span>
              <b>{modelPerformance.precision}%</b>
            </div>
            <div>
              <span>Recall</span>
              <b>{modelPerformance.recall}%</b>
            </div>
            <div>
              <span>F1-score</span>
              <b>{modelPerformance.f1}%</b>
            </div>
            <div>
              <span>False Positive Rate</span>
              <b>{modelPerformance.falsePositiveRate}%</b>
            </div>
          </div>
          <div className="model-trend-wrap">
            <div className="model-trend-chart">
              <h4>Model confidence trend</h4>
              <svg viewBox="0 0 360 140" className="chart-svg small">
                <polyline fill="none" stroke="#2f67da" strokeWidth="3" points={confidenceTrendPoints} />
              </svg>
            </div>
            <div className="model-drift">
              <h4>Model drift visualization</h4>
              <div className="drift-bars">
                {modelPerformance.driftTrend.map((value, idx) => (
                  <span key={`drift-${idx}`}>
                    <i style={{ height: `${(value / maxDrift) * 100}%` }}></i>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="panel behavior-intel-panel">
          <h3>Behavior Intelligence Summary</h3>
          <div className="behavior-summary-list">
            {behaviorSummary.map((metric) => (
              <div key={metric.key} className="behavior-summary-item">
                <div className="behavior-summary-head">
                  <strong>{metric.title}</strong>
                  <span className={`trend-chip ${metric.tone}`}>{metric.trend}</span>
                </div>
                <div className="behavior-summary-body">
                  <b>
                    {metric.value}
                    {metric.suffix}
                  </b>
                  <svg viewBox="0 0 210 56" className="behavior-sparkline">
                    <polyline
                      fill="none"
                      stroke={metric.tone === "down" ? "#f59e0b" : "#2f67da"}
                      strokeWidth="2.4"
                      points={toPolylinePoints(metric.series, 210, 56, 6)}
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel insights-feed-panel">
        <div className="panel-head-row">
          <h3>AI-generated Insights Feed</h3>
          <span className="feed-count">{insightFeed.length} active insights</span>
        </div>
        <div className="insights-feed-scroll">
          {insightFeed.map((insight) => (
            <article key={insight.id} className="insight-feed-item">
              <p>{insight.explanation}</p>
              <div>
                <span className={`severity-chip ${insight.riskLevel.toLowerCase()}`}>{insight.riskLevel}</span>
                <small>Confidence: {insight.confidence}%</small>
                <small>
                  {new Date(insight.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </small>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="panel">
        <h3>Recent Alerts</h3>
        <ul className="alerts-list">
          {sortedAlerts.map((row) => (
            <li key={row.id}>
              <span>
                <i></i>
                {row.user}
                <small>
                  {row.type} · {new Date(row.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </small>
              </span>
              <div className="alert-meta-right">
                <span className={`severity-chip ${row.severity.toLowerCase()}`}>{row.severity}</span>
                <b>{row.risk}%</b>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  const renderDetection = () => (
    <>
      <div className="section-head">
        <h2>Detection</h2>
        <p>Analyze a social media username for fraud indicators.</p>
      </div>

      <div className="panel">
        <div className="search-row big">
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter social media username"
          />
          <button onClick={handleUsername} disabled={usernameLoading}>
            {usernameLoading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </div>

      <div className={`panel behavior-risk-summary-card ${behavioralRiskSummary.severity}`}>
        <div className="behavior-risk-summary-head">
          <div>
            <h3>Behavioral Risk Summary</h3>
            <p>Live behavioral intelligence scorecard based on account pattern analysis.</p>
          </div>
          <span className={`severity-chip ${behavioralRiskSummary.severity}`}>
            {behavioralRiskSummary.severityLabel} Severity
          </span>
        </div>
        <div className="behavior-risk-summary-grid">
          <div>
            <span>Behavioral risk score</span>
            <b>{behavioralRiskSummary.behavioralRiskScore}/100</b>
          </div>
          <div>
            <span>Confidence level</span>
            <b>{behavioralRiskSummary.confidence}%</b>
          </div>
          <div>
            <span>Bot likelihood</span>
            <b>{behavioralRiskSummary.botLikelihood}%</b>
          </div>
          <div>
            <span>Current severity</span>
            <b>{behavioralRiskSummary.severityLabel}</b>
          </div>
        </div>
      </div>

      <div className="panel profile-summary-card">
        <div className="profile-summary-head">
          <div className="profile-summary-main">
            <img src={detectionProfile.avatar} alt="Profile avatar" className="profile-avatar" />
            <div>
              <h3>{detectionProfile.username}</h3>
              <p>{detectionProfile.platform}</p>
            </div>
          </div>
          <span className={`verify-pill ${detectionProfile.verified ? "verified" : "unverified"}`}>
            {detectionProfile.verified ? "Verified account" : "Unverified account"}
          </span>
        </div>
        <div className="profile-summary-grid">
          <div>
            <span>Account age</span>
            <b>{detectionProfile.accountAgeMonths} months</b>
          </div>
          <div>
            <span>Followers</span>
            <b>{detectionProfile.followers.toLocaleString()}</b>
          </div>
          <div>
            <span>Following</span>
            <b>{detectionProfile.following.toLocaleString()}</b>
          </div>
          <div>
            <span>Platform</span>
            <b>{detectionProfile.platform}</b>
          </div>
        </div>
      </div>

      <div className="detect-grid">
        <div className="panel risk-card">
          <h3>Risk Score</h3>
          {usernameLoading ? (
            <div className="skeleton-circle"></div>
          ) : (
            <div className="risk-circle" style={{ background: circleFill }}>
              <div>
                <strong>{score}</strong>
                <span>/ 100</span>
              </div>
            </div>
          )}
          <div className="risk-meta">
            <span className="badge">{(usernameResult?.riskLevel || "High").toUpperCase()} RISK</span>
            <span>{usernameResult?.confidence ?? 94.2}% confidence</span>
          </div>
        </div>

        <div className="panel explain-panel ai-explain-panel">
          <h3>AI-generated explanation</h3>
          <p>{aiExplanationText}</p>
          <div className="ai-explain-meta">
            <span className={`severity-chip ${detectionRiskLevel.toLowerCase()}`}>{detectionRiskLevel} Risk</span>
            <span>{(usernameResult?.confidence ?? 94.2).toFixed(1)}% confidence</span>
          </div>
          <ul className="ai-behavior-list">
            {keySuspiciousBehaviors.map((behavior) => (
              <li key={behavior}>{behavior}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="detect-analytics-grid">
        <div className="panel detection-timeline-panel">
          <h3>Timeline Activity Chart</h3>
          <svg viewBox="0 0 620 220" className="chart-svg detection-timeline-chart">
            <polyline fill="none" stroke="#2f67da" strokeWidth="3" points={dailyTimelinePolyline} />
            {dailyTimelinePoints
              .filter((point) => activityIntel.anomalyIndices.includes(point.index))
              .map((point) => (
                <circle key={`anomaly-${point.index}`} cx={point.x} cy={point.y} r="5" className="anomaly-dot" />
              ))}
          </svg>
          <div className="timeline-weekly">
            {activityIntel.weekly.map((value, idx) => (
              <div key={`wk-${idx}`}>
                <i
                  className={value >= activityIntel.threshold ? "spike" : ""}
                  style={{ height: `${Math.max(20, value * 1.6)}px` }}
                ></i>
                <small>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}</small>
              </div>
            ))}
          </div>
          <p className="timeline-note">
            Anomaly markers indicate suspicious spikes in daily activity; weekly bars highlight unstable behavior windows.
          </p>
        </div>

        <div className="panel compare-panel">
          <h3>Compared with Normal Users</h3>
          <div className="compare-grid">
            {comparisonRows.map((row) => (
              <div key={row.key} className="compare-row">
                <div>
                  <strong>{row.label}</strong>
                  <p>
                    Account {row.account}
                    {row.unit} · Typical {row.normal}
                    {row.unit}
                  </p>
                </div>
                <span className={`trend-chip ${row.tone}`}>{row.deltaText}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel behavior-evolution-panel">
        <h3>Behavioral Timeline</h3>
        <p>Suspicious pattern evolution over the last 8 weekly windows.</p>
        <div className="behavior-evolution-track">
          {behavioralTimeline.values.map((value, idx) => (
            <div key={`evo-${idx}`} className="behavior-evolution-item">
              <div className="evolution-bar-wrap">
                <i
                  className={behavioralTimeline.spikeIndices.includes(idx) ? "spike" : ""}
                  style={{ height: `${Math.max(12, value)}%` }}
                ></i>
              </div>
              <strong>{value}</strong>
              <small>{behavioralTimeline.labels[idx]}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="detect-support-grid">
        <div className="panel nlp-analysis-panel">
          <h3>NLP-based Behavior Analysis</h3>
          <div className="nlp-analysis-list">
            {nlpBehaviorAnalysis.map((item) => (
              <div key={item.key} className="nlp-analysis-item">
                <div className="nlp-analysis-head">
                  <strong>{item.label}</strong>
                  <span>{item.score}%</span>
                </div>
                <div className="nlp-analysis-meter">
                  <i style={{ width: `${item.score}%` }}></i>
                </div>
                <p>{item.sample}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel behavior-classification-panel">
          <h3>Behavioral Classification Module</h3>
          <p>
            Predicted class: <b>{behavioralClassification.top.label}</b>
          </p>
          <div className="classification-list">
            {behavioralClassification.classes.map((entry) => (
              <div
                key={entry.label}
                className={`classification-item ${entry.label === behavioralClassification.top.label ? "active" : ""}`}
              >
                <span>{entry.label}</span>
                <div>
                  <i style={{ width: `${entry.score}%` }}></i>
                </div>
                <b>{entry.score}%</b>
              </div>
            ))}
          </div>
        </div>

        <div className="panel network-preview-panel">
          <h3>Network Risk Preview</h3>
          <div className="network-preview-metrics">
            <p>
              Suspicious connections <b>{networkPreview.suspiciousConnections}</b>
            </p>
            <p>
              Bot cluster association <b>{networkPreview.clusterAssociation}%</b>
            </p>
            <p>
              Dominant cluster <b>{networkPreview.clusterName}</b>
            </p>
          </div>
          <button className="outline-btn" onClick={() => setActivePage("Network Graph")}>View full network graph</button>
        </div>

        <div className="panel behavior-badges-panel">
          <h3>Behavioral Risk Badges</h3>
          <div className="behavior-badges">
            {behavioralBadges.map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
          </div>
        </div>

        <div className="panel recommendation-panel">
          <h3>AI Recommendation</h3>
          <p className="recommendation-meta">
            Recommended action is derived from risk score <b>{score}</b>.
          </p>
          <div className="recommendation-list">
            {recommendationOrder.map((action) => (
              <div key={action} className={`recommendation-item ${action === recommendedAction ? "active" : ""}`}>
                <strong>{action}</strong>
                <p>
                  {action === "Monitor"
                    ? "Track behavioral drift with passive observation."
                    : action === "Flag"
                    ? "Mark account for heightened automated checks."
                    : action === "Block"
                    ? "Restrict account actions due to elevated risk."
                    : "Escalate to analyst team for case-level review."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderBehavioral = () => (
    <>
      <div className="section-head">
        <h2>Behavioral Analysis</h2>
        <p>AI-powered behavioral pattern analysis.</p>
      </div>

      <div className="two-col">
        <div className="panel">
          <h3>24-Hour Activity</h3>
          <div className="bars24">
            {realtime.behavioral.activity_24h.map((value, idx) => (
              <i key={idx} style={{ height: `${value}px` }}></i>
            ))}
          </div>
          <p className="warn">⚠ Suspicious burst detected 2:00-5:00 AM</p>
        </div>

        <div className="panel">
          <h3>Weekly Engagement</h3>
          <div className="week-grid">
            {realtime.behavioral.weekly_engagement.map((value, idx) => (
              <div key={idx}>
                <span style={{ height: `${Math.max(20, value / 4.5)}px` }}></span>
                <i style={{ height: `${Math.max(10, realtime.behavioral.weekly_suspicious[idx] * 1.4)}px` }}></i>
                <small>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Suspicious Signals</h3>
        <ul className="signals">
          {realtime.behavioral.signals.map((signal) => (
            <li key={signal.label}>
              <span className={signal.level}></span>
              {signal.label}
              <b>{signal.score}%</b>
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  const renderNetwork = () => (
    <>
      <div className="section-head">
        <h2>Network Graph</h2>
        <p>Social network visualization revealing fake clusters.</p>
      </div>
      <div className="panel">
        <h3>Live Network</h3>
        <div className="network-canvas">
          {realtime.network.nodes.map((point, idx) => (
            <span
              key={idx}
              className={`node ${point.type}`}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                width: `${point.size + 2}px`,
                height: `${point.size + 2}px`,
              }}
            ></span>
          ))}
        </div>
        <div className="network-legend">
          <span>
            <i className="dot blue"></i> Genuine
          </span>
          <span>
            <i className="dot red"></i> Suspicious
          </span>
        </div>
      </div>

      <div className="cluster-grid">
        {realtime.network.clusters.map((cluster) => (
          <div className="panel cardline" key={cluster.title}>
            <div>
              <h4>{cluster.title}</h4>
              <p>{cluster.meta}</p>
            </div>
            <b>{cluster.risk}%</b>
          </div>
        ))}
      </div>

      <div className="panel">
        <h3>Suspicious Connections</h3>
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Strength</th>
            </tr>
          </thead>
          <tbody>
            {realtime.network.connections.map((row) => (
              <tr key={`${row.from}-${row.to}`}>
                <td>{row.from}</td>
                <td>{row.to}</td>
                <td>
                  <div className="table-progress">
                    <i style={{ width: `${row.strength}%` }}></i>
                  </div>
                  {row.strength}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderAnalytics = () => {
    const categories = Object.entries(realtime.analytics.fraud_categories || {});

    const baseDetected = realtime.analytics.detected || [];
    const baseGrowth = realtime.analytics.growth || [];
    const labels = realtime.analytics.labels || [];
    const windowMap = { "7d": 7, "30d": 10, "90d": 12 };
    const pointCount = windowMap[analyticsWindow] || 10;
    const detectedSeries = baseDetected.slice(Math.max(0, baseDetected.length - pointCount));
    const growthSeries = baseGrowth.slice(Math.max(0, baseGrowth.length - pointCount));
    const seriesLabels = labels.slice(Math.max(0, labels.length - pointCount));

    const chartWidth = 760;
    const chartHeight = 250;
    const chartPad = 18;
    const detectedPoints = toChartPoints(detectedSeries, chartWidth, chartHeight, chartPad);
    const growthPoints = toChartPoints(growthSeries, chartWidth, chartHeight, chartPad);
    const baseY = chartHeight - chartPad;
    const detectedAreaPoints =
      detectedPoints.length > 0
        ? `${detectedPoints[0].x},${baseY} ${detectedPoints
            .map((point) => `${point.x},${point.y}`)
            .join(" ")} ${detectedPoints[detectedPoints.length - 1].x},${baseY}`
        : "";
    const growthAreaPoints =
      growthPoints.length > 0
        ? `${growthPoints[0].x},${baseY} ${growthPoints
            .map((point) => `${point.x},${point.y}`)
            .join(" ")} ${growthPoints[growthPoints.length - 1].x},${baseY}`
        : "";

    const detectedMean = detectedSeries.reduce((sum, value) => sum + value, 0) / Math.max(1, detectedSeries.length);
    const detectedStd = Math.sqrt(
      detectedSeries.reduce((sum, value) => sum + (value - detectedMean) ** 2, 0) /
        Math.max(1, detectedSeries.length)
    );
    const anomalyThreshold = detectedMean + detectedStd * 0.65;
    const anomalyPoints = detectedPoints.filter((point) => point.value >= anomalyThreshold);

    const kpiHighRisk = Math.round((realtime.overview.fake_detected || 0) * 0.38);
    const kpiAlerts24h = (realtime.overview.active_alerts || 0) + Math.round((liveDetections[0]?.risk || 70) / 8);
    const previousWeekAvg = growthSeries.slice(0, Math.floor(growthSeries.length / 2));
    const currentWeekAvg = growthSeries.slice(Math.floor(growthSeries.length / 2));
    const previousGrowthAvg =
      previousWeekAvg.reduce((sum, value) => sum + value, 0) / Math.max(1, previousWeekAvg.length);
    const currentGrowthAvg =
      currentWeekAvg.reduce((sum, value) => sum + value, 0) / Math.max(1, currentWeekAvg.length);
    const weeklyFraudGrowthPct = ((currentGrowthAvg - previousGrowthAvg) / Math.max(1, previousGrowthAvg)) * 100;
    const avgModelConfidence =
      modelPerformance.confidenceTrend.reduce((sum, value) => sum + value, 0) /
      Math.max(1, modelPerformance.confidenceTrend.length);
    const avgDetectionTime = Math.max(1.2, 3.8 - (realtime.analytics.detection_rate || 96.8) / 60);

    const kpiCards = [
      {
        label: "High Risk Accounts",
        value: kpiHighRisk.toLocaleString(),
        change: "+6.4%",
        tone: "up",
      },
      {
        label: "Alerts in Last 24 Hours",
        value: kpiAlerts24h.toLocaleString(),
        change: "+3.1%",
        tone: "up",
      },
      {
        label: "Weekly Fraud Growth",
        value: `${weeklyFraudGrowthPct >= 0 ? "+" : ""}${weeklyFraudGrowthPct.toFixed(1)}%`,
        change: `${weeklyFraudGrowthPct >= 0 ? "↑" : "↓"} ${Math.abs(weeklyFraudGrowthPct).toFixed(1)}%`,
        tone: weeklyFraudGrowthPct >= 0 ? "up" : "down",
      },
      {
        label: "Average Model Confidence",
        value: `${avgModelConfidence.toFixed(1)}%`,
        change: "+1.2%",
        tone: "up-good",
      },
      {
        label: "Average Detection Time",
        value: `${avgDetectionTime.toFixed(1)} min`,
        change: "↓ 0.3 min",
        tone: "down-good",
      },
    ];

    const enhancedCategories = categories
      .map(([label, volume]) => {
        const seed = Math.abs(hashString(`${label}-${volume}`));
        const growthPct = Number((((seed % 220) - 70) / 10).toFixed(1));
        const numericVolume = Number(volume);
        const severity =
          numericVolume >= 280
            ? "critical"
            : numericVolume >= 180
            ? "high"
            : numericVolume >= 130
            ? "medium"
            : "low";

        return {
          label,
          volume: numericVolume,
          growthPct,
          severity,
        };
      })
      .sort((left, right) =>
        categorySortDescending ? right.volume - left.volume : left.volume - right.volume
      );

    const maxCategory = Math.max(...enhancedCategories.map((item) => item.volume), 1);

    const confusionMatrix = {
      tp: Math.round((realtime.analytics.total_analyzed || 142000) * 0.084),
      fp: Math.round((realtime.analytics.total_analyzed || 142000) * (modelPerformance.falsePositiveRate / 100)),
      fn: Math.round((realtime.analytics.total_analyzed || 142000) * 0.013),
      tn: Math.round((realtime.analytics.total_analyzed || 142000) * 0.861),
    };

    const rocPoints = [
      { fpr: 0, tpr: 0 },
      { fpr: 0.03, tpr: 0.41 },
      { fpr: 0.08, tpr: 0.67 },
      { fpr: 0.14, tpr: 0.81 },
      { fpr: 0.22, tpr: 0.9 },
      { fpr: 0.34, tpr: 0.95 },
      { fpr: 1, tpr: 1 },
    ];
    const rocPolyline = rocPoints
      .map((point) => `${20 + point.fpr * 300},${180 - point.tpr * 150}`)
      .join(" ");

    const handleChartMouseMove = (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const relativeX = event.clientX - rect.left;
      const safeWidth = rect.width || 1;
      const index = Math.max(0, Math.min(detectedSeries.length - 1, Math.round((relativeX / safeWidth) * (detectedSeries.length - 1))));
      if (detectedSeries.length === 0) {
        setAnalyticsTooltip(null);
        return;
      }

      const targetPoint = detectedPoints[index] || detectedPoints[0];
      setAnalyticsTooltip({
        x: targetPoint.x,
        y: targetPoint.y,
        label: seriesLabels[index] || `T${index + 1}`,
        detected: detectedSeries[index],
        growth: growthSeries[index],
      });
    };

    return (
      <>
        <div className="section-head">
          <h2>Analytics</h2>
          <p>Fraud trends and detection performance.</p>
        </div>
        <div className="analytics-kpi-grid">
          {kpiCards.map((item) => (
            <div className="stat-card analytics-kpi-card" key={item.label}>
              <div className="stat-top">
                <span>{item.label}</span>
                <span className={`kpi-trend ${item.tone}`}>
                  {item.tone.startsWith("down") ? "↓" : "↑"} {item.change.replace(/[↑↓]\s?/, "")}
                </span>
              </div>
              <div className="stat-value">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="panel large-chart analytics-chart-panel">
          <div className="analytics-chart-head">
            <h3>Fraud Growth vs Detection</h3>
            <div className="analytics-filters">
              {[
                { key: "7d", label: "7d" },
                { key: "30d", label: "30d" },
                { key: "90d", label: "90d" },
              ].map((windowOption) => (
                <button
                  key={windowOption.key}
                  className={analyticsWindow === windowOption.key ? "active" : ""}
                  onClick={() => setAnalyticsWindow(windowOption.key)}
                >
                  {windowOption.label}
                </button>
              ))}
            </div>
          </div>
          <div
            className="analytics-chart-wrap"
            onMouseMove={handleChartMouseMove}
            onMouseLeave={() => setAnalyticsTooltip(null)}
          >
            <svg viewBox="0 0 760 250" className="chart-svg">
              <polygon className="area-shade detected" points={detectedAreaPoints} />
              <polygon className="area-shade growth" points={growthAreaPoints} />
              <polyline
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                points={detectedPoints.map((point) => `${point.x},${point.y}`).join(" ")}
              />
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                points={growthPoints.map((point) => `${point.x},${point.y}`).join(" ")}
              />
              {anomalyPoints.map((point) => (
                <circle key={`anomaly-${point.index}`} className="analytics-anomaly" cx={point.x} cy={point.y} r="4.5" />
              ))}
            </svg>
            {analyticsTooltip ? (
              <div className="analytics-tooltip" style={{ left: `${(analyticsTooltip.x / chartWidth) * 100}%`, top: `${(analyticsTooltip.y / chartHeight) * 100}%` }}>
                <strong>{analyticsTooltip.label}</strong>
                <span>Detected: {analyticsTooltip.detected}</span>
                <span>Growth: {analyticsTooltip.growth}</span>
              </div>
            ) : null}
          </div>
          <div className="analytics-legend">
            <span>
              <i className="legend-line detected"></i> Detection volume (red)
            </span>
            <span>
              <i className="legend-line growth"></i> Fraud growth (green)
            </span>
            <span>
              <i className="legend-dot"></i> Anomaly spike
            </span>
          </div>
        </div>

        <div className="two-col">
          <div className="panel donut-wrap">
            <h3>Risk Distribution</h3>
            <div className="donut" style={analyticsDonut}></div>
            <ul className="legend">
              <li>
                <span className="dot blue"></span> Low <b>{analyticsDist.low}%</b>
              </li>
              <li>
                <span className="dot amber"></span> Medium <b>{analyticsDist.medium}%</b>
              </li>
              <li>
                <span className="dot red"></span> High <b>{analyticsDist.high}%</b>
              </li>
            </ul>
          </div>
          <div className="panel analytics-category-panel">
            <div className="analytics-category-head">
              <h3>Fraud Categories</h3>
              <button onClick={() => setCategorySortDescending((prev) => !prev)}>
                Sort by volume {categorySortDescending ? "↓" : "↑"}
              </button>
            </div>
            {analyticsDrilldown ? <p className="analytics-drilldown-note">Drill-down focus: {analyticsDrilldown}</p> : null}
            <div className="hbars enhanced">
              {enhancedCategories.map((category) => (
                <div key={category.label} className="category-row">
                  <div className="category-meta">
                    <span>{category.label}</span>
                    <small className={`severity-chip ${category.severity}`}>
                      {category.severity.charAt(0).toUpperCase() + category.severity.slice(1)}
                    </small>
                  </div>
                  <i style={{ width: `${(category.volume / maxCategory) * 100}%` }}></i>
                  <div className="category-foot">
                    <b>{category.volume}</b>
                    <em className={`category-growth ${category.growthPct >= 0 ? "up" : "down"}`}>
                      {category.growthPct >= 0 ? "↑" : "↓"} {Math.abs(category.growthPct)}%
                    </em>
                    <button onClick={() => setAnalyticsDrilldown(category.label)}>Drill down</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel analytics-model-panel">
          <h3>Model Performance</h3>
          <div className="analytics-model-metrics">
            <div>
              <span>Precision</span>
              <b>{modelPerformance.precision}%</b>
            </div>
            <div>
              <span>Recall</span>
              <b>{modelPerformance.recall}%</b>
            </div>
            <div>
              <span>F1 score</span>
              <b>{modelPerformance.f1}%</b>
            </div>
          </div>
          <div className="analytics-model-grid">
            <div className="confusion-matrix">
              <h4>Confusion Matrix</h4>
              <div className="matrix-grid">
                <div className="matrix-cell tp">
                  <span>TP</span>
                  <b>{confusionMatrix.tp.toLocaleString()}</b>
                </div>
                <div className="matrix-cell fp">
                  <span>FP</span>
                  <b>{confusionMatrix.fp.toLocaleString()}</b>
                </div>
                <div className="matrix-cell fn">
                  <span>FN</span>
                  <b>{confusionMatrix.fn.toLocaleString()}</b>
                </div>
                <div className="matrix-cell tn">
                  <span>TN</span>
                  <b>{confusionMatrix.tn.toLocaleString()}</b>
                </div>
              </div>
            </div>
            <div className="roc-panel">
              <h4>ROC Curve</h4>
              <svg viewBox="0 0 340 200" className="roc-svg">
                <line x1="20" y1="180" x2="320" y2="30" stroke="#94a3b8" strokeDasharray="5 5" />
                <polyline fill="none" stroke="#2f67da" strokeWidth="3" points={rocPolyline} />
              </svg>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderReports = () => {
    const reportAlertFeed = liveDetections.slice(0, 4).map((event) => ({
      id: event.id,
      text:
        event.type === "Bot Network"
          ? "New bot cluster detected"
          : event.type === "Fake Engagement"
          ? "Fake influencer detected"
          : "Suspicious engagement spike",
      detail: `${event.user} · ${event.region} · ${event.risk}% risk`,
      severity: event.severity,
      timestamp: event.timestamp,
    }));

    const uniqueRiskLevels = ["All", "Low", "Medium", "High"];
    const uniqueFraudCategories = ["All", ...new Set(reports.map((report) => report.fraudCategory))];
    const uniqueRegions = ["All", ...new Set(reports.map((report) => report.region))];
    const uniqueReportTypes = ["All", ...new Set(reports.map((report) => report.reportType))];

    const startDate = reportFilters.startDate ? new Date(reportFilters.startDate) : null;
    const endDate = reportFilters.endDate ? new Date(reportFilters.endDate) : null;
    if (endDate) endDate.setHours(23, 59, 59, 999);

    const filteredReports = reports
      .filter((report) => {
        const reportDate = new Date(report.createdAt || Date.now());
        if (startDate && reportDate < startDate) return false;
        if (endDate && reportDate > endDate) return false;
        if (reportFilters.riskLevel !== "All" && report.riskLevel !== reportFilters.riskLevel) return false;
        if (reportFilters.fraudCategory !== "All" && report.fraudCategory !== reportFilters.fraudCategory) return false;
        if (reportFilters.region !== "All" && report.region !== reportFilters.region) return false;
        if (reportFilters.reportType !== "All" && report.reportType !== reportFilters.reportType) return false;
        if (activeReportCategory !== "All" && report.reportCategory !== activeReportCategory) return false;
        return true;
      })
      .sort((left, right) => {
        const dateDiff = new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
        if (dateDiff !== 0) return dateDiff;
        return right.riskScore - left.riskScore;
      });

    const groupedReports = reportCategoryDefinitions
      .map((group) => ({
        ...group,
        reports: filteredReports.filter((report) => report.reportCategory === group.label),
      }))
      .filter((group) => group.reports.length > 0);

    const categoryCounts = reportCategoryDefinitions.reduce(
      (acc, group) => ({
        ...acc,
        [group.label]: reports.filter((report) => report.reportCategory === group.label).length,
      }),
      {}
    );

    return (
      <>
        <div className="section-head report-header">
          <div>
            <h2>Reports</h2>
            <p>Generate and download fraud risk summaries.</p>
          </div>
          <button className="dark-btn" onClick={openCreateReportModal}>
            New Report
          </button>
        </div>

        <div className="reports-top-grid">
          <div className="panel report-live-feed-panel">
            <div className="panel-head-row">
              <h3>Real-time Alerts Feed</h3>
              <span className="monitor-live-pill">
                <i></i>
                Live stream
              </span>
            </div>
            <ul className="report-alert-feed">
              {reportAlertFeed.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.text}</strong>
                    <p>{item.detail}</p>
                  </div>
                  <span className={`severity-chip ${item.severity.toLowerCase()}`}>{item.severity}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel report-schedule-panel">
            <h3>Scheduling (Enterprise)</h3>
            <p className="schedule-summary">Schedule → Every {reportSchedule.weeklyDay} {reportSchedule.weeklyTime}</p>
            <div className="report-schedule-options">
              <label>
                <input
                  type="checkbox"
                  checked={reportSchedule.daily}
                  onChange={(event) =>
                    setReportSchedule((prev) => ({ ...prev, daily: event.target.checked }))
                  }
                />
                Daily auto reports
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={reportSchedule.weekly}
                  onChange={(event) =>
                    setReportSchedule((prev) => ({ ...prev, weekly: event.target.checked }))
                  }
                />
                Weekly fraud summary
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={reportSchedule.realtime}
                  onChange={(event) =>
                    setReportSchedule((prev) => ({ ...prev, realtime: event.target.checked }))
                  }
                />
                Real-time alerts
              </label>
            </div>
            <div className="report-schedule-inline">
              <select
                value={reportSchedule.weeklyDay}
                onChange={(event) =>
                  setReportSchedule((prev) => ({ ...prev, weeklyDay: event.target.value }))
                }
              >
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <input
                type="time"
                value={reportSchedule.weeklyTime}
                onChange={(event) =>
                  setReportSchedule((prev) => ({ ...prev, weeklyTime: event.target.value }))
                }
              />
            </div>
            <small>{scheduleSummary}</small>
          </div>
        </div>

        <div className="panel report-filters-panel">
          <div className="report-filters-grid">
            <label>
              Date from
              <input
                type="date"
                value={reportFilters.startDate}
                onChange={(event) =>
                  setReportFilters((prev) => ({ ...prev, startDate: event.target.value }))
                }
              />
            </label>
            <label>
              Date to
              <input
                type="date"
                value={reportFilters.endDate}
                onChange={(event) =>
                  setReportFilters((prev) => ({ ...prev, endDate: event.target.value }))
                }
              />
            </label>
            <label>
              Risk level
              <select
                value={reportFilters.riskLevel}
                onChange={(event) =>
                  setReportFilters((prev) => ({ ...prev, riskLevel: event.target.value }))
                }
              >
                {uniqueRiskLevels.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Fraud category
              <select
                value={reportFilters.fraudCategory}
                onChange={(event) =>
                  setReportFilters((prev) => ({ ...prev, fraudCategory: event.target.value }))
                }
              >
                {uniqueFraudCategories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Region
              <select
                value={reportFilters.region}
                onChange={(event) =>
                  setReportFilters((prev) => ({ ...prev, region: event.target.value }))
                }
              >
                {uniqueRegions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Report type
              <select
                value={reportFilters.reportType}
                onChange={(event) =>
                  setReportFilters((prev) => ({ ...prev, reportType: event.target.value }))
                }
              >
                {uniqueReportTypes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="report-category-tabs">
          <button
            className={activeReportCategory === "All" ? "active" : ""}
            onClick={() => setActiveReportCategory("All")}
          >
            All Reports ({reports.length})
          </button>
          {reportCategoryDefinitions.map((category) => (
            <button
              key={category.label}
              className={activeReportCategory === category.label ? "active" : ""}
              onClick={() => setActiveReportCategory(category.label)}
            >
              {category.emoji} {category.label} ({categoryCounts[category.label] || 0})
            </button>
          ))}
        </div>

        <div className="panel must-note">MUST REPORT: Daily Fraud Risk Snapshot is required every day.</div>

        <div className="report-group-list">
          {groupedReports.length === 0 ? (
            <div className="panel">No reports match the selected filters.</div>
          ) : (
            groupedReports.map((group) => (
              <section key={group.label} className="report-group-section">
                <h3>
                  {group.emoji} {group.label}
                </h3>
                <div className="report-list">
                  {group.reports.map((row) => (
                    <article
                      className="panel report-row rich"
                      key={row.id}
                      onClick={() => openReportPreview(row)}
                    >
                      <div className="report-row-main">
                        <h4>📄 {row.title}</h4>
                        <p>
                          {row.meta} · {row.region} · {row.fraudCategory}
                        </p>
                        <div className="report-tags-inline">
                          <span className={`risk-badge ${row.riskLevel.toLowerCase()}`}>
                            {row.riskScore}% {row.riskLevel} Risk
                          </span>
                          <span className="confidence-pill">Confidence {row.confidence}%</span>
                          <span className={`severity-chip ${row.severity.toLowerCase()}`}>{row.severity}</span>
                        </div>
                        {row.status === "Processing" ? (
                          <div className="report-progress">
                            <div className="report-progress-head">
                              <span>{row.stage || reportProcessingStages[0]}</span>
                              <strong>{Math.max(1, row.progress || 0)}%</strong>
                            </div>
                            <div
                              className="report-progress-track"
                              role="progressbar"
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-valuenow={Math.max(1, row.progress || 0)}
                            >
                              <i style={{ width: `${Math.max(1, row.progress || 0)}%` }}></i>
                            </div>
                          </div>
                        ) : null}
                      </div>
                      <div className="report-actions" onClick={(event) => event.stopPropagation()}>
                        <span className={`pill ${row.status === "Ready" ? "ready" : "processing"}`}>
                          {row.status === "Processing" ? (
                            <>
                              <span className="pill-loader" aria-hidden="true"></span>
                              Processing
                            </>
                          ) : (
                            row.status
                          )}
                        </span>
                        <button title="Quick Download" onClick={() => downloadReport(row.title)} disabled={row.status === "Processing"}>
                          ⇩
                        </button>
                        <div className="report-export-wrap">
                          <button
                            title="Export options"
                            onClick={() =>
                              setReportExportOpenId((prev) => (prev === row.id ? null : row.id))
                            }
                          >
                            Export ▾
                          </button>
                          {reportExportOpenId === row.id ? (
                            <div className="report-export-menu">
                              {reportExportOptions.map((option) => (
                                <button key={option} onClick={() => exportReport(row, option)}>
                                  {option}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>

        {reportCreateOpen ? (
          <div className="report-create-backdrop" onClick={() => setReportCreateOpen(false)}>
            <div className="report-create-modal" onClick={(event) => event.stopPropagation()}>
              <div className="report-create-head">
                <div>
                  <h3>Generate New Report</h3>
                  <p>Select a report template to begin AI-powered analysis.</p>
                </div>
                <button onClick={() => setReportCreateOpen(false)}>✕</button>
              </div>
              <div className="report-create-body">
                {reportTypeOptions.map((option) => (
                  <button
                    type="button"
                    key={option.title}
                    className={`report-type-option ${selectedReportType === option.title ? "selected" : ""}`}
                    onClick={() => setSelectedReportType(option.title)}
                  >
                    <strong>{option.title}</strong>
                    <span>{option.description}</span>
                  </button>
                ))}
              </div>
              <div className="report-create-actions">
                <button className="outline-btn" onClick={() => setReportCreateOpen(false)}>
                  Cancel
                </button>
                <button
                  className="dark-btn"
                  onClick={generateSelectedReport}
                  disabled={!selectedReportType || creatingReport}
                >
                  {creatingReport ? "Generating..." : "Generate"}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {reportPreview ? (
          <div className="report-drawer-backdrop" onClick={() => setReportPreview(null)}>
            <aside className="report-drawer" onClick={(event) => event.stopPropagation()}>
              <div className="report-drawer-head">
                <div>
                  <h3>{reportPreview.title}</h3>
                  <p>
                    {reportPreview.meta} · {reportPreview.region} · {reportPreview.reportType}
                  </p>
                </div>
                <button onClick={() => setReportPreview(null)}>✕</button>
              </div>

              <div className="report-drawer-body">
                <section>
                  <h4>Fraud Summary</h4>
                  <p>{reportPreview.fraudSummary}</p>
                </section>

                <section>
                  <h4>Risk Distribution</h4>
                  <div className="drawer-risk-bars">
                    <div>
                      <span>Low</span>
                      <i style={{ width: `${reportPreview.riskDistribution.low}%` }}></i>
                      <b>{reportPreview.riskDistribution.low}%</b>
                    </div>
                    <div>
                      <span>Medium</span>
                      <i style={{ width: `${reportPreview.riskDistribution.medium}%` }}></i>
                      <b>{reportPreview.riskDistribution.medium}%</b>
                    </div>
                    <div>
                      <span>High</span>
                      <i style={{ width: `${reportPreview.riskDistribution.high}%` }}></i>
                      <b>{reportPreview.riskDistribution.high}%</b>
                    </div>
                  </div>
                </section>

                <section>
                  <h4>Top Suspicious Accounts</h4>
                  <ul className="drawer-account-list">
                    {reportPreview.topSuspiciousAccounts.map((account) => (
                      <li key={`${account.handle}-${account.reason}`}>
                        <span>{account.handle}</span>
                        <small>{account.reason}</small>
                        <b>{account.risk}%</b>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h4>Feature Importance</h4>
                  <div className="drawer-feature-bars">
                    {reportPreview.featureImportance.map((feature) => (
                      <div key={feature.label}>
                        <span>{feature.label}</span>
                        <i style={{ width: `${feature.score}%` }}></i>
                        <b>{feature.score}%</b>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h4>Behavioural Patterns</h4>
                  <ul className="drawer-behavior-list">
                    {reportPreview.behaviorPatterns.map((pattern) => (
                      <li key={pattern}>{pattern}</li>
                    ))}
                  </ul>
                </section>
              </div>
            </aside>
          </div>
        ) : null}
      </>
    );
  };

  const renderPage = () => {
    if (activePage === "Overview") return renderOverview();
    if (activePage === "Detection") return renderDetection();
    if (activePage === "Behavioral Analysis") return renderBehavioral();
    if (activePage === "Network Graph") return renderNetwork();
    if (activePage === "Analytics") return renderAnalytics();
    return renderReports();
  };

  const renderLandingContent = () => (
    <>
      <section className="hero">
        <div>
          <p className="hero-tag">AI-Powered Fraud Detection</p>
          <h1>DetectX – Fake Profile Detection Platform</h1>
          <p className="hero-sub">
            Behavioral and Graph-Based Fraud Detection for Social Media. Identify suspicious
            accounts with explainable ML insights.
          </p>
          <div className="hero-actions">
            <button className="dark-btn" onClick={() => setScreen("dashboard")}> 
              Try Detection →
            </button>
            <button className="outline-btn" onClick={() => setScreen("dashboard")}>
              View Dashboard
            </button>
          </div>
        </div>
        <div className="hero-illustration">
          {heroNodes.map((point, idx) => (
            <span
              key={idx}
              className={`node ${point.type}`}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                width: `${point.size + 2}px`,
                height: `${point.size + 2}px`,
              }}
            ></span>
          ))}
        </div>
      </section>

      <section className="features" id="features">
        <h2>Features</h2>
        <p>Everything you need to detect and analyze fraudulent social media accounts.</p>
        <div className="feature-grid">
          {featureCards.map((item) => (
            <article key={item.title} className="feature-card">
              <div className="feature-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );

  return (
    <div className={`app-shell ${isDark ? "dark" : ""}`}>
      {screen === "landing" ? (
        <>
          <header className="landing-header">
            <div className="brand">
              <DetectXLogo />
              <strong>DetectX</strong>
            </div>
            <nav>
              <a className="nav-link active" href="#features">
                Features
              </a>
              <button className="nav-link" onClick={() => setScreen("dashboard")}>
                Dashboard
              </button>
            </nav>
          </header>

          <main className="landing-main">{renderLandingContent()}</main>

          <footer className="landing-footer">
            <span>© DetectX</span>
            <span>© 2026 DetectX. All rights reserved.</span>
          </footer>
        </>
      ) : (
        <div className="dashboard-layout">
          <aside className="sidebar">
            <div className="brand side-brand">
              <DetectXLogo />
              <strong>DetectX</strong>
            </div>
            <ul>
              {navItems.map((item) => (
                <li
                  key={item}
                  className={activePage === item ? "active" : ""}
                  onClick={() => setActivePage(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </aside>

          <div className="dashboard-main">
            <header className="topbar">
              <button className="close" onClick={() => setScreen("landing")}>
                ×
              </button>
              <div className="search-row">
                <input placeholder="Search" />
              </div>
              <div className="top-actions">
                <button title="Theme" onClick={() => setIsDark((value) => !value)}>
                  {isDark ? "☀" : "☾"}
                </button>
                <div className="user-chip">
                  <strong>{userProfile.name}</strong>
                  <span>{userProfile.role}</span>
                </div>
                <button className="logout-btn" onClick={handleLogout} title={`Last login: ${userProfile.last_login}`}>
                  Log out
                </button>
              </div>
            </header>

            <section className="content">
              <div className="live-indicator">
                <span className={`live-dot ${liveState.isLive ? "on" : "off"}`}></span>
                {liveState.isLive ? "Real-time connected" : "Reconnecting..."}
                {liveState.at ? ` · ${liveState.at.toLocaleTimeString()}` : ""}
              </div>
              {renderPage()}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
