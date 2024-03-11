
import react, {Component} from 'react'

export default class Input extends Component {
    constructor(props) {
        super(props);
    }

    handleChange = (e) => {
        this.setState({value: e.target.value});
    }

    render() {
        return (
            <input type={this.props.type} placeholder={this.props.placeholder} value={this.props.value} onChange={this.props.onChange} />
        );
    }
}
// Path: frontend/system-design-web/src/components/input/input.jsx