import React, { FC, useEffect } from "react";
import { observer } from "mobx-react";
import { TextValue } from "./TextValue";
import { TItem } from "../../models/Visualization";
import { useStore } from "../../Context";

interface SingleValuesProps {
  element: TItem;
}

export const SingleValues: FC<SingleValuesProps> = observer(({ element }) => {
  const store = useStore();
  useEffect(() => {
    element.setOu([store.selectedOrgUnit]);
    element.fetchFromAnalytics();
  }, [element, store.selectedOrgUnit]);
  return (
    <>
      {Object.values(element.chart).map((value: any, i: number) => (
        <TextValue
          key={i}
          color="#000066"
          label={value.title}
          value={value.value}
          width={value.width}
          className="red"
        />
      ))}
    </>
  );
});
