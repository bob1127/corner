import * as React from "react";

const useEnhancedEffect =
    typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

type Props = {
    defer?: boolean;
    fallback?: JSX.Element;
    children: React.ReactNode;
};
/**
 * NoSSR purposely removes components from the subject of Server Side Rendering (SSR).
 *
 * This component can be useful in a variety of situations:
 * - Escape hatch for broken dependencies not supporting SSR.
 * - Improve the time-to-first paint on the client by only rendering above the fold.
 * - Reduce the rendering time on the server.
 * - Under too heavy server load, you can turn on service degradation.
 */
function NoSSR(props: Props) {
    const { children, defer = false, fallback = null } = props;
    const [mountedState, setMountedState] = React.useState(false);

    useEnhancedEffect(() => {
        if (!defer) {
            setMountedState(true);
        }
    }, [defer]);

    React.useEffect(() => {
        if (defer) {
            setMountedState(true);
        }
    }, [defer]);

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{mountedState ? children : fallback}</>;
}

export default NoSSR;