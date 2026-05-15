// Created with https://react-svgr.com/playground/

import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"
const PointsIcon = ({ color = "#f2e6b6a7", size = 55 }) => (
    <Svg
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 6 10"
        width={size}
        height={size}
    >
        <Circle cx={3.143} cy={3.143} r={3.143} fill={color} />
        <Path
            fill={color}
            d="M5.509 9.67 4.714 5.5H1.571L.777 9.67a.5.5 0 0 0 .804.485l1.562-1.25 1.562 1.25a.5.5 0 0 0 .804-.484Z"
        />
    </Svg>
)
export default PointsIcon