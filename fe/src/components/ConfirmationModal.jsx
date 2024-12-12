export const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            {/* Modal Container */}
            <div className="bg-white rounded-lg shadow-lg p-4 w-11/12 max-w-sm md:max-w-md lg:max-w-lg text-center">
                {/* Title */}
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-6">
                    Are you sure you want to delete this vacancy?
                </h2>

                {/* Buttons */}
                <div className="flex justify-end gap-4">
                    {/* Cancel Button */}
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-300 text-gray-700 text-sm md:text-base rounded-lg hover:bg-gray-400 active:bg-gray-500 transition duration-200"
                    >
                        Cancel
                    </button>

                    {/* Confirm Button */}
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 bg-red-500 text-white text-sm md:text-base rounded-lg hover:bg-red-600 active:bg-red-700 transition duration-200"
                    >
                        Delete
                    </button>

                </div>
            </div>
        </div>
    );
};
