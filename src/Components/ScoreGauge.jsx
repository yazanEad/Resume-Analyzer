import { useEffect, useRef, useState } from "react";

const ScoreGauge = ({ score = 75 }) => {
    const [pathLength, setPathLength] = useState(0);
    const pathRef = useRef(null);

    const percentage = score / 100;

    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, []);

    return (
        <div className="d-flex flex-column align-items-center">
            <div className="resume-gauge position-relative">
                <svg viewBox="0 0 100 50" className="w-100 h-100">
                    <defs>
                        <linearGradient
                            id="gaugeGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                        >
                            <stop offset="0%" stopColor="#a78bfa" />
                            <stop offset="100%" stopColor="#fca5a5" />
                        </linearGradient>
                    </defs>

                    {/* Background arc */}
                    <path
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                        strokeLinecap="round"
                    />

                    {/* Foreground arc with rounded ends */}
                    <path
                        ref={pathRef}
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={pathLength}
                        strokeDashoffset={pathLength * (1 - percentage)}
                    />
                </svg>

                <div className="resume-gauge-score position-absolute top-50 start-50 translate-middle text-center">
                    <span className="h5 fw-semibold mb-0">{score}/100</span>
                </div>
            </div>
        </div>
    );
};

export default ScoreGauge;
