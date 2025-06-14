import React, { useState, useMemo } from 'react';
import './weather.css'; // This line imports the CSS styles

// --- Reusable Animated Scene Components ---

const Sun = () => <div className="sun"></div>;
const Lightning = () => <div className="lightning"></div>;

const Cloud = ({ id, duration, delay, scale }) => {
    const style = {
        animationDuration: duration,
        animationDelay: delay,
        transform: `scale(${scale})`,
    };
    return <div className={`cloud cloud-${id}`} style={style}></div>;
};

const Raindrop = ({ delay }) => {
    const style = {
        left: `${Math.random() * 100}%`,
        animationDelay: delay,
    };
    return <div className="raindrop" style={style}></div>;
};

const Snowflake = ({ delay, duration }) => {
    const style = {
        left: `${Math.random() * 100}%`,
        animationDelay: delay,
        animationDuration: duration,
    };
    return <div className="snowflake" style={style}></div>;
};

// --- Main App Component ---

export default function App() {
    // State to track the current weather type
    const [weatherType, setWeatherType] = useState('clear');

    // Predefined data for each weather scene
    const mockWeatherData = {
        'clear': { name: 'Sunny Day', weather: [{ main: 'Clear', description: 'crisp and clear' }], main: { temp: 28 } },
        'clouds': { name: 'Cloudy Skies', weather: [{ main: 'Clouds', description: 'scattered clouds' }], main: { temp: 19 } },
        'rain': { name: 'Rainy Afternoon', weather: [{ main: 'Rain', description: 'gentle rain' }], main: { temp: 15 } },
        'storm': { name: 'Thunderstorm', weather: [{ main: 'Thunderstorm', description: 'better stay inside' }], main: { temp: 16 } },
        'snow': { name: 'Snowy Morning', weather: [{ main: 'Snow', description: 'blanket of snow' }], main: { temp: -2 } }
    };

    const currentData = mockWeatherData[weatherType];
    const weatherMain = currentData.weather[0].main;

    // Determine the CSS class for the background based on the weather
    const weatherClassMap = {
        'Clear': 'clear-sky',
        'Clouds': 'cloudy',
        'Rain': 'rainy',
        'Thunderstorm': 'stormy',
        'Snow': 'snowy',
    };
    const backgroundClass = weatherClassMap[weatherMain] || 'cloudy';

    // Memoize dynamic elements to avoid recalculating on every render
    const sceneElements = useMemo(() => {
        const elements = {
            raindrops: [],
            snowflakes: []
        };
        for (let i = 0; i < 100; i++) {
            elements.raindrops.push(<Raindrop key={i} delay={`${Math.random() * 2}s`} />);
            elements.snowflakes.push(<Snowflake key={i} delay={`${Math.random() * 10}s`} duration={`${5 + Math.random() * 5}s`} />);
        }
        return elements;
    }, []);

    return (
        <div className={`weather-container h-screen w-screen flex items-center justify-center ${backgroundClass}`}>
            {/* Animated Scene */}
            <div className="absolute top-0 left-0 w-full h-full">
                {weatherMain === 'Clear' && <Sun />}
                
                {['Clouds', 'Rain', 'Thunderstorm', 'Snow'].includes(weatherMain) && (
                    <>
                        <Cloud id={1} duration="25s" delay="0s" scale={1} />
                        <Cloud id={2} duration="35s" delay="-5s" scale={1} />
                        <Cloud id={3} duration="20s" delay="-10s" scale={0.7} />
                    </>
                )}

                {weatherMain === 'Thunderstorm' && <Lightning />}
                {['Rain', 'Drizzle', 'Thunderstorm'].includes(weatherMain) && sceneElements.raindrops}
                {weatherMain === 'Snow' && sceneElements.snowflakes}
            </div>

            {/* Weather Info Card */}
            <div className="info-card bg-black bg-opacity-20 text-white p-8 rounded-2xl shadow-2xl text-center z-20">
                <h1 className="text-4xl md:text-5xl font-bold tracking-wider">{currentData.name}</h1>
                <p className="text-xl md:text-2xl mt-2 capitalize">{currentData.weather[0].description}</p>
                <div className="flex items-center justify-center mt-6">
                    <p className="text-6xl md:text-8xl font-bold">{Math.round(currentData.main.temp)}</p>
                    <span className="text-4xl md:text-6xl font-light ml-2">°C</span>
                </div>
            </div>

            {/* Weather Controls */}
            <div className="weather-controls absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black bg-opacity-25 rounded-full shadow-lg z-30">
                <button onClick={() => setWeatherType('clear')} className="px-4 py-2 bg-blue-500 text-white rounded-full font-semibold">☀️ Sunny</button>
                <button onClick={() => setWeatherType('clouds')} className="px-4 py-2 bg-gray-500 text-white rounded-full font-semibold">☁️ Cloudy</button>
                <button onClick={() => setWeatherType('rain')} className="px-4 py-2 bg-indigo-500 text-white rounded-full font-semibold">🌧️ Rainy</button>
                <button onClick={() => setWeatherType('storm')} className="px-4 py-2 bg-gray-800 text-white rounded-full font-semibold">⛈️ Stormy</button>
                <button onClick={() => setWeatherType('snow')} className="px-4 py-2 bg-white text-blue-800 rounded-full font-semibold">❄️ Snowy</button>
            </div>
        </div>
    );
}
