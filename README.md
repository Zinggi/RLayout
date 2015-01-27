# RLayout

A react component for simple layout. Screw CSS!

## Motivation

Creating nice layouts in CSS has always been a pain for me.
How many times have I desperately googled how to center a div? How to align divs horizontally? How to mix fixed sizes in pixels with dynamic sized divs?  
This project tries to make this much easier, while at the same time stay very flexible.

## Examples

[Demo 1](http://zinggi.github.io/RLayout/DemoExample.html) / [Src](examples/DemoExample.jsx)  
[More demos](http://zinggi.github.io/RLayout/) / [Src](examples)

## Install

```sh
npm install r-layout --save
```

## How it works

Check out the [examples](examples)!

Require the needed modules (only pick the ones you need):
```JS
var {Layout, resizeMixin, Spacer, Center, CenterHorizontal, CenterVertical} = require('r-layout');
```
The base component is the `<Layout/>` component.

Simple helper components are available, such as:
`<Spacer/>, <Center/>, <CenterHorizontal/> and <CenterVertical/>`

There is a `resizeMixin` available which automatically updates the layout on page resize.
Use it only on the root element.

## Concepts

The most important concept is the [`size`](#attributes) property. You can use it on all child components inside a `<Layout>` component.  
Based on this property, the parent will then figure out how big to render the child and pass this information along to the child.  
You can use the `size` property on all children, including `<div>`s, although I strongly disencourage using `<div>`s at all as `<Layout>` is the better `<div>`.

A child inside a Layout will always fill one dimension completely, leaving the other dimension open for configuration using the `size` property. Which dimension is controllable is determined by the parent Layout with the `orientation` property.
##### Complete Example:
```JS
"use strict";

var React = require('react/addons'),
    {Layout, resizeMixin} = require('r-layout');

var color = c => ({ backgroundColor: c});

var App = React.createClass({
    render() {
        return (
            /*{...this.props} makes sure that the <App> component behaves just like a Layout component.*/
            <Layout {...this.props} orientation="horizontal" style={{outline: "1px #000 solid"}}>
                <Layout size="weight 2" style={color("#D6E6FF")}>
                    I’m on the left, 2/7 of the remaining space wide.
                </Layout>
                <Layout size="weight 5" style={color("lightBlue")}>
                    I’m in the center, taking 5/7 of the remaining space. 
                </Layout>
                <Layout size="60px" style={color("#4EC8CF")}>
                    I’m on the right, 60px wide.
                </Layout>
            </Layout>
        );
    }
});

var Root = React.createClass({
    mixins: [resizeMixin],
    render() {
        return (
            /* The root instance needs a fixes height and width */
            <Layout calculatedWidth={window.innerWidth} calculatedHeight={window.innerHeight}>
                <Layout style={color("#FFEFD6")}>
                    Header, fills the remaining space.
                </Layout>
                {/* Notice that we can control the size of the <App> component just the same as any other Layout */}
                <App size="0.7 ofParent"/>
                <Layout size="50px" style={color("#FFEFD6")}>
                    Footer, fixed height of 50px.
                </Layout>
            </Layout>
        );
    }
});

React.render(<Root />, document.querySelector('body'));
```
**See it in action!** [Demo](http://zinggi.github.io/RLayout/DemoExample.html) / [Src](examples/DemoExample.jsx)

## API

### Layout

The most important component. Everything else is composed out of `<Layout/>` components.

##### Example:

```Html
<Layout size="0.1 ofParent">
    Top bar
</Layout>
<Layout orientation="horizontal">
    <Layout size="weight 1">
        Side bar
    </Layout>
    <Layout size="weight 5">
        Content
    </Layout>
</Layout>
<Layout size="50px">
    Footer
</Layout>
    
```

##### Attributes:

**size:** Determines the size of this Layout. Available values:  
 * `"42px"`: Size in pixel
 * `"0.42 ofParent"`: 42% of the parent size
 * `"weight 4.2"`: A Layout with a size in weight will fill the remaining space, divided based on the weight value. E.g. two Layouts with `"weight 1"` / `"weight 3"` will take `0.25` / `0.75` of the remaining space.  
 * `"matchChild"`: Tries to match it's size to that of it's child. **Note**: Only one child is supported. The child needs to be an element with a size property of `"__px"` *or* an element whose size can be immediately determined by rendering it. This can be used to make something exactly the size of it's containing text, or the size of an image.

=> *Default:* `"weight 1"`

**orientation:** Determines how the children are laid out.  
 * Either `"vertical"` or `"horizontal"`.

=> *Default:* `"vertical"`
 

**calculatedWidth:** Only the root Layout must specify this value.  
    For the top element use: `window.innerWidth`.  
    Everywhere else just pass along the parent values: `{...this.props}`.  
    If you need more control you can also directly pass along these values: `this.props.calculatedWidth`  

**calculatedHeight:** Same as above, replace Width with Height.

**absolute:** Indicate that this element doesn't takes any space up for others.
    The element will be positioned exactly like it's parent. Good when things need to be over something else.

**free:** Similar to `absolute`, this element won't claim any space. However, it will be positioned like the view port.
    (This is basically the same as `position: fixed;`)

**dontRender:** Indicate that this Layout shouldn't render anything. Used for spacers.


**break:** Opens the debugger when this Layout is rendered

**debug:** Displays weird random background colors


*These are used internally:* `calculatedLeft, calculatedTop, children`


### Spacer

Creates an empty space, same as:
```Html
<Layout dontRender />
```
##### example:
```Html
<Spacer size="weight 2"/>
```
##### attributes:
Same as Layout. (Except children)


### Center

Centers it's children.
##### example:
````Html
<Center contentHeight="weight 3" horizontalSpacer="50px">
    I'm 3/5 high and (parentSize - 2*50px) wide!
</Center>
```
##### attributes:

Same as Layout plus: 

**contentHeight:** The height of the content. `"Weight x"` will behave as if there were two Spacers around.

=> *Default:* `"weight 1"`

**contentWidth:** Same as above

**verticalSpacer:** The size of the spacers left and right.

=> *Default:* "weight 1"

**horizontalSpacer:** Same as above

**containerProps:** properties you want to pass down to the container object that will surround the children.
    A use might be styling the container with: `containerProps={{style: {color: "red"}}}`


### CenterVertical

Centers it's children vertically

##### example:
````Html
<CenterVertical contentSize="weight 8">
    I'm 8/10 high!
</CenterVertical>
```

##### attributes:

Same as Layout plus: 

**contentSize:** The size of the content. `"weight x"` will behave as if there were two Spacers around.

=> *Default:* `"weight 1"`

**spacerSize:** The size of the spacers around.

=> *Default:* `"weight 1"`

**containerProps:** properties you want to pass down to the container object that will surround the children.
    A use might be styling the container with: `containerProps={{style: {color: "red"}}}`


### CenterHorizontal

Centers it's children horizontally

##### example:
````Html
<CenterHorizontal spacerSize="0.2 ofParent">
    I'm 0.6 of my parent wide!
</CenterHorizontal>
```

##### attributes:

Same as Layout plus: 

**contentSize:** The size of the content. `"weight x"` will behave as if there were two Spacers around.

=> *Default:* `"weight 1"`

**spacerSize:** The size of the spacers around.

=> *Default:* `"weight 1"`

**containerProps:** properties you want to pass down to the container object that will surround the children.
    A use might be styling the container with: `containerProps={{style: {color: "red"}}}`

---
## Develop

First time, run:  
`npm install`  
After that, Just run:  
`grunt dev`

---
## Also try this
[r-animation](https://github.com/Zinggi/RAnimation) - An animation library.

---
## License

[MIT](LICENSE)
