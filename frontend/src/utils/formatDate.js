export function formatDate(timestamp) {
	const date = new Date(parseInt(timestamp)); // Parse the timestamp to ensure it's an integer representing milliseconds
	const options = { day: "2-digit", month: "short", year: "numeric" };
	return date.toLocaleDateString("en-US", options);
}

// Example usage:
const timestamp = 1704067200000;
const formattedDate = formatDate(timestamp); // Output: "12 Dec 2023"