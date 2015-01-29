# FRAK WebGL Engine

FRAK engine is a JavaScript library/API for creating interactive 3D applications using WebGL.
The purpose of the library is to provide a framework for simplifying the creation of complex interactive 3D applications.

FRAK engine was developed by 3D Technologies R&D for [3D Wayfinder](http://3dwayfinder.com/). 3D Wayfinder is a floor
plan visualization and content management platform, mainly used for wayfinding applications.

## Features
* Order-independent transparency
* Real-time shadows
* Dynamic textures
* Post-processing pipeline
 - includes FXAA and SSAO implementations
* Unicode fonts
* Collision detection*
 - Currently supports ray-intersection tests only
 - Collision trees need to be pre-generated by an external tool
* Input: supports both keyboard+mouse and touch configurations
* Automatic resource caching
* Automatic loading of related resources
* Supported assets:
 - Shaders: GLSL
 - Textures: JPEG, PNG
 - Models: Custom binary data format, JSON
 - Fonts: Canvas text API (unicode) or BMFont fonts (deprecated)

## Architecture
The scene graph is a tree made up of instances of **Node** (or EmptyNode, if no spacial position is required for the given node).
Nodes can contain any number of **Component** instances. The function of a Component class is not limited.
For example it can act as an input controller (**Controller**) or as a billboard (**Billboard**) or simply as each
node's relative transformation in the scene hierarchy (**Transform**).
More examples of component implementations can be seen under [src/scene/components/](src/scene/components/)
