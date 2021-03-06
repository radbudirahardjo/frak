/** 4x4 matrix uniform */
var UniformMat4=Uniform.extend({
	bind: function(context, uniformLocation) {
		context.gl.uniformMatrix4fv(uniformLocation, false, this.value);
	},

	type: function() {
		return "UniformMat4";
	},

	clone: function() {
		var c = this._super();
		c.value = mat4.clone(this.value);
		return c;
	}
});