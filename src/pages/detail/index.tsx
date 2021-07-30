import React from 'react';
import ReactDom from 'react-dom';
// const React = require('react');
// const ReactDom  = require('react-dom')

import Util from './util';

interface Props {
    data: any;
}

class Container extends React.Component<Props,any> {
    componentDidMount() {
        new Util()
    }

    private getRule() {
        console.log('call private function')
    }

    public dispatch() {
        console.log('call public function')
    }

    render() {
        return (
            <div className="container">
                <span className="title">Hi Light at App</span>
                <button onClick={this.getRule}></button>
            </div>
        )
    }
}



ReactDom.render(
    <Container data={{}} />,
    document.getElementById('react-app')
)