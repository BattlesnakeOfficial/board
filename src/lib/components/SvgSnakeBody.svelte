<script lang="ts">
  import type { Point, Snake } from "$lib/playback/types";
  import {
    type SvgCalcParams,
    type SvgPoint,
    type SvgCircleProps,
    svgCalcCellCenter
  } from "$lib/svg";
  import { calcSourceWrapPosition, isAdjacentPoint, isEqualPoint } from "$lib/geometry";
  type SvgPointWithCircleProps = SvgPoint & SvgCircleProps;

  // Used to very slightly extend body segments to ensure overlap with head and tail
  const OVERLAP = 0.1;

  export let snake: Snake;
  export let svgCalcParams: SvgCalcParams;

  // Calculate the center points of a line that paths along snake.body
  $: bodyPolylinesPoints = calcBodyPolylinesPoints(snake);
  function calcBodyPolylinesPoints(snake: Snake): SvgPoint[][] {
    // Make a copy of snake body and separate into head, tail, and body.
    const body: Point[] = [...snake.body];
    const head = body.shift() as Point;
    const tail = body.pop() as Point;

    // Ignore body parts that are stacked on the tail
    // This ensures that the tail is always shown even when the snake has grown
    for (let last = body.at(-1); isEqualPoint(last, tail); last = body.at(-1)) {
      body.pop();
    }

    if (body.length == 0) {
      // If we're drawing no body, but head and tail are different,
      // they still need to be connected.
      if (!isEqualPoint(head, tail)) {
        const svgCenter = svgCalcCellCenter(svgCalcParams, head);
        return [calcHeadToTailJoint(head, tail, svgCenter)];
      }

      return [[]];
    }

    return convertBodyToPolilines(body, head, tail);
  }

  function convertBodyToPolilines(body: Point[], head: Point, tail: Point): SvgPoint[][] {
    const gapSize = svgCalcParams.cellSpacing + OVERLAP;

    // Split wrapped body parts into separated segments
    const bodySegments = splitBodySegments(body);

    // Get the center point of each body square we're going to render
    const bodySegmentsCenterPoints = bodySegments.map((segment) =>
      segment.map(enrichSvgCellCenter)
    );

    // Extend each wrapped segment towards border
    for (let i = 0; i < bodySegmentsCenterPoints.length; i++) {
      // Extend each segment last point towards border
      if (i < bodySegmentsCenterPoints.length - 1) {
        const cur = bodySegmentsCenterPoints[i].at(-1) as SvgPointWithCircleProps;
        const next = bodySegmentsCenterPoints[i + 1][0];
        bodySegmentsCenterPoints[i].push(calcBorderJoint(cur, next));
      }

      // Extend segment's first point toward border portal
      if (i > 0) {
        const cur = bodySegmentsCenterPoints[i][0];
        const prev = bodySegmentsCenterPoints[i - 1].at(-1) as Point;
        bodySegmentsCenterPoints[i].unshift(calcBorderJoint(cur, prev));
      }
    }

    // Extend first point towards head
    const firstPoint = bodySegmentsCenterPoints[0][0];
    if (isAdjacentPoint(head, firstPoint)) {
      bodySegmentsCenterPoints[0].unshift(calcJoint(firstPoint, head, gapSize));
    } else {
      // Add head portal
      bodySegmentsCenterPoints[0].unshift(calcBorderJoint(enrichSvgCellCenter(firstPoint), head));
    }

    // Extend last point towards tail
    const lastPoint = bodySegmentsCenterPoints.at(-1)?.at(-1) as SvgPointWithCircleProps;
    if (isAdjacentPoint(lastPoint, tail)) {
      bodySegmentsCenterPoints.at(-1)?.push(calcJoint(lastPoint, tail, gapSize));
    } else {
      // Add tail portal
      bodySegmentsCenterPoints.at(-1)?.push(calcBorderJoint(lastPoint, tail));
    }

    // Finally, return an array of SvgPoints to use for a polyline
    return bodySegmentsCenterPoints.map((segment) =>
      segment.map((obj) => ({ x: obj.cx, y: obj.cy }))
    );
  }

  function splitBodySegments(body: Point[]): Point[][] {
    if (body.length == 0) {
      return [[]];
    }

    let prev = body[0];
    const segments: Point[][] = [[prev]];

    for (let i = 1; i < body.length; i++) {
      const cur = body[i];

      // Start new segment
      if (!isAdjacentPoint(cur, prev)) {
        segments.push([]);
      }

      segments.at(-1)?.push(cur);
      prev = cur;
    }
    return segments;
  }

  function enrichSvgCellCenter(p: Point): SvgPointWithCircleProps {
    const c = svgCalcCellCenter(svgCalcParams, p);
    return {
      cx: c.x,
      cy: c.y,
      ...p
    };
  }

  function calcBorderJoint(src: SvgPointWithCircleProps, dst: Point): SvgPointWithCircleProps {
    const border = calcSourceWrapPosition(src, dst);

    return calcJoint(src, border);
  }

  function calcJoint(
    src: SvgPointWithCircleProps,
    dst: Point,
    gapSize = 0
  ): SvgPointWithCircleProps {
    // Extend source point towards destination
    if (dst.x > src.x) {
      return {
        ...src,
        cx: src.cx + svgCalcParams.cellSizeHalf + gapSize,
        cy: src.cy
      };
    } else if (dst.x < src.x) {
      return {
        ...src,
        cx: src.cx - svgCalcParams.cellSizeHalf - gapSize,
        cy: src.cy
      };
    } else if (dst.y > src.y) {
      return {
        ...src,
        cx: src.cx,
        cy: src.cy - svgCalcParams.cellSizeHalf - gapSize
      };
    } else if (dst.y < src.y) {
      return {
        ...src,
        cx: src.cx,
        cy: src.cy + svgCalcParams.cellSizeHalf + gapSize
      };
    }

    // In error cases there could be duplicate point
    throw new Error("Same point have no joint.");
  }

  function calcHeadToTailJoint(head: Point, tail: Point, svgCenter: Point): SvgPoint[] {
    if (head.x > tail.x) {
      return [
        {
          x: svgCenter.x - svgCalcParams.cellSizeHalf + OVERLAP,
          y: svgCenter.y
        },
        {
          x: svgCenter.x - svgCalcParams.cellSizeHalf - svgCalcParams.cellSpacing - OVERLAP,
          y: svgCenter.y
        }
      ];
    } else if (head.x < tail.x) {
      return [
        {
          x: svgCenter.x + svgCalcParams.cellSizeHalf - OVERLAP,
          y: svgCenter.y
        },
        {
          x: svgCenter.x + svgCalcParams.cellSizeHalf + svgCalcParams.cellSpacing + OVERLAP,
          y: svgCenter.y
        }
      ];
    } else if (head.y > tail.y) {
      return [
        {
          x: svgCenter.x,
          y: svgCenter.y + svgCalcParams.cellSizeHalf - OVERLAP
        },
        {
          x: svgCenter.x,
          y: svgCenter.y + svgCalcParams.cellSizeHalf + svgCalcParams.cellSpacing + OVERLAP
        }
      ];
    } else if (head.y < tail.y) {
      return [
        {
          x: svgCenter.x,
          y: svgCenter.y - svgCalcParams.cellSizeHalf + OVERLAP
        },
        {
          x: svgCenter.x,
          y: svgCenter.y - svgCalcParams.cellSizeHalf - svgCalcParams.cellSpacing - OVERLAP
        }
      ];
    }

    throw new Error("Head and tail is a same point.");
  }

  $: drawBody = bodyPolylinesPoints[0].length > 0;

  $: bodyPolylinesProps = bodyPolylinesPoints.map(calcBodyPolylineProps);

  function calcBodyPolylineProps(polylinePoints: SvgPoint[]) {
    // Convert points into a string of the format "x1,y1 x2,y2, ...
    const points = polylinePoints
      .map((p) => {
        return `${p.x},${p.y}`;
      })
      .join(" ");

    return {
      points,
      "stroke-width": svgCalcParams.cellSize,
      "stroke-linecap": "butt" as const,
      "stroke-linejoin": "round" as const
    };
  }
</script>

{#if drawBody}
  {#each bodyPolylinesProps as polylineProps}
    <polyline stroke={snake.color} fill="transparent" {...polylineProps} />
  {/each}
{/if}
