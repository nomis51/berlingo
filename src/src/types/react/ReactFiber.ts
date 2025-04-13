export interface ReactFiber {
    memoizedProps: any;
    pendingProps: any;
    child: ReactFiber | null;
    sibling: ReactFiber | null;
    return: any;
}