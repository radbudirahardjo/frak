/** Render-stage used for generating a buffer of normals for use in the SSAO post-process */
var PositionBufferRenderStage = RenderStage.extend({
	init: function(size) {
		this._super();

		this.size = 2048;
		if (size)
			this.size = size

		this.target = false;
	},

	onStart: function(context, engine) {
		this.target = new TargetTextureFloat([this.size, this.size], context, false);

		this.material = new Material(
			engine.assetsManager.addShaderSource("shaders/default/positionbuffer"),
			{
				"ViewportSize": new UniformVec2(vec2.clone(engine.scene.camera.target.size))
			},
			[]
		);

		var vertices = [0,0,0, 0,1,0, 1,1,0, 1,0,0];
		var uvs = [0,1, 0,0, 1,0, 1,1];
		var faces = [0, 1, 2, 0, 2, 3];
		this.quad=new TrianglesRenderBuffer(context, faces);
		this.quad.add('position', vertices, 3);
		this.quad.add('texcoord2d0', uvs, 2);

		engine.assetsManager.load(function(){});
	},

	onPreRender: function(context, scene, camera) {
		vec2.set(this.material.uniforms.ViewportSize.value, camera.target.size[0], camera.target.size[1]);
	},

	onPostRender: function(context, scene, camera) {
		if (!this.parent || !(this.parent instanceof MaterialRenderStage))
			return;

		if (!this.target || !this.material)
			return;

		this.target.bind(context);
		var gl = context.gl;

		gl.depthMask(true);
		gl.clearDepth(1.0);
		gl.clearColor(0.0, 0.0, 0.0, 0.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LESS);

		this.material.bind();

		for (var i=0; i<this.parent.solidRenderers.length; ++i) {
			if (!this.parent.solidRenderers[i])
				break;
			if (this.parent.solidRenderers[i].layer &&
				this.parent.solidRenderers[i].visible) {

				context.modelview.push();
				context.modelview.multiply(this.parent.solidRenderers[i].matrix);

				this.parent.solidRenderers[i].renderGeometry(context, this.material.shader);

				context.modelview.pop();
			}
		}

		this.material.unbind();

		gl.depthMask(true);
		gl.disable(gl.DEPTH_TEST);

		this.target.unbind(context);
	}
});
