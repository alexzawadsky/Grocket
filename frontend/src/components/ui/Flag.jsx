import { parse } from 'twemoji-parser';

const Flag = ({ country, size }) => {
    const iconLink = parse(country)[0]?.url
    return <img src={iconLink} />
};

export default Flag;
