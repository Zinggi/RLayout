# RLayout

A react component for simple layout. Screw CSS!

## Motivation

Creating nice layouts in CSS has always been a pain for me.
How many times have I desperately googled how to center a div? How to align divs horizontally? How to mix fixed sizes in pixels with dynamic sized divs?  
This project tries to make this much easier, while at the same time stay very flexible.

## Examples

[Demo](http://zinggi.github.io/RLayout/) / [Src](examples)

## Install

```sh
npm install RLayout --save
```

## How it works

Check out the [examples](examples)!

Require the needed modules (only pick the ones you need):
```JS
var {Layout, resizeMixin, Spacer, Center, CenterHorizontal, CenterVertical} = require('RLayout');
```
The base component is the `<Layout/>` component.

Simple helper components are available, such as:
`<Spacer/>, <Center/>, <CenterHorizontal/> and <CenterVertical/>`

There is a `resizeMixin` available which automatically updates the layout on page resize.
Use it only on the root element.

### Layout

**Example:**

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

**Attributes:**
```JSON
size: Determines the size of this Layout. Available values:
    "42px" : Size in pixel
    "0.42 ofParent": 42% of the parent size
    "weight 4.2": A Layout with a size in weight will fill the remaining space,
                  divided based on the weight value. E.g. two Layouts with
                  "weight 1" / "weight 3" will take 0.25 / 0.75 of the remaining space.
    Default: "weight 1"

orientation: Determines how the children are laid out.
    Either "vertical" or "horizontal".
    Default: "vertical"
 

calculatedWidth: Only the root Layout must specify this value.
    For the top element use: window.innerWidth
    Everywhere else just pass along the parent value: this.props.calculatedWidth

calculatedHeight: Same as above, replace Width with Height


dontRender: Indicate that this Layout shouldn't render anything. Used for spacers.


break: Opens the debugger when this Layout is rendered

debug: Displays weird random background colors


These are used internally: calculatedLeft, calculatedTop, children
```

### Spacer

Creates an empty space, same as:
````Html
<Layout dontRender />
```

### Center

Centers it's children.

**attributes:**
````JSON
contentHeight: The height of the content. "Weight" will behave as if there were two Spacers around.
    Default: "weight 1"
contentWidth: Same as above
```

````Html
<Center>
    I'm 1/3 high and 1/3 wide!
</Center>
```

### CenterVertical

Centers it's children vertically

**attributes:**
````JSON
contentSize: The size of the content. "Weight" will behave as if there were two Spacers around.
    Default: "weight 1"
```

````Html
<CenterVertical>
    I'm 1/3 high!
</CenterVertical>
```

### CenterHorizontal

Centers it's children horizontally

**attributes:**
````JSON
contentSize: The size of the content. "Weight" will behave as if there were two Spacers around.
    Default: "weight 1"
```

````Html
<CenterHorizontal>
    I'm 1/3 wide!
</CenterHorizontal>
```


---
## License

[MIT](LICENSE)
