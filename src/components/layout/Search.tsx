export default function Search() {
    return (
        <input
            type="text"
            className="block w-full pl-12 pr-4 py-3 bg-input-bg dark:bg-dark-input-bg border-none rounded-full text-txt-secondary dark:text-dark-txt-secondary placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            placeholder="Rechercher un fichier..."
        />
    );
}