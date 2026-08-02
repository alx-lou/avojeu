import styles from './version_footer.module.css';

const APP_VERSION = import.meta.env.VITE_AVOJEUX_VERSION || "development";

export function VersionFooter(){
    return (
        <footer className={styles.footer}>
            <span className={styles.version}>{APP_VERSION}</span>
        </footer>
    );
}