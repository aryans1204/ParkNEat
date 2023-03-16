import React from "react";
import { useState, useEffect } from "react";
import { PieChart, Pie, Legend, Sector, Cell, ResponsiveContainer } from 'recharts';

export function ExpendituresPieChartComponent(props) {

    const [result, setResult] = useState(null);
    useEffect(() => {
    setResult(props.data);
    }, [props.data]);

    var pieData = [
        {name: "Food", value: 0},
        {name: "Housing", value: 0},
        {name: "Utilities", value: 0},
        {name: "Bills", value: 0},
        {name: "Clothes", value: 0},
        {name: "Lifestyle", value: 0},
        {name: "Transport", value: 0},
        {name: "Healthcare", value: 0},
        {name: "Pets", value: 0},
        {name: "Others", value: 0},
    ];

    console.log(result);

    if (result !== null) {
        result.forEach(({category, amount}) => {
            var index = pieData.findIndex(x => x.name.toLowerCase() === category.toLowerCase());
            pieData[index].value += amount;
        });
    };

    console.log(pieData);

    const COLORS = ['#37b067', '#6296bc', '#edb40d', '#7fd7c1', '#9f8cae', 
                    '#eb6672', '#376c72', '#ee9dcc', '#e3791a', '#9f765e'];
 
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
 
        if (percent > 0) {
        return (
                <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                    {`${(percent * 100).toFixed(0)}%`}
                </text>
        );
        };
    };
 
    return (
        <div>
            <div className="row d-flex justify-content-center text-center">
                <div className="col-md-8">
                    <ResponsiveContainer width="40%" height={400} className="text-center">
                        <PieChart width={400} height={400}>
                            <Legend layout="vertical" verticalAlign="top" align="top" />
                            <Pie
                                data={pieData}
                                cx="52%"
                                cy="7%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}