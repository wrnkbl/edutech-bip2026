// Created with https://react-svgr.com/playground/

import * as React from "react"
import Svg, {
    Defs,
    Image,
    Pattern,
    Rect,
    Use,
} from "react-native-svg"
const TabShopIcon = ({ color = '#f2e6b6b4', size = 55 }) => (
    <Svg
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 55 55"
        width={size}
        height={size}
        opacity={ color === '#f2e6b6b4' ? 0.7 : 1 }
    >
        <Rect width={55} height={55} fill="url(#pattern0_54_99)" />
        <Defs>
            <Pattern
                id="pattern0_54_99"
                patternContentUnits="objectBoundingBox"
                width={1}
                height={1}
            >
                <Use xlinkHref="#image0_54_99" transform="scale(0.01)" />
            </Pattern>
            <Image
                id="image0_54_99"
                width={100}
                height={100}
                preserveAspectRatio="none"
                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAH5UlEQVR4nO1de4ydRRUfQQFFXr5AwkME8VURCBLCIwFECRUCEiCoEf+oJkZjJPIooWDFQHiGd4Q/VMIrqZVXu/ecb1vAQgjEYquxVqvV0nb3nvPtsu3unXN3aWlprzl3b0nYsvf7vnu/+818336/5JdsdvfOnXPOzJwzM2dmjClRokSJEiUKDlt9/uNCwRlC8EMhuMMS/kEI0RK+LIwrlM2f9XeMC/R/hHCOEJ6un3Vd/9xjdPT5A4SDi4XxAUvwT2FsdENLsFoY7hfCb2/ahPu7li8XaDQW7lmvBucI4WNCMN6tEaY1DsMWIeyrh8GljcaKD7mW2zuMjDy3nw2DaywB98oIbXoOW8arh4eXfdTMdKgShHG+MGzO2hCyG2GTMP5yxhrGVvECYdzo3hA4dTgjy3CFmSl4q9p/uDD0u1a8RJEQJwbxMFNkqMO2hEPOlc1xewuO2DD4lili9CQEd1qCnV0riWCnEG4QxqXC+PtmWMxwm1J/FoJHmn8j3JDW92nZKoMpAhrrl+1jGZ7pXCG4QxhftQQ31cPgTKLFH4n73fq/9bByliX8tTC81o2BLOFTjbW4t8n75M4SLOtsDIf/CeO8UVp8RGr14cqRwpUbWmV3YpQ/5XZS2QxpCZZ3IPSqehUv7+UQoWXXCL5rCf/RQUNZnrvQWGe/HURSo5bg543G/D2yq2fjAxriWoI3EzaaF3MzfE0KiQsStrrHXS4ACi3+hDA+mbABPamyGt8hhHNjtzSGLdorjCewDFckWUOzDL8wPsNWK6dagu3xuj3w+GD/V41nGKviCZYwjCnDNjuEpxgfUdtYOcgyDMRsXWvHwiVHGU9RG6p8Vhj+G2+4xQ1j65890PgGS/BwTH/xxsTGpYcazzGxcemhQrA+ppN/0PiEGsNJrQlcxJiLI7YafN7kBLWB/mPiLPWo7LWw/2TjAzRMbW2hRo2324XgNJMzCAVnxPKLBMu9iLqE8ZKYQ9W1JqcQgutjyniR04q2JlZ/jREevuBF6+liFIi1BET4F+MSlnF2DL/xtlD/F0zOYatwrGXYGiVvjfCbziophEEM33GzKQjs5BJ/1LAFTipXH1p0cKSzI7BexujdpCYR1KKCl/HhyiEma1iGq7rpHZObVjhHGJbsSnSTBNSkOM0WaQws/HDGct8aIwy+0mQNYVgZYYxt9XDJp6Z3kvhUrMiFI4eI17NcDm+NDNui6mSyXh2N2n2zjM9N/3ntGSkYg99VwJ3Zyo99ET1kR22g/2OezT2Ci6f/fHOYSs0glmEgM+G1l4TBpd3InzoswW8iFLS13d531HAnyQ2yJTPhjTFhuGTfZjjvy/pWDP/xUsTnn0h1yGJYaTKGZXjFi0mizriFoB6hpPntyqgxfi3uvonEoO6Pm4yhWTDtDQI2k4poNl8aazo1wu91m+Fum0aFG40DtI5KtK1fJtsM9Sp+PVpZlS/GKmto0cEacWmmSTJDoC6J/0Q3kpJnmwTnaqZ9PYSf6vJ6x3oIgy9H1VNzwjotP35Fqnh5hLLeaaxeuFeSMi3BwoQ9Y3VHu4AEr0+p6w5NojMdQLNOovaA6mHlMtNrCMGPIoarWtIye20Qy3CephlNX2ecazqA+on2usA5ptfQTIu2ymIY9MUgjWYAgnOjWnKzpzDOTq4LrDpfQlEnGmGQNT4YZGz9swdGzaincLQ2jEcnqjfDmvZlZhBwWIJfpTqcDOEpkwcyExiEcUQTr6crsz4EX4mdNfLeFr1KJ30JdNG23qorkxeD6KZV60hBIqXJe1vga1MjmRoF3+kmnNbeGnd3szAGsVz5vjBOdGcM3PV9Oy3j7RrZCcM9aZQZ18kXwiA1wp+lcZBGdh9uUjuZpaG7zlcKbxChyoVx8rfEC8LmKCefa4MI4yfVGbtXNKbm5PNukAdcK1hSdvK5NUhzTpCSExcXnMbJOzNIo7Hsg0J4ncb26vCcK4jzwZau1mrWZmpH9JrZiQR/dC2c5Jx6nVQqBrEhnO9aGCkIO1kv290ghA+5FkQKQs1F6NogQvioa0GkKCR8tGuD6MzauSBcDOouZVoXALzhWhjJOwnXJVlJbt9LhvHoTm5lKIm7jPHnpPv/saDHmDXbQjP3SgaRbOpqEI9L3RAlSpQoUaJEiRIlSswwCOOXXMf39ZxQdeXVBWUznpTBdSK6QOZcUM4L4cfOjyOUxGyPI4xRcKJrQSUnHK9Wju+5QXQ5vheZh0WjJdyR2nJ7FCzD310LLJ7TMv7NZAVhvNe1wOI7Ce/KzCA1gm84F5j9Zj2EszMzSPPyGIZB10KLp9Sjbpk/b2EZb3EtuHhKJ5e2Na8pYnzLtfDiHyemu5aq5xCG+zxQQMMrEtxtnF4vTjDsXAnsB1UXqhPjEpbxB64VIZ5Qz04aH5D+dUs4c7Pb04C+yyQM/57BxviXPh9rfIJe25TguYrC0DKQPjZmfEQ97Jvl4oFhcdYzgPWaJuMzxsLgM8L4H9fKkl6TcF039225eL+wwMfgYFGm18CmdTaxebaEUIrTK8DqFnaeX3qYfDqI4Yn83OCA73+alvCx8TeDT5uiQJ97EIbf5eq8OsG4ZfitHez7nCkqNF7X2f3kg8Ww2bnSeSphsyV4Wt80zN0Tq2nsq+hlY62ksnnCcL8+ya3XWWTByee/m985bzK5rW9Wlk+/lihRokSJEiVKlChRooTxAP8HiHFYAL19dBcAAAAASUVORK5CYII="
            />
        </Defs>
    </Svg>
)
export default TabShopIcon
