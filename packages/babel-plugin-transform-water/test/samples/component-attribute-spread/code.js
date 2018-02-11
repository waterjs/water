const Component = ({ foo, bar, wolf }) => <div foo={foo} bar={bar} wolf={wolf} />;

export default props => <Component {...props} {...{ bar: 'wolf' }} />;
