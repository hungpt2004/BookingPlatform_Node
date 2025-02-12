import { motion, useTime, useTransform } from "framer-motion"

export default function UseTime() {
    const time = useTime()
    const rotate = useTransform(
        time,
        [0, 4000], // time in milliseconds
        [0, 360], // rotation in degrees
        { clamp: false }
    )

    const tinyBox = {
        width: 40,
        height: 40,
        backgroundColor: "#9911ff",
        borderRadius: 5,
        rotate: useTransform(() => rotate.get() * 2), // 2x speed
    }

    const smallBox = {
        width: 80,
        height: 80,
        backgroundColor: "#dd00ee",
        borderRadius: 5,
        rotate: useTransform(() => rotate.get() * 1.5), // 1.5x speed
    }

    const box = {
        width: 100,
        height: 100,
        backgroundColor: "#ff0088",
        borderRadius: 5,
        rotate,
    }

    return (
        <>
            <div style={{ ...layer, filter: "blur(4px)" }}>
                <div style={{ ...boxContainer, width: 400, gap: 80 }}>
                    <motion.div style={tinyBox} />
                    <motion.div style={tinyBox} />
                    <motion.div style={tinyBox} />
                    <motion.div style={tinyBox} />
                    <motion.div style={tinyBox} />
                    <motion.div style={tinyBox} />
                    <motion.div style={tinyBox} />
                    <motion.div style={tinyBox} />
                    <motion.div style={tinyBox} />
                    <motion.div style={tinyBox} />
                    <motion.div style={tinyBox} />
                    <motion.div style={tinyBox} />
                    <motion.div style={tinyBox} />
                    <motion.div style={tinyBox} />
                    <motion.div style={tinyBox} />
                    <motion.div style={tinyBox} />
                </div>
            </div>
            <div style={{ ...layer, filter: "blur(2px)" }}>
                <div style={{ ...boxContainer, width: 300 }}>
                    <motion.div style={smallBox} />
                    <motion.div style={smallBox} />
                    <motion.div style={smallBox} />
                    <motion.div style={smallBox} />
                </div>
            </div>
            <div style={layer}>
                <div style={boxContainer}>
                    <motion.div style={box} />
                </div>
            </div>
        </>
    )
}

/**
 * ==============   Styles   ================
 */
const layer = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
}

const boxContainer = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 50,
    flexWrap: "wrap",
}