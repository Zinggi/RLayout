# RLayout

A react component for simple layout. Screw CSS!

### Motivation

Creating nice layouts in CSS has always been a pain for me.
How many times did you desperately google how to center a div? How to align divs horizontally? How to mix fixed sizes in pixels with dynamic sized divs?

### How it works

```jsx
var React = require('react/addons'),
    {Layout, resizeMixin, Center, CenterHorizontal, CenterVertical, Spacer} = require('RLayout'),
    mountPoint = document.querySelector('body');

var App = React.createClass({
    mixins: [resizeMixin],
    render() {
        var textCenter = {
            textAlign: "center"
        };
        return (
        	{/* The root instance needs a fixes height and width */}
            <Layout calculatedWidth={window.innerWidth} calculatedHeight={window.innerHeight}>
                <CenterVertical contentSize="weight 2">
                    This is vertically centered!
                </CenterVertical>
                <CenterHorizontal contentSize="weight 1">
                    <img src="https://www.google.com/images/srpr/logo11w.png"/>
                </CenterHorizontal>
                <Center contentWidth="0.25 ofParent" contentHeight="0.25 ofParent">
                    This is totally centered! check this out!
                </Center>
            </Layout>
        );
    }
});


React.render(<App />, mountPoint);
    
```

---
### Install

```sh
npm install RLayout
```

---


---
## License

[MIT](LICENSE)
