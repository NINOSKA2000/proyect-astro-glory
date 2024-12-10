import React, { Children } from 'react';
import "./button.css";

export default function Button({ icon, className = '', children, loading, onClick, outline = false, disabled = false, ...props }) {
    return (
        <div className={`buttonMaia ${outline ? 'outline' : ''}`}
             onClick={() => {
                if (!disabled) { onClick() }
            }}
             {...props}
        >
            { icon && <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.75 15.433C6 16.2499 3 12.8137 3 9.49998C3 7.60557 3.87796 5.91621 5.24919 4.81661M9.75 15.433L8.25 17M9.75 15.433L8.25 14M8.25 3.49653C12 2.74994 15 6.18628 15 9.49998C15 11.3941 14.1223 13.0832 12.7515 14.1828M8.25 3.49653L9.75 1.99994M8.25 3.49653L9.75 4.99994" stroke="#552F9B" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" />
                </svg>
            }
            <div >{children}</div>
            { loading && (
                <div className="MaiaSearchBar__LoadingIndicator loading">
                    <svg className="MaiaSearchBar__LoadingIcon" viewBox="0 0 100 100" width="28" height="28">
                        <circle cx="50" cy="50" fill="none" r="35" stroke="currentColor" strokeDasharray="164.93361431346415 56.97787143782138" strokeWidth="6">
                            <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;90 50 50;180 50 50;360 50 50" keyTimes="0;0.40;0.65;1"></animateTransform>
                        </circle>
                    </svg>
                </div>
            )}
        </div>
    );
}
