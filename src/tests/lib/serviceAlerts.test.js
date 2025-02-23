import { filterActiveAlerts } from '$components/service-alerts/serviceAlertsHelper';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('filterActiveAlerts', () => {
	const fixedTime = new Date('2025-02-23T12:00:00Z').getTime();

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(fixedTime);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('returns the situation when active window (in milliseconds) encloses current time', () => {
		const situations = [
			{
				activeWindows: [{ from: fixedTime - 1000, to: fixedTime + 1000 }]
			}
		];
		const result = filterActiveAlerts(situations);
		expect(result).toHaveLength(1);
	});

	it('returns the situation when active window (in seconds) encloses current time', () => {
		// Timestamps provided in seconds; they’ll be normalized to ms.
		const situations = [
			{
				activeWindows: [{ from: (fixedTime - 1000) / 1000, to: (fixedTime + 1000) / 1000 }]
			}
		];
		const result = filterActiveAlerts(situations);
		expect(result).toHaveLength(1);
	});

	it('returns an empty array when current time is not within any active window', () => {
		const situations = [
			{
				activeWindows: [{ from: fixedTime + 1000, to: fixedTime + 2000 }]
			}
		];
		const result = filterActiveAlerts(situations);
		expect(result).toHaveLength(0);
	});

	it('returns the situation if one of multiple windows is active', () => {
		const situations = [
			{
				activeWindows: [
					{ from: fixedTime + 1000, to: fixedTime + 2000 }, // inactive window
					{ from: fixedTime - 5000, to: fixedTime + 5000 } // active window
				]
			}
		];
		const result = filterActiveAlerts(situations);
		expect(result).toHaveLength(1);
	});
});
