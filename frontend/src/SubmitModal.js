export const SubmitModal = ({ isOpen, onClose, data, error }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Pipeline Analysis Results</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none w-6 h-6 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5">
          {error ? (
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">✗</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
              ) : data ? (
            <div className="space-y-4">
              <div className="text-center">
                {data.is_dag ? (
                  <div className="text-green-500 text-5xl mb-4">✓</div>
                ) : (
                  <div className="text-red-500 text-5xl mb-4">✗</div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Number of Nodes</span>
                  <span className="text-sm font-semibold text-gray-900">{data.num_nodes}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Number of Edges</span>
                  <span className="text-sm font-semibold text-gray-900">{data.num_edges}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-600">Is DAG</span>
                  <span
                    className={`text-sm font-semibold ${
                      data.is_dag ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {data.is_dag ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              <div
                className={`mt-4 p-3 rounded-md ${
                  data.is_dag
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <p className="text-sm text-center">
                  {data.is_dag ? (
                    <span className="text-green-800">
                      ✓ Valid DAG (no cycles detected)
                    </span>
                  ) : (
                    <span className="text-red-800">
                      ✗ Contains cycles (not a valid DAG)
                    </span>
                  )}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

