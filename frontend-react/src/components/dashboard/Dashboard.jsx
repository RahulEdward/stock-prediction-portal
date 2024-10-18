import { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    const [ticker, setTicker] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [plot, setPlot] = useState(null);
    const [ma100, setMA100] = useState(null);
    const [ma200, setMA200] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [mse, setMSE] = useState(null);
    const [rmse, setRMSE] = useState(null);
    const [r2, setR2] = useState(null);

    useEffect(() => {
        const fetchProtectedData = async () => {
            try {
                const response = await axiosInstance.get('/protected-view/');
                console.log(response.data); // Ensure the response is as expected
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchProtectedData();
    }, []); // Empty array means this runs only on mount

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // Reset error on submit
        try {
            const response = await axiosInstance.post('/predict/', { ticker });
            console.log(response.data);
            const backendRoot = import.meta.env.VITE_BACKEND_ROOT;
            const plotUrl = `${backendRoot}${response.data.plot_img}`
            console.log(plotUrl);
            setPlot(`${backendRoot}${response.data.plot_img}`);
            setMA100(`${backendRoot}${response.data.plot_100_dma}`);
            setMA200(`${backendRoot}${response.data.plot_200_dma}`);
            setPrediction(`${backendRoot}${response.data.plot_prediction}`);
            setMSE(response.data.mse);
            setRMSE(response.data.rmse);
            setR2(response.data.r2);
            
            // Handle any error from the response
            if (response.data.error) {
                setError(response.data.error);
            }
        } catch (error) {
            console.error('There was an error making the API request', error);
            setError('An error occurred while fetching predictions.'); // Optional user-friendly error message
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container'>
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            className='form-control' 
                            placeholder='Enter Stock Ticker' 
                            onChange={(e) => setTicker(e.target.value)} 
                            required
                        />
                        <small>{error && <div className='text-danger'>{error}</div>}</small>
                        <button type='submit' className='btn btn-info mt-3'>
                            {loading ? <span><FontAwesomeIcon icon={faSpinner} spin /> Please wait...</span> : 'See Prediction'}
                        </button>
                    </form>
                </div>

                {/* Print prediction plots */}
                {prediction && (
                    <div className="prediction mt-5">
                        <div className="p-3">
                            {plot && <img src={plot} alt="Stock Plot" style={{ maxWidth: '100%' }} />}
                        </div>
                        <div className="p-3">
                            {ma100 && <img src={ma100} alt="100 DMA" style={{ maxWidth: '100%' }} />}
                        </div>
                        <div className="p-3">
                            {ma200 && <img src={ma200} alt="200 DMA" style={{ maxWidth: '100%' }} />}
                        </div>
                        <div className="p-3">
                            {prediction && <img src={prediction} alt="Prediction Plot" style={{ maxWidth: '100%' }} />}
                        </div>
                        <div className="text-light p-3">
                            <h4>Model Evaluation</h4>
                            <p>Mean Squared Error (MSE): {mse}</p>
                            <p>Root Mean Squared Error (RMSE): {rmse}</p>
                            <p>R-Squared: {r2}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
