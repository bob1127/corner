import React, { useState, useEffect } from 'react';

const TopCards = () => {
    const [maxCurrentValue, setMaxCurrentValue] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://ultraehp.com/next/data.json');
                const data = await response.json();

                // Extracting the 'Current_A' values
                const currentAValues = data.map(item => item.Current_A);

                // Finding the maximum value of 'Current_A'
                const max = Math.max(...currentAValues);
                // Incrementally set the max value
                let currentValue = 0;
                const increment = () => {
                    if (currentValue < max) {
                        currentValue += 1;
                        setMaxCurrentValue(currentValue);
                        requestAnimationFrame(increment);
                    }
                };
                increment();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='grid lg:grid-cols-5 gap-4 p-4'>
            <div className='lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg'>
                <div className='flex flex-col w-full pb-4'>
                    <span className='text-[20px] font-bold'>
                        受試ID(編號):
                    </span>
                    <div className="bottom mt-4">
                        <p className='text-2xl max-number font-bold'>A123239</p>
                    </div>
                </div>
            </div>
            <div className='lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg'>
                <div className='flex flex-col w-full pb-4'>
                    <span className='text-[20px] font-bold'>
                        最高血糖值:
                    </span>
                    <div className="bottom mt-4">
                        <p className='text-2xl max-number font-bold'>{maxCurrentValue}</p>
                        <p className='text-gray-600'>mg/dl</p>
                    </div>
                </div>
            </div>
            {/* Other cards */}
        </div>
    );
}

export default TopCards;
