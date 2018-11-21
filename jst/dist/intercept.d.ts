declare var Intercept: ({ Component }: {
    Component: any;
}) => {
    new (): {
        [x: string]: any;
        state: {
            focus: boolean;
            selected: boolean;
            editMode: any;
            canEdit: boolean;
        };
        componentDidMount(): void;
        componentWillUnmount(): void;
        reconstruct(obj: any): any;
        render(): any;
        mouseEnter(): void;
        mouseLeave(): void;
        click(ev: any): void;
        onMessage(ev: any): void;
    };
    [x: string]: any;
};
export { Intercept };
