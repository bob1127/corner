import React, { useState, useEffect } from 'react';
import { Accordion, AccordionItem } from "@nextui-org/accordion";

const RecentOrders = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Fetch data from the API when the component mounts
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('https://ultraehp.com/next/data.json');
            const result = await response.json();
            if (Array.isArray(result)) {
                setData(result);
            } else {
                console.error('Error: Data fetched is not an array', result);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Function to calculate average Current_A
    const calculateAverageCurrentA = () => {
        if (!Array.isArray(data) || data.length === 0) return 0;
        const sum = data.reduce((total, item) => total + item.Current_A, 0);
        return sum / data.length;
    };
    // Function to calculate average temperature
    const calculateAverageTemperature = () => {
        if (!Array.isArray(data) || data.length === 0) return 0;
        const sum = data.reduce((total, item) => total + item.Temperature_C, 0);
        return sum / data.length;
    };

    //溫度 

    const countCurrentAInRangeDrgree = () => {
        return data.filter(item => item.Temperature_C > 40 && item.Temperature_C <= 50).length;
    };

    const countCurrentAOverDrgree300 = () => {
        return data.filter(item => item.Temperature_C > 50).length;
    };
    const countCurrentAInRange126to200Drgree = () => {
        return data.filter(item => item.Temperature_C > 30 && item.Temperature_C <= 40).length;
    };
    const countCurrentAInRange90to126Drgree = () => {
        return data.filter(item => item.Temperature_C > 20 && item.Temperature_C <= 30).length;
    };

    const countCurrentAOver90Drgree = () => {
        return data.filter(item => item.Temperature_C < 20).length;
    };


     //血糖
    const countCurrentAInRange = () => {
        return data.filter(item => item.Current_A > 200 && item.Current_A <= 300).length;
    };

    const countCurrentAOver300 = () => {
        return data.filter(item => item.Current_A > 300).length;
    };
    const countCurrentAInRange126to200 = () => {
        return data.filter(item => item.Current_A > 126 && item.Current_A <= 200).length;
    };
    const countCurrentAInRange90to126 = () => {
        return data.filter(item => item.Current_A > 90 && item.Current_A <= 126).length;
    };

    const countCurrentAOver90 = () => {
        return data.filter(item => item.Current_A < 90).length;
    };


     //血糖
    const calculatePercentage02 = () => {
        if (!Array.isArray(data) || data.length === 0) return "0.00%";
        const count = countCurrentAOver300();
        const percentage = (count / data.length) * 100;
        return percentage.toFixed(2) + "%"; // Displaying percentage with two decimal places
    };

    const calculatePercentage01 = () => {
        if (!Array.isArray(data) || data.length === 0) return "0.00%";
        const count = countCurrentAInRange();
        const percentage = (count / data.length) * 100;
        return percentage.toFixed(2) + "%"; // Displaying percentage with two decimal places
    };
    const calculatePercentage03 = () => {
        if (!Array.isArray(data) || data.length === 0) return "0.00%";
        const count = countCurrentAInRange126to200();
        const percentage = (count / data.length) * 100;
        return percentage.toFixed(2) + "%"; // Displaying percentage with two decimal places
    };
    const calculatePercentage04 = () => {
        if (!Array.isArray(data) || data.length === 0) return "0.00%";
        const count = countCurrentAInRange90to126();
        const percentage = (count / data.length) * 100;
        return percentage.toFixed(2) + "%"; // Displaying percentage with two decimal places
    };

    const calculatePercentage05 = () => {
        if (!Array.isArray(data) || data.length === 0) return "0.00%";
        const count = countCurrentAOver90();
        const percentage = (count / data.length) * 100;
        return percentage.toFixed(2) + "%"; // Displaying percentage with two decimal places
    };

    //溫度

    const calculatePercentage02Drgree = () => {
        if (!Array.isArray(data) || data.length === 0) return "0.00%";
        const count = countCurrentAOverDrgree300();
        const percentage = (count / data.length) * 100;
        return percentage.toFixed(2) + "%"; // Displaying percentage with two decimal places
    };

    const calculatePercentage01Drgree = () => {
        if (!Array.isArray(data) || data.length === 0) return "0.00%";
        const count = countCurrentAInRangeDrgree();
        const percentage = (count / data.length) * 100;
        return percentage.toFixed(2) + "%"; // Displaying percentage with two decimal places
    };
    const calculatePercentage03Drgree = () => {
        if (!Array.isArray(data) || data.length === 0) return "0.00%";
        const count = countCurrentAInRange126to200Drgree();
        const percentage = (count / data.length) * 100;
        return percentage.toFixed(2) + "%"; // Displaying percentage with two decimal places
    };
    const calculatePercentage04Drgree = () => {
        if (!Array.isArray(data) || data.length === 0) return "0.00%";
        const count = countCurrentAInRange90to126Drgree();
        const percentage = (count / data.length) * 100;
        return percentage.toFixed(2) + "%"; // Displaying percentage with two decimal places
    };

    const calculatePercentage05Drgree = () => {
        if (!Array.isArray(data) || data.length === 0) return "0.00%";
        const count = countCurrentAOver90Drgree();
        const percentage = (count / data.length) * 100;
        return percentage.toFixed(2) + "%"; // Displaying percentage with two decimal places
    };





    //繪製圓餅圖
    const drawPieChart = () => {
        const chartData = {
            labels: ['> 300', '200 - 300', '126 - 200', '90 - 126', '< 90'],
            datasets: [{
                label: 'Percentage Distribution',
                data: [
                    calculatePercentage(countCurrentAOver300()),
                    calculatePercentage(countCurrentAInRange()),
                    calculatePercentage(countCurrentAInRange90to126()),
                    calculatePercentage(data.length - countCurrentAInRange() - countCurrentAInRange90to126() - countCurrentAOver300()),
                    calculatePercentage(data.length)
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ],
                borderWidth: 1
            }]
        };

        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        };

        if (chartRef && chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: chartData,
                options: options
            });
        }
    };







    return (
        <div className='w-full col-span-1 relative h-[90vh] lg:h-[70vh] m-auto p-4 border rounded-lg bg-slate-50 overflow-scroll'>

            <h1>檢測資料結果</h1>
            <Accordion className='border mt-[19px] px-4 bg-white rounded-xl py-5'>
                <AccordionItem key="1" aria-label="血糖值區間 資訊 (單位mg/dl)" title="血糖值區間 資訊 (單位mg/dl)">
                    <ul>
                        <li className='mt-3'>
                            <p className='text-[18px] font-bold'>平均血糖值</p>
                            <div className='average-dl block py-[20px] px-[20px]  bg-orange-500 rounded-xl text-[30px] text-white font-normal'>
                                {calculateAverageCurrentA().toFixed(2)} mg/dl
                            </div>
                        </li>
                        <li className='mt-3'>
                              <p className='text-[18px] font-bold'>大於300</p>
                            <div className='data-2 block py-[20px] px-[20px]  bg-black rounded-xl text-[30px] text-white font-normal'>{calculatePercentage02()}</div>
                        </li>
                        <li className='mt-3'>
                              <p className='text-[18px] font-bold'>200-300</p>
                            <div className='data-1 block py-[20px] px-[20px]  bg-black rounded-xl text-[30px] text-white font-normal'>{calculatePercentage01()}</div>
                        </li>
                        <li className='mt-3'>
                              <p className='text-[18px] font-bold'>126-200</p>
                            <div className='data-3 block py-[20px] px-[20px]  bg-black rounded-xl text-[30px] text-white font-normal'>

                                {calculatePercentage03()}
                            </div>
                        </li>
                        <li className='mt-3'>
                              <p className='text-[18px] font-bold'>90-126</p>
                            <div className='data-4 block py-[20px] px-[20px]  bg-black rounded-xl text-[30px] text-white font-normal'>
                                {calculatePercentage04()}
                            </div>
                        </li>
                        <li className='mt-3'>
                            <p className='text-[18px] font-bold'>小於90</p>
                            <div className='data-5 block py-[20px] px-[20px]  bg-black rounded-xl text-[30px] text-white font-normal'>
                                {calculatePercentage05()}
                            </div>
                         
                        </li>
                    </ul>

                    
                </AccordionItem>
            </Accordion>
            <Accordion className='border mt-[19px] px-4 bg-white rounded-xl py-5'>
                <AccordionItem key="2" aria-label="溫度區間 資訊 (單位°C)" title="溫度區間 資訊 (單位°C)">
                    

                    <ul>
                        <li className='mt-3'>
                            <p className='text-[18px] font-bold'>平均溫度</p>
                            <div className='average-degree block py-[20px] px-[20px]  bg-orange-500 rounded-xl text-[30px] text-white font-normal'>
                                {calculateAverageTemperature().toFixed(2)}°C
                            </div>
                        </li>
                        <li className='mt-3'>
                            <p className='text-[18px] font-bold'>大於50</p>
                            <div className='data-2 block py-[20px] px-[20px]  bg-black rounded-xl text-[30px] text-white font-normal'>{calculatePercentage02Drgree()}</div>
                        </li>
                        <li className='mt-3'>
                            <p className='text-[18px] font-bold'>40-50</p>
                            <div className='data-1 block py-[20px] px-[20px]  bg-black rounded-xl text-[30px] text-white font-normal'>{calculatePercentage01Drgree()}</div>
                        </li>
                        <li className='mt-3'>
                            <p className='text-[18px] font-bold'>30-40</p>
                            <div className='data-3 block py-[20px] px-[20px]  bg-black rounded-xl text-[30px] text-white font-normal'>

                                {calculatePercentage03Drgree()}
                            </div>
                        </li>
                        <li className='mt-3'>
                            <p className='text-[18px] font-bold'>20-30</p>
                            <div className='data-4 block py-[20px] px-[20px]  bg-black rounded-xl text-[30px] text-white font-normal'>
                                {calculatePercentage04Drgree()}
                            </div>
                        </li>
                        <li className='mt-3'>
                            <p className='text-[18px] font-bold'>小於20</p>
                            <div className='data-5 block py-[20px] px-[20px]  bg-black rounded-xl text-[30px] text-white font-normal'>
                                {calculatePercentage05Drgree()}
                            </div>

                        </li>
                    </ul>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default RecentOrders;
