import React from "react";
import Honeycomb, {HoneycombProps} from "@/app/components/Honeycomb";

type HoneycombCarpetProps = HoneycombProps & {
    cols: number,
    rows: number,
    size: number, // height in px
};

export default function HoneycombCarpet({
                                            cols,
                                            rows,
                                            size,
                                            ...svgProps
                                        }: HoneycombCarpetProps) {
    const rowArray = Array.from({length: rows});
    const colArray = Array.from({length: cols});

    return (
            <div className={`flex`}>
                {
                    colArray.map(
                        (_, i) => {
                            const isOddCol = i % 2 === 1;

                            return (
                                <div key={`carpet-col-${i}`}
                                     style={{
                                         top: `${isOddCol ? size / 2 : 0}px`,
                                         left: `${-i * (size / 4 + size / 20)}px`,
                                     }}
                                     className={`relative flex flex-col`}>
                                    {
                                        rowArray.map(
                                            (_, j) => (
                                                <Honeycomb
                                                    key={`carpet-row-${j}`}
                                                    height={size}
                                                    {...svgProps}
                                                />
                                            )
                                        )
                                    }
                                </div>
                            )
                        }
                    )
                }
            </div>
    )
}