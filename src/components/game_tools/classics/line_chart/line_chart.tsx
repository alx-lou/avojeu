import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { buildScoreChartSeries, type GraphPoint, type GraphSeries } from "../../../../utils/classical_tools";
import type { CSSProperties } from "react";
import type { GameSession } from "../../../../types/session"
import styles from "./line_chart.module.css";

type LineChartProps = {
    gameSession: GameSession
};

const tooltipStyle: CSSProperties = {
    backgroundColor: "var(--color-layer-1)",
    border: "1px solid var(--color-border)",
    borderRadius: "0.75rem",
    color: "var(--color-text)",
    fontFamily: "var(--primary-font)",
};

export function LineChartCard({ gameSession }: LineChartProps) {
    const series: GraphSeries[] = buildScoreChartSeries(gameSession.players, gameSession.gameState);

    if (series.length === 0) {
        return (
            <div className={styles.chartCard}>
                <p className={styles.emptyState}>No score history yet.</p>
            </div>
        );
    }

    const combinedData = Array.from({ length: Math.max(...series.map((item) => item.data.length), 1) }, (_, index) => {
        const point: Record<string, number | string> = {
            round: `R${index + 1}`,
        };

        series.forEach((item) => {
            const entry = item.data[index] as GraphPoint | undefined;
            point[item.name] = entry?.value ?? 0;
        });

        return point;
    });

    return (
        <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
                <h3>Score history</h3>
                <p>Round by round view</p>
            </div>
            <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={combinedData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
                        <XAxis
                            dataKey="round"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "var(--color-text)", fontFamily: "var(--primary-font)", fontSize: 12 }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                            tick={{ fill: "var(--color-text)", fontFamily: "var(--primary-font)", fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={tooltipStyle}
                            labelStyle={{ color: "var(--color-text)", fontFamily: "var(--primary-font)" }}
                        />
                        {series.map((item) => (
                            <Line
                                key={item.name}
                                type="monotone"
                                dataKey={item.name}
                                name={item.name}
                                stroke={item.color ?? "var(--color-primary)"}
                                strokeWidth={2.5}
                                dot={{ r: 3, strokeWidth: 0 }}
                                activeDot={{ r: 4 }}
                                isAnimationActive={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}