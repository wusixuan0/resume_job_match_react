import React, { useState } from 'react';
import axios from 'axios';

const UploadPDF = ({ onUploadSuccess, onFormSubmit }) => {
    const [pdfFile, setPdfFile] = useState(null);
    const [version, setVersion] = useState('version2');
    const [modelName, setModelName] = useState('gemini-1.5-flash');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        setPdfFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!pdfFile) return;
        
        onFormSubmit();
        setIsLoading(true);
        setError('');

        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/match/';
        const formData = new FormData();
        formData.append('file', pdfFile);
        formData.append('version', version);
        formData.append('model_name', modelName);
        
        try {
            const response = await axios.post(API_BASE_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            onUploadSuccess(response.data);
            console.log(response.data);
            setIsLoading(false);
        } catch (error) {
            setError(error?.response?.data?.error || 'An error occurred');
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='pdf-form'>
            <select 
                value={version} 
                onChange={(e) => setVersion(e.target.value)}
                className="version-select v-select"
            >
                <option value="version1">Version 1</option>
                <option value="version2">Version 2 (recommend)</option>
            </select>
            <select 
                value={modelName} 
                onChange={(e) => setModelName(e.target.value)}
                className="version-select model-select"
            >
                <option value="gemini-1.5-flash">gemini-1.5-flash (recommend)</option>
                <option value="gemini-1.5-pro">gemini-1.5-pro (my API key usage is limited)</option>
                <option value="gemini-1.5-pro-exp-0801">gemini-1.5-pro-exp-0801</option>
            </select>
            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
            />
            <button 
                type="submit"
                className="submit-button pdf-input"
                disabled={isLoading || !pdfFile}
            >
                {isLoading ? 'Uploading...' : 'Upload'}
            </button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default UploadPDF;