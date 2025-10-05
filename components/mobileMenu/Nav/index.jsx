// index.jsx

import styles from './style.module.scss';
import { motion } from 'framer-motion';
import { footerLinks } from './data'; // Assuming footerLinks is correctly imported from data
import { slideIn } from "./anim";
import Link from 'next/link';
import { HoverImageLinks } from './HoverImageLinks'; // Correct import based on named export

export default function Index() { // Corrected to use Index instead of index for component naming
    return (
        <div>
            <HoverImageLinks/>
            <div className={styles.nav}>
                <div className={styles.body}>
                    {/* Your content here */}
                </div>
                <motion.div className={styles.footer}>
                    {
                        footerLinks.map((link, i) => {
                            const { title, href } = link;
                            return (
                                <motion.a
                                    variants={slideIn}
                                    custom={i}
                                    initial="initial"
                                    animate="enter"
                                    exit="exit"
                                    key={`f_${i}`}
                                >
                                    {title}
                                </motion.a>
                            )
                        })
                    }
                </motion.div>
            </div>
        </div>
    );
}
