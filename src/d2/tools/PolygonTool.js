import BaseTool from './BaseTool.js';
import { Vector, Utils } from 'cal';
import * as humanReadable from '../../utils/humanReadable.js';
import { dimensionsText } from '../texts.js';
// import createDebug from 'debug';
// const debug = createDebug('d3d:2d:tool:polygon');

export default class PolygonTool extends BaseTool {
  constructor(dispatch, sceneSpaceContainer, renderRequest) {
    super(dispatch, sceneSpaceContainer, renderRequest);

    this.drawRuler = false;

    this.rulerLength = 0;
    this.rulerAngle = 0;
    this.rulerPosition = new Vector();

    // this.anglePosition = new Vector();
    // this.angleDegrees = 0;
  }
  update(state) {
    const activeShape = state.d2.activeShape && state.objectsById[state.d2.activeShape];
    if (activeShape) {
      this.drawRuler = true;

      const pointA = activeShape.points[activeShape.points.length - 2];
      const pointB = activeShape.points[activeShape.points.length - 1];

      this.rulerPosition.copy(pointA.add(pointB).scale(0.5));
      this.rulerLength = pointA.distanceTo(pointB);
      this.rulerAngle = pointB
        .subtract(pointA)
        .scale(Utils.MathExtended.sign(pointB.subtract(pointA).x) || 1)
        .angle();

      // this.anglePosition.copy(pointA);
      // this.angleDegrees = (pointB.subtract(pointA).angle() + (Math.PI * 2.0)) % (Math.PI * 2.0);

      return true;
    } else if (this.drawRuler) {
      this.drawRuler = false;
      return true;
    }

    return false;
  }
  draw(context, matrix) {
    if (this.drawRuler) {
      context.save();

      const rulerPosition = this.rulerPosition.applyMatrix(matrix);
      context.translate(rulerPosition.x, rulerPosition.y);
      context.rotate(this.rulerAngle);

      const text = humanReadable.distance(this.rulerLength);
      dimensionsText.drawText(context, text, 0, -5);

      context.restore();

      context.beginPath();

      // const anglePosition = this.anglePosition.applyMatrix(matrix);
      // context.arc(anglePosition.x, anglePosition.y, 20, 0, this.angleDegrees, this.angleDegrees > Math.PI);
      //
      // context.strokeStyle = 'black';
      // context.lineWidth = 1;
      // context.stroke();
      //
      // const angleTextPos = new Vector(28, 0)
      //   .rotate((this.angleDegrees < Math.PI ? this.angleDegrees : this.angleDegrees - Math.PI * 2.0) / 2)
      //   .add(anglePosition);
      // context.textAlign = 'start';
      // context.textBaseline = 'middle';
      // context.fillStyle = '#000';
      // context.font = '10px Arial';
      //
      // const angleDegrees = this.angleDegrees < Math.PI ? this.angleDegrees : Math.PI * 2 - this.angleDegrees;
      // dimensionsText.drawText(context, humanReadable.degrees(angleDegrees), angleTextPos.x, angleTextPos.y);
    }
  }
}
