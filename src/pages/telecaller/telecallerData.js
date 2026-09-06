// Shared data for telecaller panel
export const mockLeads = [];

export const mockFollowups = [];

export const mockRemarks = [];

export const mockDocuments = [];

export const statusColors = {
  "New":                  { bg: "#EEF2FF", text: "#4338CA" },
  "Contacted":            { bg: "#FFF7ED", text: "#C2410C" },
  "Interested":           { bg: "#DCFCE7", text: "#15803D" },
  "Follow-up":            { bg: "#FEF9C3", text: "#A16207" },
  "Documents Pending":    { bg: "#FEF3C7", text: "#D97706" },
  "Application Submitted":{ bg: "#DBEAFE", text: "#1D4ED8" },
  "Converted":            { bg: "#D1FAE5", text: "#059669" },
  "Lost":                 { bg: "#FEE2E2", text: "#DC2626" },
};

export const priorityColors = {
  "Normal": { bg: "#F1F5F9", text: "#64748B" },
  "Medium": { bg: "#FFF7ED", text: "#EA580C" },
  "High":   { bg: "#FEF9C3", text: "#CA8A04" },
  "Urgent": { bg: "#FEE2E2", text: "#DC2626" },
};
