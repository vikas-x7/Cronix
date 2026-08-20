import { FiSearch } from 'react-icons/fi';

interface NoSearchResultsProps {
  query: string;
  onClear?: () => void;
}

export default function NoSearchResults({
  query,
  onClear,
}: NoSearchResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-4 text-neutral-700">
        <FiSearch size={40} />
      </div>
      <h3 className="text-[15px] font-medium text-white">No results found</h3>
      <p className="mt-1 text-[13px] text-neutral-500 text-center max-w-sm">
        No results found for &quot;{query}&quot;. Try a different search term.
      </p>
      {onClear && (
        <button
          onClick={onClear}
          className="mt-4 rounded-[3px] bg-neutral-800 px-4 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-neutral-700 cursor-pointer"
        >
          Clear search
        </button>
      )}
    </div>
  );
}
