// 使用默认模板
import React from 'react';
import ReactDom from 'react-dom';

// const React = require('react');
// const ReactDom  = require('react-dom')
const Container = () => {
    return (
        <div>
            Hi Light at App 默认模板
        </div>
    )
}

ReactDom.render(
    <Container />,
    document.getElementById('react-app')
)