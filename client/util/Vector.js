export default class Vector {
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}
	add(vec) {
		this.x += vec.x;
		this.y += vec.y;
		return this;
	}
	addScalars(x, y) {
		this.x += x;
		this.y += y;
		return this;
	}
	subtract(vec) {
		this.x -= vec.x;
		this.y -= vec.y;
		return this;
	}
	subtractScalars(x, y) {
		this.x -= x;
		this.y -= y;
		return this;
	}
	multiply(vec) {
		this.x *= vec.x;
		this.y *= vec.y;
		return this;
	}
	multiplyScalar(scalar) {
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}
	divide(vec) {
		this.x /= vec.x;
		this.y /= vec.y;
		return this;
	}
	divideScalar(scalar) {
		this.x /= scalar;
		this.y /= scalar;
		return this;
	}
	dot(vec) {
		return this.x * vec.x + this.y * vec.y;
	}
	cross(vec) {
		return this.x * vec.y - this.y * vec.x;
	}
	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	lengthSq() {
		return this.x * this.x + this.y * this.y;
	}
	setLength(newLength) {
		let oldLength = this.length();
		if (oldLength === 0) {
			this.x = newLength;
			this.y = 0;
		}
		else {
			this.multiplyScalar(newLength / oldLength);
		}
		return this;
	}
	getProjectionOn(vec) {
		let length = vec.length();
		if (length === 0)
			return this.clone();
		else
			return vec.clone().multiplyScalar(this.dot(vec) / (length * length));
	}
	distance(vec) {
		let dx = this.x - vec.x, dy = this.y - vec.y;
		return Math.sqrt(dx * dx + dy * dy);
	}
	distanceSq(vec) {
		let dx = this.x - vec.x, dy = this.y - vec.y;
		return dx * dx + dy * dy;
	}
	// returns 0 .. pi
	angleTo(vec) {
		let lengthPart = this.length() * vec.length();
		if (lengthPart > 0) {
			return Math.acos(this.dot(vec) / lengthPart);
		}
		else {
			return 0;
		}
	}
	// returns 0 .. pi / 2
	closestAngleTo(vec) {
		let angle = Math.abs(this.angleTo(vec));
		if (angle > Math.PI * 0.5) {
			return Math.abs(Math.PI - angle);
		}
		else {
			return angle;
		}
	}
	normalize() {
		return this.setLength(1);
	}
	horizontalAngle() {
		return Math.atan2(this.y, this.x);
	}
	verticalAngle() {
		return Math.atan2(this.x, this.y);
	}
	rotate(angle) {
		let x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
		this.y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
		this.x = x;
		return this;
	}
	rotateTo(angle) {
		return this.rotate(angle - this.verticalAngle());
	}
	isEqualTo(vec) {
		return this.x === vec.x && this.y === vec.y;
	}
	isZero() {
		return !this.x && !this.y;
	}
	clone() {
		return new Vector(this.x, this.y);
	}
	set(vec) {
		this.x = vec.x;
		this.y = vec.y;
		return this;
	}
	setScalars(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}
	toString() {
		return `[${this.x}, ${this.y}]`;
	}
	toArray() {
		return [this.x, this.y];
	}
	interpolateLinear(other, t) {
		return new Vector(this.x + (other.x - this.x) * t, this.y + (other.y - this.y) * t);
	}
	interpolateCubic(other, control1, control2, t) {
		let t2 = 1 - t;
		return new Vector(t2 ** 3 * this.x +
			3 * t2 * t2 * t * control1.x +
			3 * t2 * t * t * control2.x +
			t ** 3 * other.x, t2 ** 3 * this.y +
			3 * t2 * t2 * t * control1.y +
			3 * t2 * t * t * control2.y +
			t ** 3 * other.y);
	}
	static fromObject(obj) {
		return new Vector(obj.x, obj.y);
	}
	;
	static fromArray(obj) {
		return new Vector(obj[0], obj[1]);
	}
	;
}
