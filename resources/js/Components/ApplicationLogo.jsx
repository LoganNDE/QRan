export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2.5"/>
            <rect x="5" y="5" width="8" height="8" rx="1" fill="currentColor"/>
            <rect x="24" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2.5"/>
            <rect x="27" y="5" width="8" height="8" rx="1" fill="currentColor"/>
            <rect x="2" y="24" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2.5"/>
            <rect x="5" y="27" width="8" height="8" rx="1" fill="currentColor"/>
            <rect x="24" y="24" width="6" height="6" rx="1" fill="currentColor"/>
            <rect x="34" y="24" width="6" height="6" rx="1" fill="currentColor"/>
            <rect x="24" y="34" width="6" height="6" rx="1" fill="currentColor"/>
            <path d="M34 31 Q38 31 38 27" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
    );
}