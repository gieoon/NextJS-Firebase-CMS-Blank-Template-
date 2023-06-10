//  https://letsbuildui.dev/articles/animated-page-transitions-in-nextjs

import styles from '../styles/PageTransition.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
// https://github.com/vercel/next.js/issues/17464#issuecomment-1537262075
import PageTransition, { useAsPathWithoutHash } from '@madeinhaus/nextjs-page-transition';

export default function PageTransitionParent ({
    children
}) {
    
//     const { asPath } = useRouter();
    const key = useAsPathWithoutHash();

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
                initial={!false}
                mode="wait"
                onExitComplete={() => window.scrollTo(0, 0)}
            >
                    <PageTransition>
                        <motion.div
                            id="transitions-wrapper"
                            key={key}//asPath}
                            variants={variants}
                            animate="in"
                            initial="out"
                            exit="out"
                        >
                            {children}
                        </motion.div>
                    </PageTransition>
            </AnimatePresence>
        </div>
    )
}
