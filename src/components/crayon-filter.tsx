/**
 * 彩笔渲染：插画与标题共用的 SVG 滤镜。
 * 高频颗粒在笔画里挖出细碎空隙，边缘轻微毛糙；保持很淡，配合纸张风格。
 */
export function CrayonFilter() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <filter id="crayon" x="-3%" y="-3%" width="106%" height="106%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="grain" />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.3 1.4"
            result="paperTooth"
          />
          <feTurbulence type="turbulence" baseFrequency="0.22" numOctaves="1" seed="11" result="rough" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="rough"
            scale="1.8"
            xChannelSelector="R"
            yChannelSelector="B"
            result="roughEdge"
          />
          <feComposite in="roughEdge" in2="paperTooth" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}
