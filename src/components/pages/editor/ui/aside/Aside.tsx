import React from 'react'
import styles from './Aside.module.scss'

type TAside = {
    children: React.ReactNode
}

const Aside: React.FC<TAside> = ({ children }) => {
    return (
        <aside className={styles.asidePanel}>
            {children}
        </aside>
    )
}

export default Aside
