import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    annotationPlugin,
    zoomPlugin
);

const BarChart = () => {
    const [chartData, setChartData] = useState({
        datasets: [],
    });

    const [averageCurrent, setAverageCurrent] = useState(0);
    const [fetchData, setFetchData] = useState(true); // State to control data fetching
    const [dataPointsCount, setDataPointsCount] = useState(0); // State to store the count of data points

    // Function to handle zoom event
    // Function to handle zoom event
    // Function to handle zoom event
    const handleZoom = ({ chart }) => {
        const datasets = chart.data.datasets;
        let count = 0;
        let sum = 0;

        datasets.forEach(dataset => {
            if (dataset.label === 'Current (A)') {
                const scale = chart.scales.x;
                if (scale) {
                    const visibleData = dataset.data.slice(Math.max(scale.min, 0), Math.min(scale.max + 1, dataset.data.length));
                    count = visibleData.length; // Counting visible data points
                    sum = visibleData.reduce((acc, val) => acc + val, 0); // Summing up visible data
                }
            }
        });

        setDataPointsCount(count); // Update the state with the count of data points

        const average = count > 0 ? sum / count : 0;
        setAverageCurrent(average.toFixed(2));
    };


    const [chartOptions, setChartOptions] = useState({
        plugins: {
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'x',
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true,
                    },
                    mode: 'x',
                    animation: {
                        duration: 1000,
                    },
                    onZoom: handleZoom,
                },
            },
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        yMin: 300,
                        yMax: 300,
                        borderColor: 'rgb(0,0,0)',
                        borderWidth: 1.5,
                        borderDash: [6, 6],
                        label: {
                            enabled: true,
                            content: 'Threshold: 200',
                            position: 'end',
                            backgroundColor: 'rgba(255, 99, 132, 0.7)',
                            color: 'white',
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        },
        maintainAspectRatio: false,
        responsive: true,
        animation: {
            duration: 1500,
        },
        scales: {
            x: {
                type: 'category', // Assuming x-axis is category type
                // Update the desired scale range here
                min: 0,
                max: 100, // Example range, adjust as needed
            },
            y: {
                max: 400,
                ticks: {
                    stepSize: 80,
                },
            },
            y1: {
                position: 'right',
                max: 120,
                ticks: {
                    stepSize: 20,
                },
            },
        },
    });

    useEffect(() => {
        const fetchDataFromAPI = async () => {
            try {
                const response = await fetch('https://ultraehp.com/next/data.json');
                const data = await response.json();

                const labels = data.map(item => new Date(item.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                const data1 = data.map(item => item.Current_A);
                const data2 = data.map(item => item.Temperature_C);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Current (A)',
                            data: data1,
                            borderColor: 'rgb(53, 162, 235)',
                            borderWidth: 1.5,
                            backgroundColor: context => (context.raw > 200 ? 'rgba(255, 0, 0, 0.4)' : 'rgba(53, 162, 235, 0.4)'),
                            borderCapStyle: 'round',
                            borderJoinStyle: 'round',
                            yAxisID: 'y',
                        },
                        {
                            label: 'Temperature (C)',
                            data: data2,
                            borderWidth: 1.5,
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.4)',
                            borderCapStyle: 'round',
                            borderJoinStyle: 'round',
                            yAxisID: 'y1',
                        },
                    ],
                });

                const sum = data1.reduce((acc, val) => acc + val, 0);
                const average = data1.length > 0 ? sum / data1.length : 0;
                setAverageCurrent(average.toFixed(2));

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const interval = setInterval(() => {
            if (fetchData) {
                fetchDataFromAPI();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [fetchData]);

    const toggleFetchData = () => {
        setFetchData(prevState => !prevState);
    };

    return (
        <div className='w-full md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white'>
            <Line
                id='myChart'
                data={chartData}
                options={chartOptions}
            />



            <div className='w-[600px] border border-black mx-auto'>
                <div className="left w-1/2">
                    <span>平均血糖：<b className='font-extrabold average-mg'>{averageCurrent}</b></span>
                </div>
                <div className="right w-1/2 border">
                    <span>平均溫度：<b className='font-extrabold'></b></span>
                </div>
                <div className="right w-1/2 border">
                    <span>數據點數量<b className='dots font-extrabold'>{dataPointsCount}</b></span>
                </div>

                <div className="right w-1/2 border">
                    <span>CurrentA<b className='CurrentA font-extrabold'>{dataPointsCount}</b></span>
                </div>


                <div className="right w-1/2 border">
                    <span>總數：<b className='sum font-extrabold'></b></span>
                </div>

                <button
                    type='button'
                    className={`py-2 px-4 runded-3xl ${fetchData ? 'bg-rose-500 text-white' : 'bg-black text-white'
                        }`}
                    onClick={toggleFetchData}
                >
                    {fetchData ? 'Stop Fetch Data' : 'Start Fetch Data'}
                </button>
                <div className="note">
                    {fetchData ? 'Fetching data  ......' : 'Stop Fetch Data!'}
                </div>

                <div>
                    目前資料筆數：<p className='currentA'></p>
                </div>
            </div>
        </div>
    );
};

export default BarChart;
