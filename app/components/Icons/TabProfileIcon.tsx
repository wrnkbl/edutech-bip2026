// Created with https://react-svgr.com/playground/

import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"
const TabProfileIcon = ({ color = '#f2e6b6a7'}) => (
    <Svg
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 38 47"
        width={38}
        height={47}
        opacity={ color === '#f2e6b6b4' ? 0.7 : 1 }
    >
        <Circle cx={19.2307} cy={10.5769} r={10.5769} fill='#F2E6B6' />
        <Path
            d="M0 32.9615C0 29.0956 3.13401 25.9615 7 25.9615H30.5C34.366 25.9615 37.5 29.0956 37.5 32.9615V44.1539C37.5 45.2584 36.6046 46.1539 35.5 46.1539H2C0.895431 46.1539 0 45.2584 0 44.1539V32.9615Z"
            fill='#F2E6B6'
        />
    </Svg>
)
export default TabProfileIcon
