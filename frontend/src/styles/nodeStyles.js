// nodeStyles.js
// Shared styling constants and utilities for all nodes

export const nodeStyles = {
  container: {
    minWidth: '200px',
    backgroundColor: '#ffffff',
    border: '1px solid #e1e5e9',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e1e5e9',
    padding: '8px 12px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a1a1a',
    display: 'flex',
    alignItems: 'center',
  },
  content: {
    padding: '12px',
    fontSize: '13px',
    color: '#4a4a4a',
  },
  input: {
    width: '100%',
    padding: '6px 8px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '13px',
    marginTop: '4px',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '6px 8px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '13px',
    marginTop: '4px',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#6b7280',
  },
  textarea: {
    width: '100%',
    minHeight: '60px',
    padding: '6px 8px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '13px',
    marginTop: '4px',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
};

export const handleStyles = {
  default: {
    width: '10px',
    height: '10px',
    background: '#3b82f6',
    border: '2px solid #ffffff',
  },
};

