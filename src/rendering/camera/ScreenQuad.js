/**
 * Creates a screen-aligned rectangle for rendering. If constructed without
 * parameters a full-screen quad is created.
 * Screen coordinates are in the range of [-1, 1].
 *
 * @param context RenderingContext instance
 * @param x Lower-left corner of the rectangle (defaults to -1.0) [optional]
 * @param y Lower-left corner of the rectangle (defaults to -1.0) [optional]
 * @param width Width of the rectangle (defaults to 2.0) [optional]
 * @param height Height of the rectangle (defaults to 2.0) [optional]
 */
function ScreenQuad(context, x, y, width, height) {
	x = x || -1.0;
	y = y || -1.0;
	width = width || 2.0;
	height = height || 2.0;

	var faces = [0, 1, 2, 0, 2, 3];
	if (context.engine && context.engine.options.useVAO === true) {
		try {
			this.quad = new TrianglesRenderBufferVAO(context, faces);
		}
		catch(e) {
			this.quad = new TrianglesRenderBuffer(context, faces);
		}
	}
	else {
		this.quad = new TrianglesRenderBuffer(context, faces);
	}

	this.vertices = new Float32Array(12);
	this.vertices[0] = x;
	this.vertices[1] = y;
	this.vertices[3] = x;
	this.vertices[4] = y + height;
	this.vertices[6] = x + width;
	this.vertices[7] = y + height;
	this.vertices[9] = x + width;
	this.vertices[10] = y;

	this.quad.add('position', this.vertices, 3);
	this.quad.add("uv0", [0,0, 0,1, 1,1, 1,0], 2);
}

ScreenQuad.prototype.update = function(x, y, width, height) {
	this.vertices[0] = x;
	this.vertices[1] = y;
	this.vertices[3] = x;
	this.vertices[4] = y + height;
	this.vertices[6] = x + width;
	this.vertices[7] = y + height;
	this.vertices[9] = x + width;
	this.vertices[10] = y;
	this.quad.update('position', this.vertices);
};

ScreenQuad.prototype.render = function(context, material, samplerOrList) {
	var gl = context.gl;
	var samplers;
	if (samplerOrList) {
		if (samplerOrList instanceof Sampler)
			samplers = [samplerOrList];
		else
			samplers = samplerOrList;
	}

	material.bind({}, samplers);
	this.quad.render(material.shader);
	material.unbind(samplers);
};
