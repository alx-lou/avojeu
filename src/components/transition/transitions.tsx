import { motion } from "framer-motion";
import type { ReactNode } from "react";

type transitionProps = {
    children: ReactNode;
}

export function RightSwipeTransition(
    { children }: transitionProps
){
    return (

        <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
                duration: 0.25,
                ease: "easeOut",
            }}
            style={{
                height: "100%",
                width: "100%",
            }}
        >
            {children}
        </motion.div>
    )
}

export function LeftSwipeTransition(
    { children }: transitionProps
){
    return (

        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
                duration: 0.25,
                ease: "easeOut",
            }}
            style={{
                height: "100%",
                width: "100%",
            }}
        >
            {children}
        </motion.div>
    )
}

export function FadeInTransition(
    { children }: transitionProps
){
    return (

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                duration: 0.25,
                ease: "easeOut",
            }}
            style={{
                height: "100%",
                width: "100%",
            }}
        >
            {children}
        </motion.div>
    )
}
