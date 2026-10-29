import { useEffect } from "react";
import { GlobalSearchBox } from "../features/search";

export default function HomePage() {
	useEffect(() => {
		document.title = "Home | MyApp";
	}, []);

	return (
		<main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<h1 className="text-2xl font-bold mb-6">Home</h1>
			<GlobalSearchBox placeholder="Search accounts, contacts, opportunities..." />
		</main>
	);
}
