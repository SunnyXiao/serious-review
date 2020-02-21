import React from './react'
import ReactDOM from './react-dom'

class App extends React.Component {
    constructor(){
        super();
        this.state={
            num:0
        };
        this.num=0;
    }
    addCount(){
        this.setState({num:++this.num});
    }
    render() {
        return (
            <div>
                数量:{this.state.num}&nbsp;&nbsp;<button type="button" onClick={this.addCount.bind(this)}>addCount</button>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById( 'root' )
);
