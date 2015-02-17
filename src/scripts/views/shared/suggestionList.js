var React = require('react/addons');
var _ = require('underscore');

require('react-select/dist/default.css');
var ReactSelect = require('react-select');

var SuggestionList = React.createClass({
    getInitialState() {
        return {
            selectedValue: '',
            filterText: ''
        }
    },

    componentDidMount() {
        var event = new MouseEvent('mousedown', {
            view: window,
            bubbles: true,
            cancelable: true,
            button: 0
        });
        var node = this.refs.selectBox.refs.control.getDOMNode();
        node.dispatchEvent(event);
    },

    _handleInput(userInput) {
        this.setState({filterText: userInput});
    },

    _handleSelect(value) {
        this.setState({selectedValue: value});
        this.props.onSelect(value);
    },

    render() {
        var filteredOptions = this.state.filterText ?
            _.filter(this.props.options, value => value.indexOf(this.state.filterText) > -1) :
            this.props.options;
        var options = _.map(filteredOptions, op => {
            return {value: op, label: op};
        });

        return (
            <div className={this.props.containerClassName || ""}>
                <ReactSelect
                    ref="selectBox"
                    name="suggestion-box"
                    value=""
                    options={options}
                    onChange={this._handleSelect} />
            </div>
        )
    }
});

module.exports = SuggestionList;
