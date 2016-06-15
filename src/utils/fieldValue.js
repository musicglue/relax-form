import { joinSelectors } from 'react-relax';

export default (formState, name) => formState.getIn(joinSelectors('fields', name, 'value'));
