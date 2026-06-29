import type { ReactNode } from 'react';

interface PanelWrapperProps {
    children: ReactNode;
    minHeight?: number;
}

const PanelWrapper = ({ children, minHeight = 240 }: PanelWrapperProps) => (
    <div className="surface" style={{ padding: 24, minHeight, display: 'grid', placeItems: 'center' }}>
        {children}
    </div>
);

export const LoadingPanel = ({ message }: { message: string }) => (
    <PanelWrapper>
        <div className="empty-state">
            <div className="loader" />
            <p>{message}</p>
        </div>
    </PanelWrapper>
);

export const ErrorPanel = ({ message }: { message: string }) => (
    <PanelWrapper>
        <p style={{ color: 'var(--danger-color)' }}>{message}</p>
    </PanelWrapper>
);

export const EmptyPanel = ({
    message,
    detail,
    icon,
    action,
    minHeight,
}: {
    message: string;
    detail?: string;
    icon?: string;
    action?: ReactNode;
    minHeight?: number;
}) => (
    <PanelWrapper minHeight={minHeight}>
        <div className="empty-state">
            {icon && <span className="empty-state-icon">{icon}</span>}
            <p>{message}</p>
            {detail && <p className="caption">{detail}</p>}
            {action}
        </div>
    </PanelWrapper>
);
