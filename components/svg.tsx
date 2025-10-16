"use client"
import React, { useRef, useEffect, useState } from "react"

function Svg() {
  // Array of the 20 animated path d attributes
  const animatedPaths = [
    "M378.699 295H575.718C584.003 295 590.718 301.716 590.718 310V404C590.718 412.284 597.434 419 605.718 419H861",
    "M377 279.5H593H606.5C614.784 279.5 621.5 286.216 621.5 294.5V313C621.5 321.284 628.216 328 636.5 328H868.5",
    "M376 264H630.5C638.784 264 645.5 257.284 645.5 249V236C645.5 227.716 652.216 221 660.5 221H866.5",
    "M375.5 248.5H569.5C577.784 248.5 584.5 241.784 584.5 233.5V179.5V104.5C584.5 96.2157 591.216 89.5 599.5 89.5H880",
    "M375.5 232H490C498.284 232 505 225.284 505 217V50C505 41.7157 511.716 35 520 35H723.5C731.784 35 738.5 28.2843 738.5 20V-117.5",
    "M360 311V362.5C360 370.784 366.716 377.5 375 377.5H489C497.284 377.5 504 384.216 504 392.5V625",
    "M344 311V392C344 400.284 350.716 407 359 407H458C466.284 407 473 413.716 473 422V622",
    "M328 311V362.5V422.75M270 623V498C270 489.716 276.716 483 285 483H313C321.284 483 328 476.284 328 468V422.75M328 422.75H369.5C377.784 422.75 384.5 429.466 384.5 437.75V628.5",
    "M313.5 311V433C313.5 441.284 306.784 448 298.5 448H181C172.716 448 166 454.716 166 463V623.5",
    "M297.5 311V360C297.5 368.284 290.784 375 282.5 375H125.5C117.216 375 110.5 381.716 110.5 390V518C110.5 526.284 103.784 533 95.5 533H-217.5",
    "M282 295H87C78.7157 295 72 301.716 72 310V406C72 414.284 65.2843 421 57 421H-223",
    "M281.5 279H98.5H62C53.7157 279 47 285.716 47 294V336C47 344.284 40.2843 351 32 351H-231.5",
    "M283 264H-221.5",
    "M283 249H50C41.7157 249 35 242.284 35 234V189C35 180.716 28.2843 174 20 174H-212",
    "M282.5 233.5H144.5C136.216 233.5 129.5 226.784 129.5 218.5V145C129.5 136.716 122.784 130 114.5 130H-228.5",
    "M297.5 218V185C297.5 176.716 290.784 170 282.5 170H229.5C221.216 170 214.5 163.284 214.5 155V-125",
    "M313 218.5V168V164.5C313 156.216 306.284 149.5 298 149.5H255C246.716 149.5 240 142.784 240 134.5V-96.5",
    "M360 217V187.5C360 179.216 366.716 172.5 375 172.5H450C458.284 172.5 465 165.784 465 157.5V30.5C465 22.2157 471.716 15.5 480 15.5H664.5C672.784 15.5 679.5 8.78427 679.5 0.5V-94",
    "M344 218.5V169C344 160.716 350.716 154 359 154H412.5C420.784 154 427.5 147.284 427.5 139V-99",
    "M329 218V136C329 127.716 335.716 121 344 121H386C394.284 121 401 114.284 401 106V-102"
  ]

  // We'll use refs to get the length of each path after mount
  const pathRefs = useRef<(SVGPathElement | null)[]>([])
  const [lengths, setLengths] = useState<number[]>([])

  useEffect(() => {
    // Get the length of each path
    setLengths(
      pathRefs.current.map((el) => (el ? el.getTotalLength() : 1000))
    )
  }, [])

  // Animate from outer to inner: reverse the order of animation begin times
  const total = animatedPaths.length

  return (
    <div>
      <svg width="721" height="506" viewBox="0 0 721 506" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="animated-gradient" x1="360" y1="0" x2="360" y2="506" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2EB9DF" stopOpacity="0" />
            <stop offset="0.5" stopColor="#2EB9DF" />
            <stop offset="1" stopColor="#9E00FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g>
          {animatedPaths.map((d, i) => {
            // Reverse the animation order: outermost path animates first, innermost last
            const begin = `${(total - 1 - i) * 0.08}s`
            const dur = `${1.5 + (i * 0.1)}s`
            return (
              <React.Fragment key={i}>
                {/* Static background path */}
                <path
                  d={d}
                  stroke="black"
                  strokeOpacity="0.15"
                  strokeWidth={6}
                  fill="none"
                />
                {/* Animated foreground path */}
                <path
                  ref={el => (pathRefs.current[i] = el)}
                  d={d}
                  stroke="url(#animated-gradient)"
                  strokeLinecap="round"
                  strokeWidth={6}
                  fill="none"
                >
                  {typeof lengths[i] === "number" && (
                    <>
                      <animate
                        attributeName="stroke-dasharray"
                        values={`0,${lengths[i]};${lengths[i]},0`}
                        keyTimes="0;1"
                        dur={dur}
                        begin={begin}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="stroke-dashoffset"
                        values={`${lengths[i]};0`}
                        keyTimes="0;1"
                        dur={dur}
                        begin={begin}
                        repeatCount="indefinite"
                      />
                    </>
                  )}
                </path>
              </React.Fragment>
            )
          })}
          
        </g>
      </svg>
    </div>
  )
}

export default Svg



