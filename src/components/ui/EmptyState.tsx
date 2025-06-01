// src/components/ui/EmptyState.tsx

type Props = {
  message: string;
  // onClear?: () => void;
};

export default function EmptyState({ message /*, onClear */ }: Props) {
  return (
    <div className="text-center text-gray-400 mt-12">
      <div className="text-4xl mb-4">🤷‍♂️</div>
      <p className="text-lg">{message}</p>
      {/* {onClear && (
          <button
            onClick={onClear}
            className="mt-4 px-4 py-2 text-sm text-white bg-gray-600 hover:bg-gray-700 rounded"
          >
            Clear filters
          </button>
        )} */}
    </div>
  );
}
