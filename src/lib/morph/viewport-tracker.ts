export interface ViewportTracker {
	visibleSections: string[];
	observe(): void;
	disconnect(): void;
}

/**
 * Creates a viewport tracker that monitors which page sections are visible
 * using IntersectionObserver with threshold [0, 0.1].
 *
 * @param sectionIds - Array of element IDs to observe
 * @returns A tracker with a reactive `visibleSections` array, `observe()` and `disconnect()` methods
 */
export function createViewportTracker(sectionIds: string[]): ViewportTracker {
	const visibleSections: string[] = [];
	let observer: IntersectionObserver | null = null;

	function observe(): void {
		if (observer) return;

		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const id = (entry.target as HTMLElement).id;
					if (entry.isIntersecting) {
						if (!visibleSections.includes(id)) {
							visibleSections.push(id);
						}
					} else {
						const index = visibleSections.indexOf(id);
						if (index !== -1) {
							visibleSections.splice(index, 1);
						}
					}
				});
			},
			{ threshold: [0, 0.1] },
		);

		sectionIds.forEach((id) => {
			const el = document.getElementById(id);
			if (el) {
				observer?.observe(el);
			}
		});
	}

	function disconnect(): void {
		if (observer) {
			observer.disconnect();
			observer = null;
		}
	}

	return { visibleSections, observe, disconnect };
}
