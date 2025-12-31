
import { useState } from 'react';
import { useStore } from './store';
import { SubmitModal } from './SubmitModal';
import { OnboardingFlow } from './components/OnboardingFlow';

const getApiUrl = () => {
    if (process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
    }
    if (process.env.NODE_ENV === 'production') {
        return '/api';
    }
    return 'http://localhost:8000';
};

const API_BASE_URL = getApiUrl();

export const SubmitButton = () => {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [modalError, setModalError] = useState(null);

    const handleSubmit = async () => {
        try {
            const payload = {
                nodes: nodes,
                edges: edges,
            };

            const response = await fetch(`${API_BASE_URL}/pipelines/parse`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setModalData(data);
            setModalError(null);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error submitting pipeline:', error);
            setModalError(error.message);
            setModalData(null);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalData(null);
        setModalError(null);
    };

    return (
        <>
            <div className="flex items-center justify-center py-5 bg-white border-t border-gray-200 relative">
                <div className="relative">
                    <button 
                        type="button" 
                        onClick={handleSubmit}
                        className="px-5 py-2.5 text-base font-medium text-white bg-blue-600 border-none rounded-md cursor-pointer hover:bg-blue-700 active:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Submit Pipeline
                    </button>
                    <OnboardingFlow nodes={nodes} edges={edges} position="submit" />
                </div>
            </div>
            <SubmitModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                data={modalData}
                error={modalError}
            />
        </>
    );
}
