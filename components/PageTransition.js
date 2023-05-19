//  https://letsbuildui.dev/articles/animated-page-transitions-in-nextjs

import styles from '../styles/PageTransition.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

export default function PageTransition({
    children
}) {
    
    const { asPath } = useRouter();

    const d = 0.5;

    const variants = {
        in: {
            opacity: 1,
            y: 0,
            transition: {
                duration: d, 
                delay: d * .75, // Duration of middle section.
            }
        },
        out: {
            opacity: 0,
            y: 40,
            transition: {
                duration: d,
            }
        },
    }

    return (
        <div className={styles.PageTransition}>
            <AnimatePresence
                initial={false}
                mode="wait"
                >
                    <motion.div
                        key={asPath}
                        variants={variants}
                        animate="in"
                        initial="out"
                        exit="out"
                    >
                        {children}
                    </motion.div>
            </AnimatePresence>
        </div>
    )
}
