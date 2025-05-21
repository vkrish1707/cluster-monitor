'use client'

import api from '@/lib/api';
// Context hook to access cluster ID
import { useCluster } from '@/context/ClusterContext';
import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
interface DashboardProps {
    clusterId: string;
}

export default function Dashboard() {
    const { clusterId } = useCluster();
    // State to store raw data fetched from the API
    const [rawData, setRawData] = useState<{ iops: any[]; throughput: any[] } | null>(null);
    // State for loading indicator
    const [loading, setLoading] = useState(true);
    // State for error handling
    const [error, setError] = useState<string | null>(null);
    // States to hold individual metric values
    const [readIOP, setReadIOP] = useState(0);
    const [writeIOP, setWriteIOP] = useState(0);
    const [readThroughput, setReadThroughput] = useState(0);
    const [writeThroughput, setWriteThroughput] = useState(0);
    // Thresholds for anomaly detection
    const IOPS_ANOMALY_THRESHOLD = 100000;
    const THROUGHPUT_ANOMALY_THRESHOLD = 1800;

    function formatDateOnly(timestamp: string): string {
        const date = new Date(timestamp)
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }

    useEffect(() => {
        if (!clusterId) return;
        // Fetch metrics data from the API when clusterId changes
        setLoading(true);
        setError(null);
        api.get(`/clusters/${clusterId}/metrics`)
            .then(res => {
                setRawData(res.data);
                setReadIOP(res.data.readIOP || 0);
                setWriteIOP(res.data.writeIOP || 0);
                setReadThroughput(res.data.readThroughput || 0);
                setWriteThroughput(res.data.writeThroughput || 0);
            })
            .catch(err => {
                setError(err.message || 'Unknown error');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [clusterId]);


    // Format raw data into a structure suitable for the charts
    const sampleData = rawData
        ? rawData.iops.map((item, index) => ({
            time: item.timestamp,
            label: formatDateOnly(item.timestamp),
            readIOPS: item.read,
            writeIOPS: item.write,
            readThroughput: rawData.throughput[index]?.read || 0,
            writeThroughput: rawData.throughput[index]?.write || 0,
        }))
        : [];

    // Create a custom dot for anomalies on the chart
    const createAnomalyDot = (key: string, threshold: number) => {
        return ({ cx, cy, payload }: any): React.ReactElement<SVGCircleElement | SVGGElement> => {
            if (payload[key] > threshold) {
                return <circle key={`anomaly-circle-${cx}-${cy}`} cx={cx} cy={cy} r={5} fill="red" />;
            }
            return <g key={`anomaly-dot-${cx}-${cy}`} style={{ display: 'none' }} />;
        };
    };
    // Display loading, error, or no data messages
    if (loading) return <div className="text-white p-8">Loading metrics...</div>;
    if (error) return <div className="text-red-400 p-8">Error: {error}</div>;
    if (!rawData) return <div className="text-white p-8">No data available.</div>;
    return (

        <div className="space-y-10 px-[10px] pt-[5px] pb-10 bg-[#1b222b] text-white min-h-screen">
            <div className="flex justify-between items-center">
                <h2 className="text-[21px] pl-[17px] pt-[12px] text-white">Performance Metrics</h2>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                    <select
                        className="bg-[#222a33] text-gray-200 px-3 py-1 rounded-md outline-none border border-[#2f3b45] cursor-pointer"
                        defaultValue="7"
                    >
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="60">Last 60 days</option>
                    </select>
                </div>
            </div>

            {/* IOPS Graph Section */}
            {/* Container for the IOPS graph and related metrics */}
            <div>
                <h3 className="text-[18px] font-medium pl-[40px] mb-2">IOPS</h3>
                <div className="flex flex-col md:flex-row gap-4 items-end md:items-stretch w-full md:h-[200px] [&>*]:w-full md:[&>*]:w-auto">                    <div className="flex-1 bg-[#1b222b] p-5 pl-8 rounded-md relative h-full">
                    <div className="absolute top-0 right-4 text-[#ffffff]-400 text-[12px] mb-2">Dec. 5, 10:14am</div>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={sampleData}>
                            <XAxis
                                dataKey="time"
                                // Customize X-axis ticks and labels
                                stroke="#999"
                                ticks={[...new Set(sampleData.map(d => d.label))].map(dateStr => {
                                    const match = sampleData.find(d => d.label === dateStr)
                                    return match?.time || ''
                                })}
                                tickFormatter={(value, index) => {
                                    if (index === 0) return ''; // Skip first tick
                                    const date = new Date(value);
                                    return `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
                                }}
                            />
                            {/* Customize Y-axis */}
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#999' }}
                                // Customize Y-axis ticks and format
                                ticks={[0, 50000, 100000]}
                                tickFormatter={(value) => `${value / 1000}k`}
                            />
                            <CartesianGrid stroke="#2f3b45" horizontal={true} vertical={false} />
                            <Tooltip />
                            <Line type="linear" dataKey="readIOPS" stroke="#a855f7" strokeWidth={2}
                                dot={createAnomalyDot('readIOPS', IOPS_ANOMALY_THRESHOLD)} />
                            <Line type="linear" dataKey="writeIOPS" stroke="#22d3ee" strokeWidth={2} dot={createAnomalyDot('writeIOPS', IOPS_ANOMALY_THRESHOLD)} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                    {/* Display current Read and Write IOPS values */}
                    <div className="flex flex-col min-w-[180px] text-white text-sm md:mb-4 md:ml-0 ml-[40px] mt-4 md:mt-0">
                        <div className="text-gray-400 text-[18px] mb-0">IOPS</div>
                        <div className="bg-[#1c252e] p-4 border border-[#2C3A48] flex flex-col justify-center h-[165px]">
                            <div className="border-b border-[#2C3A48] pb-2 mb-2">
                                <div className="text-[#a6aaae]-500 text-[16px]">Read</div>
                                <div className="text-[#a855f7] text-lg font-semibold">{readIOP} <span className="text-sm font-normal">IOPS</span></div>
                            </div>
                            <div>
                                <div className="text-[#a6aaae]-500 text-[16px]">Write</div>
                                <div className="text-[#22d3ee] text-lg font-semibold"> {writeIOP} <span className="text-sm font-normal">IOPS</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Throughput Graph Section */}
            {/* Container for the Throughput graph and related metrics */}
            <div>
                <h3 className="text-[18px] font-medium mb-2 pl-[40px]">Throughput</h3>
                <div className="flex flex-col md:flex-row gap-4 items-end md:items-stretch w-full md:h-[200px] [&>*]:w-full md:[&>*]:w-auto">
                    <div className="flex-1 bg-[#1b222b] p-5 pl-8  rounded-md relative h-full">
                        <div className="absolute top-0 right-4 t text-[#ffffff]-400 text-[12px] mb-2">Dec. 5, 10:14am</div>
                        {/* Throughput Line Chart */}
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={sampleData}>
                                <XAxis
                                    dataKey="time"
                                    stroke="#999"
                                    ticks={[...new Set(sampleData.map(d => d.label))].map(dateStr => {
                                        const match = sampleData.find(d => d.label === dateStr)
                                        return match?.time || ''
                                    })}
                                    tickFormatter={(value, index) => {
                                        if (index === 0) return ''; // Skip first tick
                                        const date = new Date(value);
                                        return `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
                                    }}
                                />
                                {/* Customize Y-axis */}
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    stroke="#999"
                                    tick={{ fill: '#999' }}
                                    ticks={[0, 1000, 2000]}
                                    tickFormatter={(value) => `${value / 1000}Gbps`}
                                />
                                <CartesianGrid stroke="#2f3b45" horizontal={true} vertical={false} />
                                <Tooltip />
                                <Line type="linear" dataKey="readThroughput" stroke="#a855f7" strokeWidth={2} dot={createAnomalyDot('readThroughput', THROUGHPUT_ANOMALY_THRESHOLD)} />
                                <Line type="linear" dataKey="writeThroughput" stroke="#22d3ee" strokeWidth={2} dot={createAnomalyDot('writeThroughput', THROUGHPUT_ANOMALY_THRESHOLD)} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Display current Read and Write Throughput values */}
                    <div className="flex flex-col min-w-[180px] text-white text-sm md:mb-4 md:ml-0 ml-[40px] mt-4 md:mt-0">
                        <div className="text-gray-400 text-[18px] mb-0">Throughput</div>
                        <div className="bg-[#1c252e] p-4 border border-[#2C3A48] flex flex-col justify-center h-[165px]">
                            <div className="border-b border-[#2C3A48] pb-2 mb-2">
                                <div className="text-[#a6aaae]-500 text-[16px]">Read</div>
                                <div className="text-[#a855f7] text-lg font-semibold">{readThroughput}<span className="text-sm font-normal">IOPS</span></div>
                            </div>
                            <div>
                                <div className="text-[#a6aaae]-500 text-[16px]">Write</div>
                                <div className="text-[#22d3ee] text-lg font-semibold">{writeThroughput}<span className="text-sm font-normal">IOPS</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Legend Section */}
            <div className="flex items-center gap-3 mt-8 px-10 py-3 bg-[#222a33] rounded-md border border-[#2f3b45] w-fit shadow-sm justify-center mx-auto">
                <span
                    className="inline-block w-4 h-4 rounded-full bg-red-600 mr-2"
                    aria-label="Anomaly Dot"
                ></span>
                <span className="text-white text-[16px] font-medium">
                    Anomaly Point
                </span>
                <span className="text-gray-400 text-[14px] ml-2">
                    IOPS &gt; <span className="font-semibold text-yellow-400">100k</span>, Throughput &gt; <span className="font-semibold text-orange-400">1800 Mbps</span>
                </span>
            </div>
        </div>
    )
}