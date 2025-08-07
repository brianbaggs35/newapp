// Mock react-icons for testing
import React from 'react';

export const HiChartPie = (props) => <svg {...props} data-testid="hi-chart-pie" />;
export const HiClipboard = (props) => <svg {...props} data-testid="hi-clipboard" />;
export const HiDocument = (props) => <svg {...props} data-testid="hi-document" />;
export const HiCog = (props) => <svg {...props} data-testid="hi-cog" />;
export const HiUsers = (props) => <svg {...props} data-testid="hi-users" />;
export const HiUser = (props) => <svg {...props} data-testid="hi-user" />;
export const HiUpload = (props) => <svg {...props} data-testid="hi-upload" />;
export const HiViewGrid = (props) => <svg {...props} data-testid="hi-view-grid" />;
export const HiExclamation = (props) => <svg {...props} data-testid="hi-exclamation" />;
export const HiDocumentReport = (props) => <svg {...props} data-testid="hi-document-report" />;
export const HiPlusCircle = (props) => <svg {...props} data-testid="hi-plus-circle" />;
export const HiPlay = (props) => <svg {...props} data-testid="hi-play" />;
export const HiTrash = (props) => <svg {...props} data-testid="hi-trash" />;
export const HiPencil = (props) => <svg {...props} data-testid="hi-pencil" />;
export const HiEye = (props) => <svg {...props} data-testid="hi-eye" />;

// Add missing icons used by MultiTenantDashboard
export const HiOfficeBuilding = (props) => <svg {...props} data-testid="hi-office-building" />;
export const HiClipboardList = (props) => <svg {...props} data-testid="hi-clipboard-list" />;
export const HiCheckCircle = (props) => <svg {...props} data-testid="hi-check-circle" />;
export const HiXCircle = (props) => <svg {...props} data-testid="hi-x-circle" />;
export const HiClock = (props) => <svg {...props} data-testid="hi-clock" />;
export const HiTrendingUp = (props) => <svg {...props} data-testid="hi-trending-up" />;
export const HiUserGroup = (props) => <svg {...props} data-testid="hi-user-group" />;

// Add more missing icons
export const HiPlus = (props) => <svg {...props} data-testid="hi-plus" />;
export const HiLogout = (props) => <svg {...props} data-testid="hi-logout" />;
export const HiMail = (props) => <svg {...props} data-testid="hi-mail" />;
export const HiCalendar = (props) => <svg {...props} data-testid="hi-calendar" />;
export const HiLockClosed = (props) => <svg {...props} data-testid="hi-lock-closed" />;

// This is a mock file, so we need at least one test to prevent Jest errors
describe('React Icons Mock', () => {
  it('exports all required icon components', () => {
    expect(HiChartPie).toBeDefined();
    expect(HiClipboard).toBeDefined();
    expect(HiDocument).toBeDefined();
  });
});