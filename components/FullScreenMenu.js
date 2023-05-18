import { useSpring, useTransition, animated, useTrail, useChain, useSpringRef } from '@react-spring/web';
import { useContext, useEffect, useState } from 'react';
import styles from '../styles/FullScreenMenu.module.scss';
import { GlobalContext } from '../context';
import { Close } from '@mui/icons-material';
import Link from 'next/link';

const menuItems = [
    {name: 'Link1', slug: '/'},
    {name: 'Link2', slug: '/'},
    {name: 'Link3', slug: '/'},
    {name: 'Link4', slug: '/'},
    {name: 'Link5', slug: '/'},
    {name: 'Link6', slug: '/'},
];

export default function FullScreenMenu() {

    const {isHamburgerActive, setIsHamburgerActive} = useContext(GlobalContext);

    const closeRef = useSpringRef();
    const closeSpring = useSpring({
        ref: closeRef,
        x: isHamburgerActive ? 0 : 110,
        opacity: isHamburgerActive ? 1 : 0,
        from: { opacity: 0, x: 110 },
    });

    const listRef = useSpringRef();
    const listSprings = useTrail(menuItems.length, {
        ref: listRef,
        config: { mass: 5, tension: 2000, friction: 200 },
        opacity: isHamburgerActive ? 1 : 0,
        x: isHamburgerActive ? 0 : 20,
        height: isHamburgerActive ? 110 : 0,
        from: { 
            opacity: 0,
            x: 20,
            height: 0,
        },
    });

    const enterRef = useSpringRef();
    const menuSpring = useSpring({
        from: { opacity: 0 },
        opacity: isHamburgerActive ? 1 : 0,
    });
    
    useChain(isHamburgerActive 
        ? [enterRef, listRef, closeRef] 
        : [closeRef, listRef, enterRef],
        isHamburgerActive ? [0., .15, .25] : [0., .1, .5]
    );

    return (
        <div>
            <animated.div 
                className={styles.FullScreenMenu + " " + (isHamburgerActive ? styles.visible : '')}
                style={{
                    ...menuSpring,
                    pointerEvents: isHamburgerActive ? 'all' : 'none'
                }}
            >
                { 
                    listSprings.map(({ height, ...style }, i) => (
                        <Link href={menuItems[i].slug}>
                            <a>
                                <animated.div 
                                    style={style}
                                    key={'listspring-'+i}
                                    className={styles.menu_item}
                                >
                                {/* <div key={'listspring-'+i}> */}
                                    <animated.div style={{ height }}>
                                        {menuItems[i].name}
                                    </animated.div>
                                </animated.div>
                            </a>
                        </Link>
                        // </div>
                    ))
                }

                <animated.div className={styles.close}
                    style={closeSpring}
                    onClick={() => { setIsHamburgerActive(false) }}
                >
                    <Close 
                          />

                </animated.div>
            </animated.div>        
        </div>
    );
}